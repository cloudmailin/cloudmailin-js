# Changelog 📝

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.2] - 2026-11-06

### Changed
- Increased the minimum axios version to ^1.18.0 to pick up upstream security fixes (proxy handling, redirects and ReDoS), and kept the lockfile on the current 1.x release
- Added `overrides` pinning `follow-redirects`, `minimatch` and `js-yaml` to patched versions so `npm audit` reports no known vulnerabilities
- Package is now built with TypeScript 6 targeting ES2022 (no change to the published JavaScript or type definitions)
- Development dependencies bumped (typescript-eslint v8, ts-jest, typedoc) and `openapi-typescript` removed

## [0.3.1] - 2026-03-04

### Added
- `markdown` field on the `Message` type. A message now needs one of `plain`, `html` or `markdown`; markdown is converted to HTML on delivery and a plain text part is generated if none is given

## [0.3.0] - 2026-03-04

### Changed
- Node.js 20 or later is now required (`engines` field added); Node 16 and 18 are no longer supported
- Increased the axios version to 1.13.6 in the lockfile
- Development dependencies bumped (TypeScript 5.9, typedoc 0.28, `@types/node` 22) and `minimatch` overridden to fix a ReDoS vulnerability

## [0.2.0] - 2025-09-16

### Added
- Support for initializing MessageClient using `CLOUDMAILIN_SMTP_URL` environment variable
- Support for passing `smtpUrl` directly as an option in MessageClientOptions

### Changed
- MessageClient constructor signature simplified to accept `MessageClientOptions` (where all fields are now optional)

## [0.1.0] - 2024-01-23

### Changed

- Using node 16 rather than 14 to develop the package
- Increased the axios version to ^1.0.0 allowing the use of any 1.x version.
- Increased version of Jest used for testing
- Increased package versions of dependencies with npm audit fix

### Contributors

- [@sakgoyal](https://github.com/sakgoyal)
