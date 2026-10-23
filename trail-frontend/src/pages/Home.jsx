import React from "react";
import Hero from "../components/hero/Hero";
import Section1Marquee from "../components/hero/Section1Marquee";
import Section2 from "../components/section2/Section2";
import Section3 from "../components/section3/Section3";
import Section4 from "../components/Section4/Section4";
import FAQ from "../components/Faq/FAQ";
import Footer from "../components/footer/Footer";

const Home = () => {
  return (
    <>
      <Hero />
      <Section1Marquee />
      <Section2 />
      <Section3 />
      <Section4 />
      <FAQ />
      <Footer />
    </>
  );
};

export default Home;
