import React from "react";
import Contact from "../components/HomePage/Contact";
import Footer from "../components/Footer";
import Promotion from "../components/HomePage/Promotion";
import TopWeek from "../components/HomePage/TopWeek";
import NavBar from "../components/NavBar";
import Slider from "../components/HomePage/Slider";
import UpComing from "../components/HomePage/UpComing";

const HomePage = () => {
  return (
    <div>
      <NavBar />
      <Slider />
      <TopWeek />
      <UpComing />
      <Promotion />
      <Contact />
      <Footer />
    </div>
  );
};
export default HomePage;
