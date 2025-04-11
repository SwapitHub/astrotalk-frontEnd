import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import ToastWrapper from "./ToastWrapper";
import HeaderServer from "./header/pages";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
       
          <ToastWrapper>
            <HeaderServer />
            {children}
          </ToastWrapper>
        
      </body>
    </html>
  );
}
