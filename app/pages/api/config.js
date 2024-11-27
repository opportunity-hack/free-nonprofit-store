let config = {
  storeName: "Nonprofit Store",
  storeDescription: "Support our cause by purchasing high-quality merchandise.",
  contactEmail: "support@nonprofitstore.org",
  socialMedia: {
    facebook: "https://facebook.com/nonprofitstore",
    twitter: "https://twitter.com/nonprofitstore",
    instagram: "https://instagram.com/nonprofitstore",
  },
};

export default function handler(req, res) {
  if (req.method === "GET") {
    // Return the current configuration
    res.status(200).json(config);
  } else if (req.method === "POST") {
    // Update the configuration
    config = { ...config, ...req.body };
    res.status(200).json(config);
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
