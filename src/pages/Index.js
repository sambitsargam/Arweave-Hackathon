// import Head from "next/head";
import Hero from "../components/index/hero";
import Navbar from "../components/index/navbar";
import SectionTitle from "../components/index/sectionTitle";
import { benefitOne, benefitTwo } from "../components/index/data";
import Video from "../components/index/video";
import Benefits from "../components/index/benefits";
import Footer from "../components/index/footer";
import Testimonials from "../components/index/testimonials";
import Cta from "../components/index/cta";
import Faq from "../components/index/faq";
import PopupWidget from "../components/index/popupWidget";

export default function Home() {
  return (
    <>
      <div className="bg-gray-800">
        <Navbar />
        <Hero />
        <SectionTitle
          pretitle="ArTrackrHub Benefits"
          title=" Why should you use ArTrackrHub"
        ></SectionTitle>
        <Benefits data={benefitOne} />
        <Benefits imgPos="right" data={benefitTwo} />
        <SectionTitle pretitle="about" title="Learn more about ArTrackrHub">
          ArTrackrHub a decentralise storage online Platforms with NFT and
          Chatting capabilities. Users can store their data on IPFS or Web3
          Storage. Users can access files directly through web browser without
          using any third party software.
          <br></br>
          <br></br>
          <p>
            It has been implemented in order to reduce the dependency on
            centralized services like Dropbox and Google Drive where users are
            dependent on a single point of failure. It will give you complete
            control over your data, right from its inception.
          </p>
        </SectionTitle>

        <Cta />
        <Footer />
        <PopupWidget />
      </div>
    </>
  );
}
