# Changelog 📝

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
