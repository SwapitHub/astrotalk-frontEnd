import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import ToastWrapper from "./ToastWrapper";
import Header from "./header/Header";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
       
          <ToastWrapper>
            <Header />
            {children}
          </ToastWrapper>
        
      </body>
    </html>
  );
}
