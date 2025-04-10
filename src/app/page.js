"use client";
import AstrologerHome from "./astrologer-dashboard/AstrologerHome";
import HomePage from "./home/page";

export default function Home() {
  const astrologerPhone = localStorage.getItem("astrologer-phone");

  return <>{astrologerPhone ? <AstrologerHome /> : <HomePage />}</>;
}
