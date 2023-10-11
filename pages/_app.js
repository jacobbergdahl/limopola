import "./normalize.css";
import "./global.css";
import { Provider as JotaiProvider } from "jotai";

export default function MyApp({ Component, pageProps }) {
  return (
    <JotaiProvider>
      <Component {...pageProps} />
    </JotaiProvider>
  );
}
