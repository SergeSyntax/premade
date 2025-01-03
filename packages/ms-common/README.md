# ms-common TODO: test 3

> ⚠️ **Note:** This package relies heavily on environment variables for configuration. Ensure that all required variables are properly set in your environment to prevent runtime errors or unexpected behavior.

a reusable library designed to streamline common operations such as database connections, logging, and event handling. It is optimized for use in projects under the **media-premade** ecosystem.

## Table of Contents

1. [Installation](#installation)
2. [Usage](#usage)
3. [Configuration](#configuration)
4. [Publishing the Package](#publishing-the-package)
5. [Deployment](#deployment)

## Installation

```bash
pnpm add @media-premade/ms-common
```

## Usage

### Basic Example

```javascript
import msCommon from "@media-premade/ms-common";
import { logger } from "@media-premade/ms-common/lib/logger";

// Initialize msCommon and use logger
logger.info("msCommon initialized successfully!");
```

## Configuration

### Required Environment Variables

This library uses environment variables to configure its behavior. Below is a list of supported variables, their purposes, and defaults:

| Variable         | Default         | Description                          | Valid Values                        |
| ---------------- | --------------- | ------------------------------------ | ----------------------------------- |
| `NODE_ENV`       | `development`   | Defines the runtime environment.     | `development`, `production`, `test` |
| `WRITE_LOG_FILE` | `false`         | Enable/disable writing logs to file. | `true`, `false`                     |
| `LOG_AS_JSON`    | `false`         | Format logs as JSON.                 | `true`, `false`                     |
| `LOG_LEVEL`      | `debug`         | Set the logging verbosity level.     | `debug`, `info`, `warn`, `error`    |
| `JWT_SECRET`     | `"some_secret"` | Secure key for JWT operations.       | Any string                          |

**Note**: Always ensure environment variables are explicitly set in production environments to avoid unexpected behavior.

## Publishing the Package

Follow these steps to publish the package to the npm registry:

### Prerequisites

1. Ensure you are logged into the npm registry:

   ```bash
   pnpm adduser
   ```

2. Confirm you have the necessary permissions to publish the package.

### Steps to Publish

1. **Build the Package**

   ```bash
   pnpm build
   ```

2. **Version the Package**
   Increment the version based on the type of release:

   - **Patch** (e.g., `1.0.0` → `1.0.1`):
     ```bash
     pnpm version patch
     ```
   - **Minor** (e.g., `1.0.0` → `1.1.0`):
     ```bash
     pnpm version minor
     ```
   - **Major** (e.g., `1.0.0` → `2.0.0`):
     ```bash
     pnpm version major
     ```

3. **Publish**
   Publish the package to the npm registry:
   ```bash
   pnpm publish --no-git-checks
   ```

## Deployment

### Environment Preparation

Ensure all required environment variables are set correctly.

### Steps to Deploy

1. Build the package:

   ```bash
   pnpm build
   ```

2. Publish the package following the steps above.

3. Update consuming projects with the latest version:
   ```bash
   pnpm add @media-premade/ms-common
   ```
