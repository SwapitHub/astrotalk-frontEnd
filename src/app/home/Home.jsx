"use client";

import Banner from "./Banner";
import TopSellingSlider from "../component/TopSellingSlider";
import NewlyLaunceSlider from "../component/NewlyLaunceSlider";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import FaqHome from "./FaqHome";
import Astrology from "./Astrology";

const Home = () => {
  return (
    <>
     <main className="home-main">
      <Banner />

      <Astrology />

      <TopSellingSlider />

      <NewlyLaunceSlider />

     <FaqHome/>
     </main>
    </>
  );
};

export default Home;
