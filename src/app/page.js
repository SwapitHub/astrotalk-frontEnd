"use client";
import { useEffect, useState } from "react";
import AstrologerHome from "./astrologer-dashboard/AstrologerHome";
import HomePage from "./home/page";

export default function Home() {
  const [sessionAstrologerPhone, setSessionAstrologerPhone] = useState()
  useEffect(()=>{
      const sessionAstrologerPhone =  sessionStorage.getItem("session-astrologer-phone");

    setSessionAstrologerPhone(sessionAstrologerPhone)
  },[])

  return <>{sessionAstrologerPhone ? <AstrologerHome /> : <HomePage />}</>;
}
