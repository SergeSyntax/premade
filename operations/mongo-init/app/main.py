import logging

from app.utils.mongo import (
    get_mongo_client,
    create_user,
    ensure_mongo_connection,
    user_exists,
)
from app.config import env
from app.utils.parse import parse_mongo_users, generate_mongo_connection_strings
import time

# https://pymongo.readthedocs.io/en/stable/api/pymongo/mongo_client.html#pymongo.mongo_client.MongoClient


def main():
    logging.basicConfig(
        level=logging.INFO,  # Set to DEBUG to capture all logs
        format="%(asctime)s - %(levelname)s - %(message)s",  # Include timestamp and log level
    )

    client_connection_str = generate_mongo_connection_strings(
        env.MONGODB_INITIAL_PRIMARY_HOST, env.MONGODB_INITIAL_PRIMARY_PORT_NUMBER
    )
    logging.info("Starting MongoDB connection test...")
    client = get_mongo_client(
        client_connection_str,
        env.MONGODB_INITIAL_PRIMARY_ROOT_USER,
        env.MONGODB_INITIAL_PRIMARY_ROOT_PASSWORD,
        env.SERVER_SELECTION_TIMEOUT_MS,
    )
    ensure_mongo_connection(client)

    users = parse_mongo_users(
        env.MONGODB_EXTRA_USERNAMES,
        env.MONGODB_EXTRA_PASSWORDS,
        env.MONGODB_EXTRA_DATABASES,
    )

    def user_exists(database: str, username: str):
        db = client[database]
        collection = db["system.users"]

        user_count = collection.count_documents({"user": user.get("username")})
        return bool(user_count)


# Function to check if a user exists
def user_exists(database: str, username: str) -> bool:
    try:
        logging.debug(
            f"Checking if user '{username}' exists in database '{database}'..."
        )
        db = client[database]
        collection = db["system.users"]

        # Count documents matching the username
        user_count = collection.count_documents({"user": username})
        logging.info(
            f"User '{username}' exists: {bool(user_count)} (Count: {user_count})"
        )
        return bool(user_count)
    except Exception as e:
        logging.error(
            f"Error while checking user '{username}' in database '{database}': {e}"
        )
        return False

    for user in users:
        is_exist = user_exists(user["database"], user["username"])
        if is_exist:
            logging.info(
                f"User '{user['username']}' already exists in database '{user['database']}'. Skipping creation."
            )
        else:
            create_user(client, **user)



if __name__ == "__main__":
    main()
