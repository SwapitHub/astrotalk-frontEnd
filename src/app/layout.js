import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import ToastWrapper from "./ToastWrapper";
import Header from "./header/Header";
import { HomeContext } from "@/context/HomeContext";
import FooterServer from "./footer/page";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ToastWrapper>
          <HomeContext>
            <Header />
            {children}
            <FooterServer/>
          </HomeContext>
        </ToastWrapper>
      </body>
    </html>
  );
}
