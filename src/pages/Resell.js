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

export default function Resell() {
  const { address, signer, connect, contract, provider } =
    useContext(AuthContext);

  const [modal, setModal] = useState(false);
  const [assetname, setassetname] = useState("");
  const [assetdescription, setassetdescription] = useState("");
  const [assetprice, setassetprice] = useState("");
  const [asseturl, setasseturl] = useState("");
  const [isloading, setisloading] = useState(false);
  const [isnftready, setisnftready] = useState(false);
  const [nfts, setnfts] = useState([]);
  const [id, setid] = useState("");
  async function loadNFT() {
    const data = await signer?.fetchMyNFTs();
    setnfts(data);
    console.log("nft ----------", data);
  }
  useEffect(() => {
    loadNFT();
  }, [signer, isnftready]);

  console.log(id);
  async function listNFTForSale() {
    setisloading(true);

    let listingPrice = await signer.getListingPrice();
    listingPrice = listingPrice.toString();
    const priceFormatted = ethers.utils.parseUnits(assetprice, "ether");

    let transaction = await signer.resellToken(id, priceFormatted, {
      value: listingPrice,
    });
    await transaction.wait();
    setisloading(false);
    setisnftready(true);
    setModal(false);
  }
  return (
    <>
      <Modals
        title={"Resell NFT"}
        state={modal}
        onClick={() => {
          setModal(false);
        }}
        actionButtonDesktop={
          <div className="hidden sm:block">
            <Button
              onClick={() => {
                listNFTForSale();
              }}
            >
              {isloading ? (
                <Loading size="xs" color="white" className="pr-4" />
              ) : (
                ""
              )}
              Create
            </Button>
          </div>
        }
        actionButtonMobile={
          <div className="block w-full sm:hidden">
            <Button
              block
              size="large"
              onClick={() => {
                listNFTForSale();
              }}
            >
              Create
            </Button>
          </div>
        }
      >
        <Label>
          <span>Assets Price</span>
          <Input
            className="mt-1"
            placeholder="assets price in ETH"
            value={assetprice}
            onChange={(e) => {
              setassetprice(e.target.value);
            }}
          />
        </Label>
      </Modals>
      <PageTitle>Resell NFT(my Assets)</PageTitle>

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

                <div
                  onClick={() => {
                    setid(item?.tokenId?.toString());
                    setModal(true);
                  }}
                  class=" cursor-pointer inline-block pb-1 mt-2 font-medium t bg-blue-600 py-1 w-full rounded-full text-center text-white "
                >
                  Resell
                </div>
              </div>
            </div>
          </div>
        ))}
        {/* </Grid.Container> */}
      </div>
    </>
  );
}
