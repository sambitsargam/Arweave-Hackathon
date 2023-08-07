import {
  ChartBarSquareIcon,
  CursorArrowRippleIcon,
  DevicePhoneMobileIcon,
  AdjustmentsVerticalIcon,
  SunIcon,
  FaceSmileIcon,
} from "@heroicons/react/24/outline";

import benefitOneImg from "../../public/img/benefit-one.png";
import benefitTwoImg from "../../public/img/benefit-two.png";
import fdfs from "../../";
const benefitOne = {
  title: "Storage",
  // desc: "ou have the freedom to choose whether to store your data on IPFS or Web3 storage.",

  image: benefitTwoImg,
  bullets: [
    {
      title: "File manager",
      desc: "Directly browse your files from anywhere in the world",
      icon: <FaceSmileIcon />,
    },
    {
      title: "Sharing",
      desc: "Easily share files with friends and family.",
      icon: <ChartBarSquareIcon />,
    },
    {
      title: "Mobile compatible",
      desc: "Access your files anytime and anywhere",
      icon: <CursorArrowRippleIcon />,
    },
  ],
};

const benefitTwo = {
  title: "And even more with ArTrackrHub...",
  // desc: "It is secure and unchangeable because of the use of blockchain. indicating that nobody can manipulate your data",
  image: benefitOneImg,
  bullets: [
    {
      title: "NFT Token",
      desc: "Mint NFT directly from files saved on ArTrackrHub ",
      icon: <DevicePhoneMobileIcon />,
    },
    {
      title: "Chat",
      desc: "Send  messages with anyone you want using ArTrackrHub",
      icon: <AdjustmentsVerticalIcon />,
    },
    {
      title: "Hybrid Storage ",
      desc: "You can host both IPFS and Web3storage servers for free. ",
      icon: <SunIcon />,
    },
  ],
};

export { benefitOne, benefitTwo };
