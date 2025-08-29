require('dotenv').config();
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();

// --- IMPORTANT: SIMPLIFIED CORS CONFIGURATION FOR DIAGNOSTICS ---
// This temporarily allows requests from any origin.
app.use(cors()); 

app.use(express.json());

// --- ROUTES ---
app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.post('/create-checkout-session', async (req, res) => {
  const { items } = req.body;

  const line_items = items.map(item => ({
    price_data: {
      currency: 'gbp',
      product_data: {
        name: item.name,
        images: [item.image],
      },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.quantity,
  }));

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: line_items,
      mode: 'payment',
      success_url: `https://seven17.netlify.app?success=true`,
      cancel_url: `https://seven17.netlify.app?canceled=true`,
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("Error creating Stripe session:", error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// --- START SERVER ---
const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

