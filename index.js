// server.js
//
// Use this sample code to handle webhook events in your integration.
//
// 1) Paste this code into a new file (server.js)
//
// 2) Install dependencies
//   npm install stripe
//   npm install express
//
// 3) Run the server on http://localhost:4242
//   node server.js

// The library needs to be configured with your account's secret key.
// Ensure the key is kept out of any version control system you might be using.
const stripe = require("stripe");
const express = require("express");
const app = express();

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret =
  "whsec_P5WR3AOFnOqtppUCz6y0eHpvdiG7WAIv";

app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (request, response) => {
    const sig = request.headers["stripe-signature"];

    let event;
    const mainStripe = stripe("sk_test_51OuHVuLeQOZVMWCZWssnQP6V9DkFiJEZwohtMki6X40BX0GGfLLDwLQD6b1eQUfnd5psB3tSSYDTf9SaM7h8KfvM00hWJAYjYM");

    try {
      event = mainStripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }


    const connectedAccountAccessToken = 'sk_test_51Q4gTvLJk4G5qut4ECCWZvFB9RsTlv2ZfzghnX5FPQDTimwnWOEvhr4x3ibfqzfh5lsBeKXVBismqUHf8J7tyuq600dKD9CeI7';
    const connectStripe = stripe(connectedAccountAccessToken);

    const recipient = await connectStripe.stripe.customers.retrieve(event.data.customer);

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntentSucceeded = event.data.object;
        // Then define and call a function to handle the event payment_intent.succeeded
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send({
      event,
      headers: request.headers,
      account_id: request.body,
      recipient
    });
  }
);

app.get('/', (req, res) => {
  res.send('Test stripe');
});

app.listen(5000, () => console.log("Running on port 5000"));
