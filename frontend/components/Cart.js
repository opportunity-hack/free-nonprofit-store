// components/Cart.js
import { useShoppingCart } from "../contexts/ShoppingCartContext";
import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";
import Link from "next/link";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export default function Cart() {
  const { items, total, removeFromCart, updateQuantity, clearCart } =
    useShoppingCart();
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const stripe = await stripePromise;
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const session = await response.json();

      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        console.error(result.error.message);
      }
    } catch (error) {
      console.error("Error in checkout:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <p className="mb-6">
          Looks like you haven't added any items to your cart yet.
        </p>
        <Link href="/products">
          <a className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300">
            View Products
          </a>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      {items.map((item) => (
        <div
          key={`${item.id}-${JSON.stringify(item.selectedVariations)}`}
          className="flex justify-between items-center border-b py-4"
        >
          <div>
            <h3 className="text-lg font-semibold">{item.name}</h3>
            {Object.entries(item.selectedVariations).map(([key, value]) => (
              <p key={key} className="text-sm text-gray-300">
                {key}: {value}
              </p>
            ))}
            <div className="flex items-center mt-2">
              <button
                onClick={() =>
                  updateQuantity(item, Math.max(1, item.quantity - 1))
                }
                className="bg-gray-500 px-2 py-1 rounded-l"
              >
                -
              </button>
              <span className="bg-gray-400 px-4 py-1">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item, item.quantity + 1)}
                className="bg-gray-500 px-2 py-1 rounded-r"
              >
                +
              </button>
            </div>
          </div>
          <div>
            <p className="text-lg font-bold">
              ${(item.price * item.quantity).toFixed(2)}
            </p>
            <button
              onClick={() => removeFromCart(item)}
              className="text-red-600 hover:text-red-800"
            >
              Remove
            </button>
          </div>
        </div>
      ))}
      <div className="mt-6">
        <p className="text-xl font-bold">Total: ${total.toFixed(2)}</p>
        <div className="mt-4 space-x-4">
          <button
            onClick={clearCart}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300"
          >
            Clear Cart
          </button>
          <button
            onClick={handleCheckout}
            disabled={isLoading}
            className={`bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-300 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Processing..." : "Proceed to Checkout"}
          </button>
        </div>
      </div>
    </div>
  );
}
