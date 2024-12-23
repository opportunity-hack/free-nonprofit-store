import { useState, useEffect } from "react";

export default function AdminConfig() {
  const [config, setConfig] = useState({
    storeName: "",
    storeDescription: "",
    contactEmail: "",
    socialMedia: {
      facebook: "",
      twitter: "",
      instagram: "",
    },
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Fetch the current configuration when the page loads
    async function fetchConfig() {
      setLoading(true);
      try {
        const res = await fetch("/api/config");
        if (!res.ok) throw new Error("Failed to fetch configuration");
        const data = await res.json();
        setConfig(data);
      } catch (err) {
        console.error(err.message);
        setMessage("Error fetching configuration.");
      } finally {
        setLoading(false);
      }
    }

    fetchConfig();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("socialMedia.")) {
      const key = name.split(".")[1];
      setConfig((prev) => ({
        ...prev,
        socialMedia: { ...prev.socialMedia, [key]: value },
      }));
    } else {
      setConfig((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(config),
      });
      if (!res.ok) throw new Error("Failed to save configuration");
      setMessage("Configuration updated successfully!");
    } catch (err) {
      console.error(err.message);
      setMessage("Error saving configuration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Edit Store Details</h1>
      {message && <p className="mb-4">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-bold mb-2">Store Name</label>
          <input 
            type="text"
            name="storeName"
            value={config.storeName}
            onChange={handleInputChange}
            className="border p-2 w-full text-black"
          />
        </div>
        <div>
          <label className="block font-bold mb-2">Store Description</label>
          <textarea
            name="storeDescription"
            value={config.storeDescription}
            onChange={handleInputChange}
            className="border p-2 w-full text-black"
          />
        </div>
        <div>
          <label className="block font-bold mb-2">Contact Email</label>
          <input
            type="email"
            name="contactEmail"
            value={config.contactEmail}
            onChange={handleInputChange}
            className="border p-2 w-full text-black"
          />
        </div>
        <div>
          <label className="block font-bold mb-2">Social Media Links</label>
          <div className="space-y-2">
            <input
              type="url"
              name="socialMedia.facebook"
              placeholder="Facebook URL"
              value={config.socialMedia.facebook}
              onChange={handleInputChange}
              className="border p-2 w-full text-black"
            />
            <input
              type="url"
              name="socialMedia.twitter"
              placeholder="Twitter URL"
              value={config.socialMedia.twitter}
              onChange={handleInputChange}
              className="border p-2 w-full text-black"
            />
            <input
              type="url"
              name="socialMedia.instagram"
              placeholder="Instagram URL"
              value={config.socialMedia.instagram}
              onChange={handleInputChange}
              className="border p-2 w-full text-black"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
