import Head from "next/head";
import Link from "next/link";
import { useShoppingCart } from "../contexts/ShoppingCartContext";

export default function Layout({
  children,
  config,
  title = "Nonprofit Store",
}) {
  const { items } = useShoppingCart();
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  // Default values in case config is not loaded yet
  const storeName = config?.storeName || "Nonprofit Store";
  const theme = config?.theme || {};
  const socialMedia = config?.socialMedia || {};

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ fontFamily: theme.fontFamily || "Arial, sans-serif" }}
    >
      <Head>
        <title>{title || storeName}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header
        className="bg-blue-600 text-white shadow-md"
        style={{ backgroundColor: theme.primaryColor || "#3B82F6" }}
      >
        <nav className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xl font-bold">
              {storeName}
            </Link>
            <div className="space-x-4">
              <Link href="/" className="hover:text-blue-200">
                Home
              </Link>
              <Link href="/products" className="hover:text-blue-200">
                Products
              </Link>
              <Link href="/cart" className="hover:text-blue-200">
                Cart ({itemCount})
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-6 py-8 flex-grow">{children}</main>

      <footer className="bg-gray-500">
        <div className="container mx-auto px-6 py-3 text-center">
          <p>
            &copy; {new Date().getFullYear()} {storeName}. All rights reserved.
          </p>
          <div className="mt-2">
            {socialMedia.facebook && (
              <a
                href={socialMedia.facebook}
                className="text-blue-600 hover:text-blue-800 mr-4"
              >
                Facebook
              </a>
            )}
            {socialMedia.twitter && (
              <a
                href={socialMedia.twitter}
                className="text-blue-400 hover:text-blue-600 mr-4"
              >
                Twitter
              </a>
            )}
            {socialMedia.instagram && (
              <a
                href={socialMedia.instagram}
                className="text-pink-600 hover:text-pink-800"
              >
                Instagram
              </a>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
