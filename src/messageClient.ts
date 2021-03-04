import { Message, MessageRaw, MessageResponse } from "./models/message";
import * as errors from "./models/errors";
import axios, { AxiosError, AxiosRequestConfig } from "axios";

// Allow us to easily fetch the current version from the package without hacks
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { version } = require("../package.json");

export interface MessageClientOptions {
  username: string,
  apiKey: string;
  host?: string;
  baseURL?: string;
}

type requestMethod = AxiosRequestConfig['method'];

export default class MessageClient {
  private options: MessageClientOptions;
  private version: string;

  constructor(options: MessageClientOptions) {
    this.version = version;
    this.options = options;

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

  private handleError(error: AxiosError) {
    const response = error.response;
    const status = response?.status;

    switch (status) {
      case 422:
        return new errors.CloudMailinError(error.message, error);

      default:
        return new errors.CloudMailinError(error.message, error);
    }
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
