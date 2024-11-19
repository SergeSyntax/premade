# MongoDB Initialization Job

This script automates the creation of MongoDB users and databases during the initial setup. It reads configurations from environment variables and creates users with appropriate permissions.

## Requirements

- Python (<= 3.11.5)
- Virtual environment support

## Setup

### 1. Navigate to the directory

Go to the `operations/mongo-init` directory in your project:

```bash
cd operations/mongo-init
```

### 2. Create and activate a virtual environment

Set up a Python virtual environment and activate it:

```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install dependencies

Install the required Python dependencies:

```bash
pip install -r requirements.txt
```

### 4. Configure environment variables

Set the following environment variables in your shell or create a `.env` file in the `operations/mongo-init` directory with the following content:

```bash
export MONGODB_INITIAL_PRIMARY_HOST="mongodb-primary"
export MONGODB_INITIAL_PRIMARY_PORT_NUMBER="27017"
export MONGODB_INITIAL_PRIMARY_ROOT_USER="root"
export MONGODB_INITIAL_PRIMARY_ROOT_PASSWORD="password123"

export MONGODB_EXTRA_USERNAMES="user1,user2,user3"
export MONGODB_EXTRA_PASSWORDS="pass1,pass2,pass3"
export MONGODB_EXTRA_DATABASES="db1,db2,db3"
```

To use a `.env` file, you can leverage tools like `python-dotenv` to automatically load these variables.

### 5. Run the script

Execute the script to create the users and databases:

```bash
export PYTHONPATH=$(pwd)
python -m app.main
```

## Environment Variable Details

| Variable                                | Description                            | Default Value       |
| --------------------------------------- | -------------------------------------- | ------------------- |
| `MONGODB_INITIAL_PRIMARY_HOST`          | MongoDB primary host address           | `mongodb-primary`   |
| `MONGODB_INITIAL_PRIMARY_PORT_NUMBER`   | MongoDB primary port                   | `27017`             |
| `MONGODB_INITIAL_PRIMARY_ROOT_USER`     | Root user for MongoDB                  | `root`              |
| `MONGODB_INITIAL_PRIMARY_ROOT_PASSWORD` | Password for root user                 | `password123`       |
| `MONGODB_EXTRA_USERNAMES`               | Comma-separated list of new usernames  | `user1,user2,user3` |
| `MONGODB_EXTRA_PASSWORDS`               | Comma-separated list of user passwords | `pass1,pass2,pass3` |
| `MONGODB_EXTRA_DATABASES`               | Comma-separated list of databases      | `db1,db2,db3`       |

## Testing the Initialization

Ensure the MongoDB instance is running before executing the script. For example, using Docker Compose:

```bash
docker compose up
```

After running the script, you can verify user and database creation using the `mongo` shell:

```bash
mongo -u <username> -p <password> --authenticationDatabase <database>
```

## Clean Up

To deactivate the virtual environment:

```bash
deactivate
```

To remove the virtual environment:

```bash
rm -rf venv
```

## Troubleshooting

- **Environment Variable Errors**: Ensure all required environment variables are set correctly. Mismatched counts of usernames, passwords, and databases will result in an error.
- **Dependency Issues**: Ensure all dependencies are installed via `pip install -r requirements.txt`.
- **MongoDB Connection Errors**: Verify that the MongoDB instance is accessible and that the root credentials are correct.
