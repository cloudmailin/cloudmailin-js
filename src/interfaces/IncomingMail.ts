/**
 * An interface to help with receiving CloudMailin inbound HTTP POSTs
 * This relies on the JSON Normalized format
 */
export default interface IncomingMail {
  headers: IncomingHeaderObject;

  /**
   * The envelope contains all of the parameters passed in the SMTP Communication.
   */
  envelope: {
    to: string;
    recipients: Array<string>;
    from: string;
    helo_domain: string;
    spf: IncomingSPFObject;
    tls: boolean;
  };

  reply_plain?: string;
  plain?: string;
  html?: string;

  /**
   * Attachments will be either Embedded attachments or URL attachments
   * If you have setup an Attachment Store such as S3, Azure Storage or
   * Google Cloud Storage then it will use URL attachments
   */
  attachments: Array<IncomingAttachment>;
}

/**
 * Headers are a string, or if they're specified multiple times in the
 * original email they'll be an array of strings. Each time the header
 * occurred it will be a new entry in the Array.
 */
export interface IncomingHeaderObject {
  [key: string]: string | Array<string>;
}

/**
 * The result of the SPF check, shows the domain used for the check and the result.
 */
export interface IncomingSPFObject {
  result: string;
  domain: string;
}

/**
 * When no attachment store is present attachments are passed as Base64 encoded items
 * within the content parameters of an embedded attachment. When using an attachment
 * store the URL to the file location will be passed.
 */
export interface IncomingAttachment {
  file_name: string;
  content_type: string;
  size: number;
  disposition?: string;
  content_id?: string;

  /**
   * Base64 encoded attachment content newline characters may be present and should be ignored.
   */
  content?: string;

  /**
   * URL where the file is stored
   */
  url?: string;
}
