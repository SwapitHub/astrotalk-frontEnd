import "./globals.css";
import Header from "./header/Header";
import "react-toastify/dist/ReactToastify.css";
import ToastWrapper from "./ToastWrapper";

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
