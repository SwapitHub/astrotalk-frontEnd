"use client";
import { useEffect, useState } from "react";
import AstrologerHome from "./astrologer-dashboard/AstrologerHome";
import HomePage from "./home/page";

export default function Home() {
  const [astrologerPhone, setAstrologerPhone] = useState();
  useEffect(() => {
    const astrologerPhone = localStorage.getItem("astrologer-phone");
    setAstrologerPhone(astrologerPhone);
  }, []);

  return <>{astrologerPhone ? <AstrologerHome /> : <HomePage />}</>;
}
