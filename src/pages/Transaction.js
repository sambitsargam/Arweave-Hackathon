import React, { useState, useEffect, useContext } from "react";
import { Card, Grid, Row, Text, Loading } from "@nextui-org/react";
import PageTitle from "../components/Typography/PageTitle";
import {
  Input,
  Button,
  HelperText,
  Label,
  Select,
  Textarea,
} from "@windmill/react-ui";
import arweaveWallet from "arconnect";

export default function Transaction() {
  const [userAddress, setUserAddress] = useState("");

  useEffect(() => {
    // Define an async function to obtain the user's wallet address
    const getUserAddress = async () => {
      try {
        await window.arweaveWallet.connect(["ACCESS_ADDRESS"]);
        // Make sure this code is executed inside an async function or a function that handles the promise.
        const userAddress = await window.arweaveWallet.getActiveAddress();
        setUserAddress(userAddress || "");
      } catch (error) {
        console.error(
          "Error while obtaining the user's wallet address:",
          error
        );
        setUserAddress("");
      }
    };
    getUserAddress();
  }, []);
  return (
    <>
      <PageTitle> MY Dashboard </PageTitle>
      <div className="w-max"></div>
      <div
        className="
         grid md:grid-cols-5 grid-col-9 lg:grid-cols-1 gap-7 "
      >
        <div>
          <div
            class="block overflow-hidden border border-gray-100 rounded-lg shadow-sm"
            href=""
          >
            <div class="p-6">
              <div className="flex flex-row items-center justify-between">
                <h5 class="text-xl font-bold dark:text-white">
                  Youe Wallet Address
                </h5>
              </div>
              <h5 class="text-md font-bold w-5/12 dark:text-white text-white rounded-full bg-blue-300 ">
                {userAddress}
              </h5>
            </div>
          </div>
        </div>
        {/* </Grid.Container> */}
      </div>
    </>
  );
}
