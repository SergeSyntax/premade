from pymongo import MongoClient
import logging
from typing import Optional

# Singleton instance for MongoClient
_mongo_client_instance: Optional[MongoClient] = None


def get_mongo_client(
    connection_string: str,
    username: str,
    password: str,
    serverSelectionTimeoutMS: int,
) -> MongoClient:
    """
    Creates and returns a MongoDB client as a singleton with retries and timeout.

    Args:
        connection_string (str): The MongoDB connection string including hosts and ports.
        username (str): The username for authentication.
        password (str): The password for authentication.
        serverSelectionTimeoutMS (int): Timeout in milliseconds for server selection.

    Returns:
        MongoClient: A connected MongoDB client instance.
    """
    global _mongo_client_instance

    if _mongo_client_instance is not None:
        logging.debug("Reusing existing MongoDB client instance.")
        return _mongo_client_instance

    logging.info(
        f"Initializing MongoDB client with connection string: {connection_string}, "
        f"serverSelectionTimeoutMS={serverSelectionTimeoutMS}ms."
    )

    # Instantiate MongoClient (connection will be established lazily)
    _mongo_client_instance = MongoClient(
        connection_string,
        username=username,
        password=password,
        serverSelectionTimeoutMS=serverSelectionTimeoutMS,
        replicaSet="replicaset",
    )

    logging.info("MongoDB client instance created successfully.")
    return _mongo_client_instance


def ensure_mongo_connection(client: MongoClient) -> None:
    """
    Validates the connection to the MongoDB server by pinging it.

    Args:
        client (MongoClient): The MongoDB client instance to validate.

    Raises:
        RuntimeError: If the connection to the MongoDB server fails.
    """
    try:
        logging.info("Validating connection to MongoDB server...")
        client.admin.command("ping")
        logging.info("Successfully connected to MongoDB.")
    except Exception as e:
        logging.error(f"Failed to connect to MongoDB: {e}")
        raise RuntimeError("Failed to connect to MongoDB.") from e


def create_user(
    admin_client: MongoClient, database: str, username: str, password: str
) -> None:
    """
    Creates a MongoDB user with specified roles for a database.

    Args:
        admin_client (MongoClient): A connected MongoDB client with admin privileges.
        database (str): The name of the database to assign roles to the user.
        username (str): The username for the new user.
        password (str): The password for the new user.

    Raises:
        RuntimeError: If the user creation fails.
    """

    roles = [{"role": "readWrite", "db": database}]

    logging.info(f"Creating user '{username}' with roles for database '{database}'")
    try:
        admin_client[database].command(
            "createUser", username, pwd=password, roles=roles
        )
        logging.info(
            f"User '{username}' created successfully with roles on database '{database}'."
        )
    except Exception as err:
        logging.error(
            f"Failed to create user '{username}' on database '{database}': {err}"
        )
        raise RuntimeError("failed to create user.") from err


def user_exists(client: MongoClient, database: str, username: str):
    """
    Check if a specific user exists in the given MongoDB database.

    This function queries the `system.users` collection to determine whether
    a user with the specified username exists in the provided database. If
    an error occurs during the operation (e.g., connectivity issues or database
    errors), a RuntimeError is raised to signal a failure.

    Parameters:
        client (MongoClient): The MongoDB client instance.
        database (str): The name of the database to query.
        username (str): The username to check for existence.

    Returns:
        bool: True if the user exists in the database, False otherwise.

    Raises:
        RuntimeError: If an error occurs while querying the database.

    Logging:
        - DEBUG: Logs the user existence check.
        - INFO: Logs whether the user exists and the document count.
        - ERROR: Logs any errors encountered during the operation, including
          stack trace information.
    """
    try:
        logging.debug(f"Checking if user '{username}' exists in database '{database}'")

        db = client[database]
        collection = db["system.users"]
        user_count = collection.count_documents({"user": username})
        logging.debug(
            f"User '{username}' exists: {bool(user_count)} (Count: {user_count})"
        )

        return bool(user_count)
    except Exception as err:
        logging.error(
            f"Error while checking user '{username}' existence in database '{database}': {err}",
            exc_info=True,
        )
        # Raise the exception to signal the failure to the main logic
        raise RuntimeError(
            f"Failed to check user '{username}' in database '{database}'"
        ) from err
