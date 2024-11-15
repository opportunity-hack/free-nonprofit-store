// pages/api/create-checkout-session.js
const Stripe = require("stripe");

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  console.log("Request body:", req.body);

  if (req.method === "POST") {
    try {
      // Ensure STRIPE_SECRET_KEY is set
      if (!process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY) {
        throw new Error(
          "NEXT_PUBLIC_STRIPE_SECRET_KEY is not set in the environment variables"
        );
      }

      const { items } = req.body;

      // Function to ensure complete URL
      const getFullImageUrl = (imagePath) => {
        if (
          imagePath.startsWith("http://") ||
          imagePath.startsWith("https://")
        ) {
          return imagePath;
        }
        return `${req.headers.origin}${
          imagePath.startsWith("/") ? "" : "/"
        }${imagePath}`;
      };

      // Validate items
      if (!items || !Array.isArray(items) || items.length === 0) {
        return res
          .status(400)
          .json({ error: "Invalid items in the request body" });
      }

      // Docs: https://docs.stripe.com/api/checkout/sessions/create?lang=node
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: items.map((item) => {
          // Create a description string that includes all variations, make sure that selectedVariations is a dict and has items
          const variationsDescription = (item.selectedVariations && Object.keys(item.selectedVariations).length > 0)
            ? Object.entries(item.selectedVariations)
                .map(([key, value]) => `${key}: ${value}`)
                .join(", ")
            : undefined;

          console.log("Variations description:|", variationsDescription, "|");
          // Combine the item name with variations for the product name
          const productName =
            item.selectedVariations && variationsDescription
              ? `${item.name} (${variationsDescription})`
              : item.name;

          console.log("Product name:", productName);
          console.log(
            "Images: ",
            item.image ? [getFullImageUrl(item.image)] : undefined
          );

          return {
            price_data: {
              currency: "usd",
              product_data: {
                name: productName,
                description: item.description,
                images: item.image ? [getFullImageUrl(item.image)] : undefined,
              },
              unit_amount: Math.round(item.price * 100), // Stripe expects amounts in cents
            },
            quantity: item.quantity,
          };
        }),
        mode: "payment",
        success_url: `${req.headers.origin}/success`,
        shipping_address_collection: {
          allowed_countries: ["US", "CA"],
        },
        cancel_url: `${req.headers.origin}/cart`,
      });

      res.status(200).json({ sessionId: session.id });
    } catch (err) {
      console.error("Error in create-checkout-session:", err);
      res.status(500).json({ statusCode: 500, message: err.message });
    }
  } else {
    console.error("Method Not Allowed");
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
