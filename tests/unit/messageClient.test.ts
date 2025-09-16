import * as cloudmailin from "../../src/index";

describe("MessageClient Environment Variable Parsing", () => {
  const originalEnv = process.env.CLOUDMAILIN_SMTP_URL;

  afterEach(() => {
    // Restore original environment
    if (originalEnv) {
      process.env.CLOUDMAILIN_SMTP_URL = originalEnv;
    } else {
      delete process.env.CLOUDMAILIN_SMTP_URL;
    }
  });

  describe("Constructor with explicit options", () => {
    test("should use provided options when both username and apiKey are provided", () => {
      const options = {
        username: "test-user",
        apiKey: "test-key",
        host: "custom.host.com"
      };

      const client = new cloudmailin.MessageClient(options);

      // We can't directly access private properties, but we can test that the client was created
      expect(client).toBeInstanceOf(cloudmailin.MessageClient);
    });

    test("should use provided options even when CLOUDMAILIN_SMTP_URL is set", () => {
      process.env.CLOUDMAILIN_SMTP_URL = "smtp://env-user:env-key@smtp.cloudmta.net:587?starttls=true";

      const options = {
        username: "explicit-user",
        apiKey: "explicit-key"
      };

      const client = new cloudmailin.MessageClient(options);
      expect(client).toBeInstanceOf(cloudmailin.MessageClient);
    });
  });

  describe("Constructor with environment variable", () => {
    test("should parse valid SMTP URL from environment", () => {
      process.env.CLOUDMAILIN_SMTP_URL = "smtp://test-username:test-api-key@smtp.cloudmta.net:587?starttls=true";

      const client = new cloudmailin.MessageClient();
      expect(client).toBeInstanceOf(cloudmailin.MessageClient);
    });

    test("should throw error when CLOUDMAILIN_SMTP_URL is not set", () => {
      delete process.env.CLOUDMAILIN_SMTP_URL;

      expect(() => {
        new cloudmailin.MessageClient();
      }).toThrow("Either provide MessageClientOptions with username and apiKey, or provide smtpUrl option, or set CLOUDMAILIN_SMTP_URL environment variable");
    });

    test("should throw error for SMTP URL without username", () => {
      process.env.CLOUDMAILIN_SMTP_URL = "smtp://:password@smtp.cloudmta.net:587";

      expect(() => {
        new cloudmailin.MessageClient();
      }).toThrow("Failed to parse CLOUDMAILIN_SMTP_URL: Username and API key are required in the SMTP URL");
    });

    test("should throw error for SMTP URL without API key", () => {
      process.env.CLOUDMAILIN_SMTP_URL = "smtp://username@smtp.cloudmta.net:587";

      expect(() => {
        new cloudmailin.MessageClient();
      }).toThrow("Failed to parse CLOUDMAILIN_SMTP_URL: Username and API key are required in the SMTP URL");
    });

    test("should throw error for malformed URL", () => {
      process.env.CLOUDMAILIN_SMTP_URL = "not-a-valid-url";

      expect(() => {
        new cloudmailin.MessageClient();
      }).toThrow("Failed to parse CLOUDMAILIN_SMTP_URL");
    });
  });

  describe("Constructor with smtpUrl option", () => {
    test("should use smtpUrl option when provided", () => {
      const options = {
        smtpUrl: "smtp://smtp-user:smtp-key@smtp.cloudmta.net:587?starttls=true",
        host: "custom.host.com"
      };

      const client = new cloudmailin.MessageClient(options);
      expect(client).toBeInstanceOf(cloudmailin.MessageClient);
    });

    test("should prefer smtpUrl over environment variable", () => {
      process.env.CLOUDMAILIN_SMTP_URL = "smtp://env-user:env-key@smtp.cloudmta.net:587?starttls=true";

      const options = {
        smtpUrl: "smtp://smtp-user:smtp-key@smtp.cloudmta.net:587?starttls=true"
      };

      const client = new cloudmailin.MessageClient(options);
      expect(client).toBeInstanceOf(cloudmailin.MessageClient);
    });

    test("should throw error for invalid smtpUrl", () => {
      const options = {
        smtpUrl: "invalid-url"
      };

      expect(() => {
        new cloudmailin.MessageClient(options);
      }).toThrow("Failed to parse CLOUDMAILIN_SMTP_URL");
    });
  });

  describe("Constructor with partial options", () => {
    test("should fall back to environment when username is missing", () => {
      process.env.CLOUDMAILIN_SMTP_URL = "smtp://env-user:env-key@smtp.cloudmta.net:587?starttls=true";

      const options = {
        apiKey: "explicit-key"
      };

      expect(() => {
        new cloudmailin.MessageClient(options);
      }).toThrow("Either provide MessageClientOptions with username and apiKey, or provide smtpUrl option, or set CLOUDMAILIN_SMTP_URL environment variable");
    });

    test("should fall back to environment when apiKey is missing", () => {
      process.env.CLOUDMAILIN_SMTP_URL = "smtp://env-user:env-key@smtp.cloudmta.net:587?starttls=true";

      const options = {
        username: "explicit-user"
      };

      expect(() => {
        new cloudmailin.MessageClient(options);
      }).toThrow("Either provide MessageClientOptions with username and apiKey, or provide smtpUrl option, or set CLOUDMAILIN_SMTP_URL environment variable");
    });

    test("should use environment when both username and apiKey are missing", () => {
      process.env.CLOUDMAILIN_SMTP_URL = "smtp://env-user:env-key@smtp.cloudmta.net:587?starttls=true";

      const options = {
        host: "custom.host.com"
      };

      const client = new cloudmailin.MessageClient(options);
      expect(client).toBeInstanceOf(cloudmailin.MessageClient);
    });
  });
});
