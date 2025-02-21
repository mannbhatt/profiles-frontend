import Image from "next/image";
import Header from "./components/header"
import HeroSection from "./components/LandingPage/hero";
import ProfileSlider from"./components/LandingPage/swiper";
import Features from "./components/LandingPage/feature";
import HowItWorks from "./components/LandingPage/howToWork";
import FAQSection from "./components/LandingPage/faqs";
import Footer from "./components/footer";
export default function Home() {
  return (<>
 <Header/>
 <HeroSection/>
 <ProfileSlider/><HowItWorks/>
 <Features/>
 <FAQSection/>
 <Footer/>
  </>);
}
