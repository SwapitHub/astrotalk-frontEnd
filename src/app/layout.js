import "./globals.css";
import Header from "./header/Header";
import "react-toastify/dist/ReactToastify.css";
import ToastWrapper from "./ToastWrapper";
import { Providers } from "@/redux-toolkit-main/provider";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <ToastWrapper>
            <Header />
            {children}
          </ToastWrapper>
        </Providers>
      </body>
    </html>
  );
}
