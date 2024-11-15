// pages/products/[id].js
import { useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import { getConfig } from "../../utils/configLoader";
import { useShoppingCart } from "../../contexts/ShoppingCartContext";
import Image from "next/image";

export default function Product({ config, product }) {
  const router = useRouter();
  const { addToCart } = useShoppingCart();
  const [selectedVariations, setSelectedVariations] = useState({});
  const [quantity, setQuantity] = useState(1);

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return (
      <Layout config={config}>
        <h1 className="text-4xl font-bold mb-6">Product Not Found</h1>
      </Layout>
    );
  }

  const handleVariationChange = (variationName, value) => {
    setSelectedVariations((prev) => ({ ...prev, [variationName]: value }));
  };

  const handleAddToCart = () => {
    const cartItem = {
      ...product,
      selectedVariations,
      quantity,
    };
    addToCart(cartItem);
    router.push("/cart");
  };

  const isAddToCartDisabled =
    product.variations &&
    product.variations.some((variation) => !selectedVariations[variation.name]);

  return (
    <Layout config={config}>
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/2 mb-6 md:mb-0">
          <div className="relative w-full h-96">
            <Image
              src={product.image}
              alt={product.name}
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
        </div>
        <div className="md:w-1/2 md:pl-8">
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
          <p className="text-xl mb-4">${product.price.toFixed(2)}</p>
          <p className="text-gray-600 mb-6">{product.description}</p>

          {product.variations &&
            product.variations.map((variation) => (
              <div key={variation.name} className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {variation.name}
                </label>
                <select
                  value={selectedVariations[variation.name] || ""}
                  onChange={(e) =>
                    handleVariationChange(variation.name, e.target.value)
                  }
                  className="block w-full px-3 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                >
                  <option value="">Select {variation.name}</option>
                  {variation.options.map((option) => (
                    <option
                      key={option}
                      value={option}
                      className="text-gray-900"
                    >
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            ))}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity
            </label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(1, parseInt(e.target.value)))
              }
              className="block w-full px-3 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
            />
          </div>

          <button
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleAddToCart}
            disabled={isAddToCartDisabled}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticPaths() {
  const config = getConfig();
  const paths = config.products.map((product) => ({
    params: { id: product.id.toString() },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const config = getConfig();
  const product = config.products.find((p) => p.id.toString() === params.id);

  return {
    props: {
      config,
      product: product || null,
    },
    revalidate: 60, // Revalidate every 60 seconds
  };
}
