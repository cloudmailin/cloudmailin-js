<a href="https://www.cloudmailin.com">
  <img src="https://assets.cloudmailin.com/assets/favicon.png" alt="CloudMailin Logo" height="60" align="left" style="margin-right: 20px;" title="CloudMailin">
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
