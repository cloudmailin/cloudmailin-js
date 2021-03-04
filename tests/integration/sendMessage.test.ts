import * as cloudmailin from "../../src/index";
import { MessageClientOptions } from "../../src/messageClient"

const UUID = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;

describe("sendMessage", () => {
  const credentials = <MessageClientOptions>{
    username: process.env.MESSAGE_USERNAME,
    apiKey: process.env.MESSAGE_API_KEY,
    baseURL: process.env.MESSAGE_BASE_URL
  };

  if (!(credentials.username && credentials.apiKey && credentials.baseURL)) {
    throw new Error("Test credentials are required");
  }

  test("returns an ID for a successful send", async () => {
    const client = new cloudmailin.MessageClient(credentials);
    const response = await client.sendMessage({
      to: 'recipient@example.com',
      from: 'from@example.net',
      plain: 'test message',
      subject: "hello world"
    });

    expect(response.id).toMatch(UUID);
  });

  test("raises a 401 error when passing invalid credentials", async () => {
    const client = new cloudmailin.MessageClient({ ...credentials, apiKey: 'foo' });
    await expect(async () => {
      await client.sendMessage({
        to: 'recipient@example.com',
        from: 'from@example.net',
        plain: 'test message',
        subject: "hello world"
      });
    }).rejects.toThrowError(cloudmailin.Errors.CloudMailinError);
  });

  test("raises an error containing the remote error", async () => {
    const client = new cloudmailin.MessageClient(credentials);
    await expect(async () => {
      await client.sendMessage({
        to: 'recipient@example.com',
        from: 'from@example.net',
      });
    }).rejects.toThrowError(/body not found/i);
  });

  test("raises a UnprocessableEntity error", async () => {
    const client = new cloudmailin.MessageClient(credentials);
    await expect(async () => {
      await client.sendMessage({
        to: 'recipient@example.com',
        from: 'from@example.net',
      });
    }).rejects.toThrowError(cloudmailin.Errors.CloudMailinError);
  });
});
