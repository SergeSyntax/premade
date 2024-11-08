#!/bin/sh

function create_bucket() {
      local bucket_name=$1

      if mc ls "${bucket_name}" > /dev/null 2>&1; then
            echo "Bucket ${bucket_name} already exists. Skipping creation.";
      else
            mc mb "${bucket_name}";
      fi;
}

mc alias set "${CLIENT_NAME}" "${MIO_ENDPOINT}" "${MINIO_ROOT_USER}" "${MINIO_ROOT_PASSWORD}" || exit 1;
create_bucket "${CLIENT_NAME}/${MIO_BUCKET}";
mc admin user add "${CLIENT_NAME}" "${MIO_ACCESS_KEY}" "${MIO_SECRET_KEY}";
mc admin policy create "${CLIENT_NAME}" media-policy /root/policies/media-bucket.json;
mc admin policy attach "${CLIENT_NAME}" media-policy --user "${MIO_ACCESS_KEY}";
