import MessageClient, { MessageClientOptions } from "./messageClient";

import { CloudMailinError } from "./models/errors"
import { IncomingMail } from "./models/IncomingMail";
import { Message, MessageRaw } from "./models/message"

export * as Models from "./models"

export {
  MessageClient, MessageClientOptions,
  CloudMailinError as Errors,
  IncomingMail,
  Message, MessageRaw
};
