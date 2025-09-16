<a href="https://www.cloudmailin.com">
  <img src="https://assets.cloudmailin.com/assets/favicon.png" alt="CloudMailin Logo" height="60" align="right" title="CloudMailin">
</a>

# CloudMailin Node.js Library

A Node.JS SDK for CloudMailin written in Typescript for receiving
incoming email via JSON HTTP POST.

Please see the [Documentation](https://docs.cloudmailin.com) for more details and examples.

## Usage

You can install the library using NPM.

```sh
npm install cloudmailin
```

### Receiving Email

We recommend you take a look at our
[Documentation](https://docs.cloudmailin.com/receiving_email/examples/node/)
for a more detailed example but here's a snippet:

```typescript
import express from "express";
import bodyParser from "body-parser";
import { IncomingMail } from "cloudmailin";

const app = express();
app.use(bodyParser.json());

app.post("/incoming_mails/", (req, res) => {
  const mail = <IncomingMail>req.body;

  res.status(201).json(mail);
}
```

### Sending Email

You can initialize the MessageClient in two ways:

#### Using explicit credentials

```typescript
import { MessageClient } from "cloudmailin"

const client = new MessageClient({
  username: "your-username",
  apiKey: "your-api-key"
});
const response = await client.sendMessage({
  to: 'test@example.net',
  from: 'test@example.com',
  plain: 'test message',
  html:  '<h1>Test Message</h1>',
  subject: "hello world"
});
```

#### Using SMTP URL (options or environment variable)

You can provide the SMTP URL either as an option or via environment variable:

**Option 1: Pass smtpUrl directly**
```typescript
import { MessageClient } from "cloudmailin"

const client = new MessageClient({
  smtpUrl: "smtp://username:apikey@smtp.cloudmta.net:587?starttls=true"
});
const response = await client.sendMessage({
  to: 'test@example.net',
  from: 'test@example.com',
  plain: 'test message',
  html:  '<h1>Test Message</h1>',
  subject: "hello world"
});
```

**Option 2: Use environment variable**
```bash
export CLOUDMAILIN_SMTP_URL="smtp://username:apikey@smtp.cloudmta.net:587?starttls=true"
```

```typescript
import { MessageClient } from "cloudmailin"

const client = new MessageClient(); // Will automatically use CLOUDMAILIN_SMTP_URL
const response = await client.sendMessage({
  to: 'test@example.net',
  from: 'test@example.com',
  plain: 'test message',
  html:  '<h1>Test Message</h1>',
  subject: "hello world"
});
```

**Note:** The SMTP URL format is `smtp://username:apikey@host:port?params`.
The host and port in the URL are not used for the API calls - the library
automatically uses the correct CloudMailin API endpoint at
`https://api.cloudmailin.com/api/v0.1/{username}/messages`.

## Development

Generating the OpenAPI reference:

```sh
npx openapi-typescript ./path_to/api.yaml --output ./src/models/cloudmailin-api.ts
```
