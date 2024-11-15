// pages/index.js
import Layout from "../components/Layout";
import { getConfig } from "../utils/configLoader";

export default function Home({ config }) {
  return (
    <Layout config={config} title="Home | Nonprofit Store">
      <h1 className="text-4xl font-bold mb-6">
        Welcome to Our Nonprofit Store
      </h1>
      <p className="text-xl">
        Support our cause by purchasing our high-quality merchandise. Every
        purchase makes a difference!
      </p>
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
