// pages/products/index.js
import Layout from "../../components/Layout";
import Link from "next/link";
import Image from "next/image";
import { getConfig } from "../../utils/configLoader";

export default function Products({ config }) {
  return (
    <Layout config={config} title="Products | Nonprofit Store">
      <h1 className="text-4xl font-bold mb-6">Our Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {config.products.map((product) => (
          <div key={product.id} className="border rounded-lg p-4 shadow-md">
            <Link href={`/products/${product.id}`}>
              <div className="relative w-full h-48 mb-4">
                <Image
                  src={product.image}
                  alt={product.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
            </Link>
            <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
            <p className="text-gray-600 mb-2">{product.description}</p>
            {product.variations && (
              <p className="text-sm text-gray-500 mb-4">
                {product.variations.map((v) => v.name).join(", ")} options
                available
              </p>
            )}
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold">
                ${product.price.toFixed(2)}
              </span>
              <Link
                href={`/products/${product.id}`}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300">
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const config = getConfig();
  return {
    props: {
      config,
    },
    revalidate: 60, // Revalidate every 60 seconds
  };
}
