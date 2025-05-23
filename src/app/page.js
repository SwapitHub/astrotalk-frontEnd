"use client";
import { useEffect, useState } from "react";
import AstrologerHome from "./astrologer-dashboard/AstrologerHome";
import HomePage from "./home/page";
import secureLocalStorage from "react-secure-storage";

export default function Home() {
  const [astrologerPhone, setAstrologerPhone] = useState()
  useEffect(()=>{
    const astrologerPhone = secureLocalStorage.getItem("astrologer-phone");
    setAstrologerPhone(astrologerPhone)
  },[])

  return <>{astrologerPhone ? <AstrologerHome /> : <HomePage />}</>;
}
