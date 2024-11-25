import "../assets/globals.css";
import { GoogleTagManager } from "@next/third-parties/google";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_MEASUREMENT_ID} />
    </>
  );
}
