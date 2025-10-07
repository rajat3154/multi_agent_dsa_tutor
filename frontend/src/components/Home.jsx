import Navbar from "../shared/Navbar";
import React, { useRef } from "react";
import HeroSection from "./HeroSection";
import Footer from "@/shared/Footer";
import FeaturesSection from "./FeaturesSection";

const Home = () => {
  const featuresRef = useRef(null);

  return (
    <>
      <Navbar />
      <HeroSection
        scrollToFeatures={() => {
          featuresRef.current?.scrollIntoView({ behavior: "smooth" });
        }}
      />
      <div ref={featuresRef}>
        <FeaturesSection />
      </div>
      <Footer />
    </>
  );
};

export default Home;
