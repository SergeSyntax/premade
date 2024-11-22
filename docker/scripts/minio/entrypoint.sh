#!/bin/bash

# https://min.io/docs/minio/linux/reference/minio-mc-admin.html?ref=docs-redirect

function exit_error() {
      local message=$1
      local status=${2:-1}

      echo "${message}"
      exit "${status}"
}

# Debug log to confirm the script execution
echo "Starting entrypoint script..."

hostname="${MINIO_SERVER_SCHEME}://${MINIO_SERVER_HOST}:${MINIO_SERVER_PORT_NUMBER}"

mc alias set local "${hostname}" "${MINIO_SERVER_ROOT_USER}" "${MINIO_SERVER_ROOT_PASSWORD}" || exit_error "Failed to configure MinIO client. exiting."
# # mc ls local
function generate_users() {
      local users=$(mc admin user ls local --json | jq -r '.accessKey' || exit_error "Failed to configure MinIO client. exiting.")

      if echo $users | grep -vq "${MINIO_BUCKET_USER}";then
            mc admin user add local $MINIO_BUCKET_USER $MINIO_BUCKET_PASSWORD            
      else
            echo "User $MINIO_BUCKET_USER already exists. Skipping."
      fi

      mc admin accesskey create local/"${MINIO_BUCKET_USER}"\
      --access-key="${MINIO_ACCESS_KEY}" --secret-key="${MINIO_SECRET_KEY}" 


      for bucket in $(mc ls local | awk '{print $NF}' | sed 's:/$::'); do
            # Generate resources dynamically for the policy
            local policy_name="${bucket}_policy"
            local policy_file="/tmp/${policy_name}.json"
            sed "s|\${BUCKET_NAME}|$bucket|g" /app/templates/policy-template.json > $policy_file
            mc admin policy create local "$policy_name" "$policy_file" || exit_error "Failed to create policy $policy_name. Exiting."
         # Attach the policy to the user
            mc admin policy attach local $policy_name --user "$MINIO_BUCKET_USER" || exit_error "Failed to attach policy $policy_name to user $MINIO_BUCKET_USER. Exiting."

            echo "Policy $policy_name attached to user $MINIO_BUCKET_USER for bucket $bucket."
done
}


generate_users
mc admin info local
