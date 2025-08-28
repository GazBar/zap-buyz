require('dotenv').config();
// server/server.js

// This is your new back-end server.
// It will handle the checkout process with Stripe.

const express = require('express');
const cors = require('cors');
// Your secret key is now securely loaded from the .env file
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();

// Middleware to allow your React app to talk to this server
app.use(cors());
// Middleware to parse JSON bodies
app.use(express.json());

// The main checkout route
app.post('/create-checkout-session', async (req, res) => {
  try {
    // The 'items' will be sent from your React app's cart
    const { items } = req.body;

    // This is where you format the items for Stripe
    const line_items = items.map(item => {
      return {
        price_data: {
          currency: 'gbp', // <-- CURRENCY IS SET TO POUNDS
          product_data: {
            name: item.name,
            images: [item.image],
          },
          unit_amount: Math.round(item.price * 100), // Price in pence
        },
        quantity: item.quantity,
      };
    });

    // Create a new checkout session with Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: line_items,
      mode: 'payment',
      // IMPORTANT: Replace these with your live website's URLs
      success_url: `https://seven17.netlify.app?success=true // A page to show on successful payment
      cancel_url: `https://seven17.netlify.app?canceled=true`,   // A page to show if the user cancels
    });

    // Send the session ID back to the React app
    res.json({ id: session.id });

  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

const PORT = 4242;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
