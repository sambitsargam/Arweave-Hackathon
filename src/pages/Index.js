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
        
        <SectionTitle pretitle="Working" title="How ArTrackrHub Work">
        Artrckrhub Stored the Wallet Address of user who subscribed to the service and send them notification when a transaction is made to their wallet address
          <br></br>
          <p>
        We Fetch the Transactions using the Arweave GraphQL API and send the notification  using nodeailer to the user using the email address they provided
          </p>
        </SectionTitle>
        <br></br>
        <SectionTitle pretitle="about" title="Learn more about ArTrackrHub">
        Artrckrhub offers on-chain transaction notifications for Arweave blockchain users. It ensures privacy, real-time updates, and data upload capabilities
          <br></br>
          <br></br>
          <p>
          With secure data storage and seamless subscription, Artrckrhub is a valuable tool for traders and developers to stay informed about transactions.
          </p>
        </SectionTitle>

        <Cta />

        <Footer />
        <PopupWidget />
      </div>
    </>
  );
}
