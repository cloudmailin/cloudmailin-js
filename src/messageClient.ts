import { Message, MessageRaw, MessageResponse } from "./models/message";
import * as errors from "./models/errors";
import axios, { AxiosError, AxiosRequestConfig } from "axios";

// Allow us to easily fetch the current version from the package without hacks
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { version } = require("../package.json");

export interface MessageClientOptions {
  username?: string,
  apiKey?: string;
  host?: string;
  baseURL?: string;
  smtpUrl?: string;
}

interface ParsedSMTPUrl {
  username: string;
  apiKey: string;
}

/**
 * Parses a CloudMailin SMTP URL to extract username and API key
 * @param smtpUrl - URL in format: smtp://username:apikey@host:port?params
 * @returns Parsed username and API key
 */
function parseSMTPUrl(smtpUrl: string): ParsedSMTPUrl {
  try {
    const url = new URL(smtpUrl);
    const username = url.username;
    const apiKey = url.password;

    if (!username || !apiKey) {
      throw new Error('Username and API key are required in the SMTP URL');
    }

    return { username, apiKey };
  } catch (error) {
    throw new Error(`Failed to parse CLOUDMAILIN_SMTP_URL: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Creates MessageClientOptions from environment variables or provided options
 * @param options - Optional MessageClientOptions
 * @returns MessageClientOptions with values from options or environment
 */
function createOptions(options?: MessageClientOptions): MessageClientOptions {
  // If options are provided and have both required fields, use them
  if (options?.username && options?.apiKey) {
    return {
      username: options.username,
      apiKey: options.apiKey,
      host: options.host,
      baseURL: options.baseURL
    };
  }

  // If smtpUrl is provided in options, use it
  if (options?.smtpUrl) {
    const parsed = parseSMTPUrl(options.smtpUrl);
    return {
      username: parsed.username,
      apiKey: parsed.apiKey,
      host: options.host,
      baseURL: options.baseURL
    };
  }

  // If partial options are provided but missing required fields, throw error
  if (options && (options.username || options.apiKey)) {
    throw new Error('Either provide MessageClientOptions with username and apiKey, or provide smtpUrl option, or set CLOUDMAILIN_SMTP_URL environment variable');
  }

  // Otherwise, try to parse from environment variable
  const smtpUrl = process.env.CLOUDMAILIN_SMTP_URL;
  if (!smtpUrl) {
    throw new Error('Either provide MessageClientOptions with username and apiKey, or provide smtpUrl option, or set CLOUDMAILIN_SMTP_URL environment variable');
  }

  const parsed = parseSMTPUrl(smtpUrl);

  return {
    username: parsed.username,
    apiKey: parsed.apiKey,
    host: options?.host,
    baseURL: options?.baseURL
  };
}

type requestMethod = AxiosRequestConfig['method'];

export default class MessageClient {
  private options: MessageClientOptions;
  private version: string;

  constructor(options?: MessageClientOptions) {
    this.version = version;
    this.options = createOptions(options);

    this.options.host = this.options.host || "api.cloudmailin.com";
    this.options.baseURL = this.options.baseURL || `https://${this.options.host}/api/v0.1`;
  }

  public sendMessage(message: Message): Promise<MessageResponse> {
    return this.makeRequest("POST", "/messages", message);
  }

  public sendRawMessage(message: MessageRaw): Promise<MessageResponse> {
    return this.makeRequest("POST", "/messages", message);
  }

  // Allow body to be anything
  // eslint-disable-next-line @typescript-eslint/ban-types
  private makeRequest<T>(method: requestMethod, path: string, body?: object): Promise<T> {
    const client = this.makeClient();

    return client.request<T>({
      method: method,
      url: path,
      data: body
    })
      .then((response) => response.data)
      .catch((error) => {
        const newError = this.handleError(error);
        throw newError;
      });
  }

  // Wrap the error in our own error class, in future we may have
  // more specific errors for different types of error.
  private handleError(error: AxiosError<errors.CloudMailinErrorResponse>) {
    return new errors.CloudMailinError(error.message, error);
  }

  private makeClient() {
    const baseURL = `${this.options.baseURL}/${this.options.username}`;
    const headers = {
      Authorization: `Bearer ${this.options.apiKey}`,
      "User-Agent": `CloudMailin-js ${this.version}`
    };

    return axios.create({
      baseURL: baseURL,
      responseType: "json",
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      headers: headers
    });
  }
}
