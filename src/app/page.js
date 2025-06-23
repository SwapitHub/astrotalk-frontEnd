"use client";
import { useEffect, useState } from "react";
import AstrologerHome from "./astrologer-dashboard/AstrologerHome";
import HomePage from "./home/page";
import secureLocalStorage from "react-secure-storage";
import Cookies from "js-cookie";
import ChatWithAstrologer from "./chat-with-astrologer/ChatAstrologerHome";

export default function Home() {
  const [astrologerPhone, setAstrologerPhone] = useState()
  useEffect(()=>{
    const astrologerPhone = Cookies.get("astrologer-phone");
    setAstrologerPhone(astrologerPhone)
  },[])

  return <>{astrologerPhone ? <AstrologerHome /> : <ChatWithAstrologer />}</>;
}
