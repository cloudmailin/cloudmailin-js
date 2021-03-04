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

```typescript
import { MessageClient } from "cloudmailin"

const client = new MessageClient({ username: USERNAME, apiKey: API_KEY});
const response = await client.sendMessage({
  to: 'test@example.net',
  from: 'test@example.com',
  plain: 'test message',
  html:  '<h1>Test Message</h1>',
  subject: "hello world"
});
```

## Development

Generating the OpenAPI reference:

```sh
npx openapi-typescript ./path_to/api.yaml --output ./src/models/cloudmailin-api.ts
```
