let config = null;

export function getConfig() {
  if (config) return config;

  // In a real-world scenario, you might want to fetch this from an API
  // or load it during the build process
  config = {
    storeName: "Nonprofit Store",
    storeDescription:
      "Support our cause by purchasing high-quality merchandise",
    currency: "USD",
    contactEmail: "support@nonprofitstore.org",
    socialMedia: {
      facebook: "https://facebook.com/nonprofitstore",
      twitter: "https://twitter.com/nonprofitstore",
      instagram: "https://instagram.com/nonprofitstore",
    },
    products: [
      {
        id: 1,
        name: "Nonprofit T-Shirt",
        description:
          "Show your support with our comfortable 100% organic cotton t-shirt. Available in multiple sizes and colors.",
        price: 25.0,
        image: "/images/tshirt.jpg",
        variations: [
        {
          name: "Size",
          options: ["S", "M", "L", "XL"]
        },
        {
          name: "Color",
          options: ["White", "Black", "Blue"]
        }
        ]
      },
      {
        id: 2,
        name: "Reusable Water Bottle",
        description:
          "Stay hydrated and eco-friendly with our BPA-free, stainless steel water bottle. Keeps drinks cold for 24 hours or hot for 12 hours.",
        price: 15.0,
        image: "/images/water-bottle.jpg",
      },
      {
        id: 3,
        name: "Tote Bag",
        description:
          "Carry your essentials in style with our durable canvas tote bag. Perfect for groceries, books, or a day at the beach.",
        price: 20.0,
        image: "/images/tote-bag.jpg",
      },
    ],
    theme: {
      primaryColor: "#0766f46c",
      secondaryColor: "#10b948",
      fontFamily: "Arial, sans-serif",
    },
  };

  return config;
}
