import "../assets/globals.css";
import { Clarity } from "microsoft-clarity";

Clarity.init(process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID);

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
