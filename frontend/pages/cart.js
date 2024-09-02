// pages/cart.js
import Layout from "../components/Layout";
import Cart from "../components/Cart";
import { getConfig } from "../utils/configLoader";

export default function CartPage({ config }) {
  return (
    <Layout config={config} title="Shopping Cart">
      <h1 className="text-4xl font-bold mb-6">Shopping Cart</h1>
      <Cart />
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
