import { useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import { useShoppingCart } from "../contexts/ShoppingCartContext";
import { getConfig } from "../utils/configLoader";

export default function Success({ config }) {
  const router = useRouter();
  const { clearCart } = useShoppingCart();

  useEffect(() => {
    if (router.query.session_id) {
      // Here you would typically verify the session with Stripe
      // and update your database accordingly
      clearCart();
    }
  }, [router.query.session_id]);

  return (
    <Layout config={config} title="Order Successful | Nonprofit Store">
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold mb-6">Thank You for Your Order!</h1>
        <p className="text-xl mb-8">
          Your payment was successful and your order is being processed.
        </p>
        <button
          onClick={() => router.push("/")}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Continue Shopping
        </button>
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  const config = getConfig();
  return {
    props: {
      config,
    },
  };
}