from typing import Literal


def generate_mongo_connection_strings(hosts: str = "", ports: str = "") -> list[str]:
    """
    Generates MongoDB connection strings for given hosts and ports.

    Args:
        hosts (str): Comma-separated hostnames or IP addresses.
        ports (str): Comma-separated port numbers corresponding to the hosts.

    Raises:
        ValueError: If any of the required inputs are missing or invalid.

    Returns:
        list[str]: A list of MongoDB connection strings.
    """
    host_list = [h.strip() for h in hosts.split(",") if h.strip()]
    port_list = [p.strip() for p in ports.split(",") if p.strip()]
    host_list_len = len(host_list)
    port_list_len = len(port_list)

    if not host_list_len:
        raise ValueError("Hosts are required to generate MongoDB connection strings.")

    if not port_list_len:
        raise ValueError("Ports are required to generate MongoDB connection strings.")

    if host_list_len != port_list_len:
        raise ValueError(
            f"Mismatch in counts: hosts ({host_list_len}) and ports ({port_list_len}). "
            "Ensure they have the same number of entries."
        )

    # Join hosts and ports into a single string
    connection_parts = [f"{host}:{port}" for host, port in zip(host_list, port_list)]
    return f"mongodb://{','.join(connection_parts)}"


def parse_mongo_users(
    databases: str = "", usernames: str = "", passwords: str = ""
) -> list[dict[Literal["database", "username", "password"], str]]:
    """
    Parses MongoDB user details and validates input.

    Args:
        databases (str): Comma-separated database names.
        usernames (str): Comma-separated usernames.
        passwords (str): Comma-separated passwords.

    Raises:
        ValueError: If any of the required inputs are missing or invalid.

    Returns:
        list[dict[Literal["username", "password", "database"], str]]:
        A list of dictionaries with fixed keys and string values.
    """
    database_list = [d.strip() for d in databases.split(",") if d.strip()]
    username_list = [u.strip() for u in usernames.split(",") if u.strip()]
    password_list = [p.strip() for p in passwords.split(",") if p.strip()]
    database_list_len = len(database_list)
    username_list_len = len(username_list)
    password_list_len = len(password_list)

    if not database_list_len:
        raise ValueError("Passwords are required to create MongoDB users.")
    if not username_list_len:
        raise ValueError("Usernames are required to create MongoDB users.")
    if not password_list_len:
        raise ValueError("Databases are required to create MongoDB users.")

    if username_list_len != password_list_len or username_list_len != database_list_len:
        raise ValueError(
            f"Mismatch in counts: usernames ({username_list_len}), passwords ({password_list_len}), "
            f"databases ({database_list_len}). Ensure they have the same number of entries."
        )

    return [
        {"database": database, "username": username, "password": password}
        for database, username, password in zip(
            database_list, username_list, password_list
        )
    ]
