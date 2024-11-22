to test run the script:
```
docker run \
  --network host \
  --restart on-failure \
  -e MINIO_SERVER_HOST=localhost \
  -e MINIO_SERVER_PORT_NUMBER=9000 \
  -e MINIO_SERVER_SCHEME=http \
  -e MINIO_SERVER_ROOT_USER=minioadmin \
  -e MINIO_SERVER_ROOT_PASSWORD=minioadmin \
  -e MINIO_BUCKET_USER=app_user \
  -e MINIO_BUCKET_PASSWORD=premade-pass \
  -e MINIO_ACCESS_KEY=fi6agQe0bYLFLT2BPSZ4 \
  -e MINIO_SECRET_KEY=qKaR1V0sbmhRSPdWG6BBEBtAcW0YswSC7BDO9sMo \
  -v "$(pwd)/docker/scripts/minio:/app/scripts" \
  -v "$(pwd)/docker/config/minio:/app/templates" \
  --entrypoint /app/scripts/entrypoint.sh \
  bitnami/minio-client:2024
```

