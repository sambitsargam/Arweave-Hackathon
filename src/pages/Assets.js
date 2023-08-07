import React, { useState, useEffect, useContext } from "react";
import { Card, Grid, Row, Text, Loading } from "@nextui-org/react";
import Modals from "../components/Modal/Modal";
import PageTitle from "../components/Typography/PageTitle";
import {
  Input,
  Button,
  HelperText,
  Label,
  Select,
  Textarea,
} from "@windmill/react-ui";
import { AuthContext } from "../utils/AuthProvider";
import { ethers } from "ethers";

export default function Assets() {
  const { address, signer, connect, contract, provider } =
    useContext(AuthContext);

  const [nfts, setnfts] = useState([]);
  async function loadNFT() {
    const data = await signer?.fetchMyNFTs();
    setnfts(data);
    console.log("nft ----------", data);
  }
  useEffect(() => {
    loadNFT();
  }, [signer]);

  return (
    <>
      <PageTitle> My Assets</PageTitle>
      <div className="w-max"></div>
      <div
        className="
         grid md:grid-cols-3 grid-col-2 lg:grid-cols-4 gap-3 "
      >
        {/* <Grid.Container gap={1} justify="flex-start"> */}
        {nfts?.map((item, index) => (
          <div>
            <div
              class="block overflow-hidden border border-gray-100 rounded-lg shadow-sm"
              href=""
            >
              <img class="object-cover w-full h-56" src={item.image} alt="" />

              <div class="p-4">
                <div className="flex flex-row items-center justify-between">
                  <h5 class="text-xl font-bold dark:text-white">{item.name}</h5>
                </div>
                <h5 class="text-md font-bold w-9/12 dark:text-white text-white rounded-full px-1 bg-yellow-300 ">
                  {ethers.utils.formatEther(item?.price?.toString())}
                  ETH
                </h5>
                <p class="mt-1 text-sm dark:text-gray-200 text-gray-500">
                  {item.description}
                </p>
              </div>
            </div>
          </div>
        ))}
        {/* </Grid.Container> */}
      </div>
    </>
  );
}
