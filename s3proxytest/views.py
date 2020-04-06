from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from rest_framework.renderers import JSONRenderer
from rest_framework.views import APIView
from django.views.generic import TemplateView
from django.conf import settings
import boto3
import logging

logger = logging.getLogger(__name__)


class IndexView(TemplateView):
    template_name = "index.html"


class ListBucketView(APIView):
    """
    simple proxy of the S3 ListObjects call
    """
    renderer_classes = (JSONRenderer, )
    parser_classes = (JSONParser, )

    def get(self, *args, **kwargs):
        try:
            return self.inner_get(*args, **kwargs)
        except Exception as e:
            logger.error("Uncaught exception in get handler", exc_info=e)
            return Response({"status":"error","detail":e.message}, status=500)

    def inner_get(self, *args, **kwargs):
        """
        basic GET handler, connect to the bucket and get the given page of results
        :param args:
        :param kwargs:
        :return:
        """
        target_bucket = getattr(settings, "S3_BUCKET")
        if target_bucket is None:
            return Response({"status":"error","detail":"Server is misconfigured, missing S3_BUCKET parameter"}, status=500)

        maybe_continuation_token = self.request.GET.get("cont")
        logger.debug("continuation token is {0}".format(maybe_continuation_token))

        maybe_prefix = self.request.GET.get("prefix")
        logger.debug("prefix is {0}".format(maybe_prefix))
        s3client = boto3.client('s3', region_name=getattr(settings,"S3_REGION"))

        args = {
            "Bucket": target_bucket,
            "Delimiter": "/",
            "EncodingType": "url",
            "FetchOwner": False
        }

        if maybe_continuation_token is not None:
            args["ContinuationToken"] = maybe_continuation_token
        if maybe_prefix is not None:
            args["Prefix"] = maybe_prefix

        result = s3client.list_objects_v2(**args
            # Bucket=target_bucket,
            # Delimiter="/",
            # EncodingType="url",
            # Prefix=maybe_prefix,
            # ContinuationToken=maybe_continuation_token,
            # FetchOwner=False
        )

        return Response({
            "status": "ok",
            "isTruncated": result.get("IsTruncated"),
            "continuationToken": result.get("NextContinuationToken"),
            "files": result.get("Contents"),
            "dirs": result.get("CommonPrefixes"),
        })