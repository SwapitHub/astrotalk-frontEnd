import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import ToastWrapper from "./ToastWrapper";
import { HomeContext } from "@/context/HomeContext";
import FooterServer from "./footer/page";
import HeaderServer from "./header/pages";


export async function generateMetadata() {

  const favicon =  "/apple-touch-icon.png";
  return {
    icons: {
      icon: favicon,
    },
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ToastWrapper>
          <HomeContext>
            <HeaderServer />
            {children}
            <FooterServer/>
          </HomeContext>
        </ToastWrapper>
      </body>
    </html>
  );
}
