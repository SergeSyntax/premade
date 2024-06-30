# `ms-common`

> TODO: description

## Usage

```
const msCommon = require('ms-common');

// TODO: DEMONSTRATE API
```



## Publish

### prerequisites

- require login to npm registry
```bash
pnpm adduser
```

before publishing increment the version:

Patch version (e.g., 1.0.0 to 1.0.1):
```bash
npm version patch
```

Minor version (e.g., 1.0.0 to 1.1.0):
```bash
npm version minor
```

Major version (e.g., 1.0.0 to 2.0.0):
```bash
npm version major
```



to publish the package cd into it and run:
```bash
pnpm publish --access=public --no-git-checks
```
