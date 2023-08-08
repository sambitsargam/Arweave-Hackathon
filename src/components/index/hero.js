import React, { useRef, useEffect } from "react";
import Container from "./container";
import heroImg from "../../public/img/hero.svg";
import Typed from "typed.js";

export default function Hero() {
  const el = useRef(null);
  useEffect(() => {
    const typed = new Typed(el.current, {
      strings: ["Storage 💾", "NFT 🎨", "Transaction Notification 💬"], // Strings to display
      // Speed settings, try diffrent values untill you get good results
      startDelay: 300,
      typeSpeed: 100,
      backSpeed: 100,
      backDelay: 100,
    });

    // Destropying
    return () => {
      typed.destroy();
    };
  }, []);
  return (
    <>
      <Container className="flex flex-wrap ">
        <div className="flex items-center w-full lg:w-1/2">
          <div className="max-w-2xl mb-8">
            <h1 className="text-3xl font-bold leading-snug tracking-tight text-gray-800 lg:text-4xl lg:leading-tight xl:text-5xl xl:leading-tight dark:text-white">
              <span className="text-transparent text-blue-400">
                ArTrackrHub.
              </span>{" "}
            </h1> 
            <h1 className="text-3xl font-bold leading-snug tracking-tight text-white-800 lg:text-2xl lg:leading-tight xl:text-5xl xl:leading-tight dark:text-white">
              Get <span ref={el}></span> All in one app
            </h1>
            <p className="py-5 text-xl leading-normal text-gray-600 lg:text-xl xl:text-2xl dark:text-gray-300">
            Artrckrhub is a powerful web service that enables users to subscribe with their wallet addresses and receive real-time notifications for on-chain transactions on the Arweave blockchain. In addition to providing transaction monitoring, Artrckrhub also facilitates the seamless upload of data to the Arweave network.
            </p>
 
            <div className="flex flex-col items-start space-x-3 space-y-3 sm:space-y-0 sm:items-center sm:flex-row">
              <a
                href="/app/dashboard"
                rel="noopener"
                className="px-8 py-4 text-lg font-medium text-center text-white bg-indigo-600 rounded-md "
              >
                Click to Start
              </a>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center w-full lg:w-1/2">
          <div className="hidden lg:block">
            <img
              src={heroImg}
              width="616"
              height="617"
              alt="Hero Illustration"
              layout="intrinsic"
              loading="eager"
              placeholder="blur"
            />
          </div>
        </div>
      </Container>
    </>
  );
}
