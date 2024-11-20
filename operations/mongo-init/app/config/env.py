from os import getenv as _getenv

# root credentials
MONGODB_INITIAL_PRIMARY_HOST = _getenv(
    "MONGODB_INITIAL_PRIMARY_HOST", "localhost,localhost,localhost"
)
MONGODB_INITIAL_PRIMARY_PORT_NUMBER = _getenv(
    "MONGODB_INITIAL_PRIMARY_PORT_NUMBER", "27017,27018,27019"
)
MONGODB_INITIAL_PRIMARY_ROOT_USER = _getenv("MONGODB_INITIAL_PRIMARY_ROOT_USER", "root")
MONGODB_INITIAL_PRIMARY_ROOT_PASSWORD = _getenv(
    "MONGODB_INITIAL_PRIMARY_ROOT_PASSWORD", "password123"
)
30000

# users with passwords and databases to create
MONGODB_EXTRA_USERNAMES = _getenv("MONGODB_EXTRA_USERNAMES", "orders-user,media-user,auth-user")
MONGODB_EXTRA_DATABASES = _getenv("MONGODB_EXTRA_DATABASES", "orders,media,auth")
MONGODB_EXTRA_PASSWORDS = _getenv("MONGODB_EXTRA_PASSWORDS", "admin,admin,admin")

SERVER_SELECTION_TIMEOUT_MS = _getenv(
    "SERVER_SELECTION_TIMEOUT_MS", "30000"
)  # milliseconds
