# Premade Media

> A DevOps example project simulating a video streaming platform. Designed to test DevOps utilities and microservices scaling solutions, this project leverages **Node.js** for services and **Python/Bash** for cron jobs, tasks, and initialization operations.

---

## Table of Contents

1. [Overview](#overview)
2. [Structure](#structure)
3. [Installation](#installation)
4. [Creating a Package](#creating-a-package)

---

## Overview

This monorepo is built to demonstrate and test the following:

- Microservices architecture
- Horizontal scaling of services
- Integration of **Node.js**, **Python**, and **Bash** for operations
- Efficient deployment and monitoring strategies for a video streaming platform

---

## Structure

The repository is organized into the following sections:

- `packages/`: Contains reusable libraries and modules.
  - Example: [ms-common](./packages/ms-common/README.md) - A utility library for common operations like database management, logging, and event handling.
- `services/`: Microservices that provide the core functionality of the platform.
- `operations/`: Python and Bash scripts for cron jobs, initialization tasks, and other operational utilities.

---

## Installation

1. Enable **Corepack** and prepare the latest **pnpm** version:

   ```bash
   corepack enable
   corepack prepare pnpm@latest --activate
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

---

## Creating a Package

Use **Lerna** to create new packages or services within the monorepo.

### Example: Creating a Library

```bash
pnpm dlx lerna create ms-common packages --private --yes
```

### Example: Creating a Service

```bash
pnpm dlx lerna create auth services --private --yes
```

---

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature
   ```
3. Commit your changes with clear commit messages.
4. Push your branch and create a pull request.
