// pages/_app.js
import "../styles/globals.css";
import { ShoppingCartProvider } from "../contexts/ShoppingCartContext";
import { getConfig } from "../utils/configLoader";

function MyApp({ Component, pageProps }) {
  const config = getConfig();

  return (
    <ShoppingCartProvider>
      <Component {...pageProps} config={config} />
    </ShoppingCartProvider>
  );
}

export default MyApp;
