"use client";

import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import NewlyLaunceSlider from "../component/NewlyLaunceSlider";
import TopSellingSlider from "../component/TopSellingSlider";
import Astrology from "./Astrology";
import FaqHome from "./FaqHome";
import Banner from "./Banner";

const Home = ({ homeBannerData, topSellingSlider, NewlyLaunchedSlider }) => {
  
  return (
    <>
      <main className="home-main">
        <Banner homeBannerData={homeBannerData} />

        <Astrology />

        <TopSellingSlider topSellingSlider={topSellingSlider}/>

        <NewlyLaunceSlider NewlyLaunchedSlider={NewlyLaunchedSlider}/>

        <FaqHome />
      </main>
    </>
  );
};

export default Home;
