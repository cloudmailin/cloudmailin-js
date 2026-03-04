/**
 * CloudMailin API schema types.
 * Based on the OpenAPI spec at https://docs.cloudmailin.com
 */

export interface components {
  schemas: {
    MessageCommon: {
      id?: string;
      /**
       * The from addrress of the email message.
       * This is the address to be used in the SMTP transaction itself.
       * Although it will be replaced with an address used for bounce handling.
       * This must match a `from:` header in the email headers.
       */
      from: string;
      /**
       * The To addrress of the email message.
       * This is the address to be used in the SMTP transaction itself.
       * This must match a `To:` header in the email headers.
       */
      to: string[] | string;
      /**
       * A CC addrress used to copy the email message to a recipient.
       * This is the address to be used in the SMTP transaction itself.
       * This must match a `CC:` header in the email headers.
       * A To: Recipient must also be present to use CC.
       */
      cc?: string[] | string;
      /**
       * Whether to send this message in test mode.
       * This will validate the messge but no actually send it if true.
       * If the server is in test mode then it will always be in test mode
       * regardless of this value.
       */
      test_mode?: boolean;
      /** The subject of the email. This will override any subject set in headers or raw messages. */
      subject?: string;
      /** Tags that help filter the messages within the dashboard */
      tags?: string[] | string;
    };
    Message: components["schemas"]["MessageCommon"] & {
      /**
       * The plain text part of the email message.
       * Either the plain text, html, or markdown parts are required.
       */
      plain?: string;
      /**
       * The HTML part of the email message.
       * Either the plain text, html, or markdown parts are required.
       */
      html?: string;
      /**
       * A markdown body for the email message. The markdown will be
       * converted to HTML during delivery. If no `plain` part is
       * provided, a plain text version will also be generated automatically.
       */
      markdown?: string;
      headers?: { [key: string]: string };
      priority?: "standard" | "priority" | "digest";
      attachments?: components["schemas"]["MessageAttachment"][];
    };
    MessageAttachment: {
      /** The file name of the attachment */
      file_name: string;
      /**
       * The Base64 encoded representation of the content.
       * This shouldn't contain newlines within JSON.
       */
      content: string;
      /** The mime content type of the file such as `image/jpeg` */
      content_type: string;
      /**
       * An optional content identifier.
       * This is used to mark the attachment as inline and would allow inline display of the
       * attachment within the html content.
       * Within the HTML render an image tag for example with cid:
       * <img src="cid:logo" alt="Logo" />
       */
      content_id?: string;
    };
    RawMessage: components["schemas"]["MessageCommon"] & {
      /**
       * A full raw email.
       * This should consist of both headers and a message body.
       * `To` and `From` headers must be present and match those in the request.
       * Multiple parts, text and html or other mixed content are
       * acceptable but the message must be valid and RFC822 compliant.
       *
       * Any attachments intended to be sent in the Raw format must also be
       * encoded and included here.
       */
      raw?: string;
    };
    Error: {
      status?: number;
      error?: string;
    };
  };
}
