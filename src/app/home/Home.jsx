import Link from "next/link";
import { useRouter } from "next/navigation";
import Banner from "./Banner";
import Astrology from "./astrology";
import TopSellingSlider from "../component/TopSellingSlider";
import NewlyLaunceSlider from "../component/NewlyLaunceSlider";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import FaqHome from "./FaqHome";

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
