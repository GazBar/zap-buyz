require('dotenv').config();
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();

// --- IMPORTANT: For production, you should restrict this to your actual domain ---
// Example: app.use(cors({ origin: 'https://zap-buyz.netlify.app' }));
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
        // Ensure your product objects in the front-end have an 'image' property
        images: item.images && item.images[0] ? [item.images[0]] : [],
      },
      unit_amount: Math.round(item.price * 100), // Price in pence
    },
    quantity: item.quantity,
  }));

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: line_items,
      mode: 'payment',
      // --- CHANGE: Updated URLs to match your new Netlify site name ---
      // It's best to use the Netlify URL here until your custom domain is fully set up.
      success_url: `https://zap-buyz.netlify.app?success=true`,
      cancel_url: `https://zap-buyz.netlify.app?canceled=true`,
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
