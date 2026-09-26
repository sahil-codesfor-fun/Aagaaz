import React from "react";
import HeroSection from "./components/HeroSection";
import EventMarquee from "./components/EventMarquee";
import CountdownBanner from "./components/CountdownBanner";
import EventArtistSection from "./components/EventArtistSection";
import ScheduleSection from "./components/ScheduleSection";
import { RegisterSection } from "./components/RegisterationSection";
import FaqSection from "./components/FaqSection";
import ContactSection from "./components/ContactSection";

const Home = () => {
  return (
    <div className="flex flex-col w-full bg-white dark:bg-[#09090d] text-neutral-900 dark:text-neutral-100 overflow-hidden transition-colors duration-300">
      <HeroSection />
      <EventMarquee />
      <CountdownBanner />
      <EventArtistSection />
      <ScheduleSection />
      <RegisterSection />
      <FaqSection />
      <ContactSection />
    </div>
  );
};

export default Home;