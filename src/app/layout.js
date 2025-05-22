import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import ToastWrapper from "./ToastWrapper";
import Header from "./header/Header";
import { HomeContext } from "@/context/HomeContext";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ToastWrapper>
          <HomeContext>
            <Header />
            {children}
          </HomeContext>
        </ToastWrapper>
      </body>
    </html>
  );
}
