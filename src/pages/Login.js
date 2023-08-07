import React, { useEffect, useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";

import ImageLight from "../assets/img/login-office.jpeg";
import ImageDark from "../assets/img/login-office-dark.jpeg";
import Image_ from "../assets/productify-logo.svg";
import { GithubIcon, TwitterIcon } from "../icons";
import { Label, Input, Textarea, Button } from "@windmill/react-ui";
import { AuthContext } from "../utils/AuthProvider";

function Login() {
  const history = useHistory();

  const {
    address,
    signer,
    contract,
    provider,
    chainId,
    disconnect,
    connect,
    web3Provider,
  } = useContext(AuthContext);

  const [authstate, setauthstate] = useState(false);
  async function isRegistered() {
    const data = await signer?.isRegistered();
    setauthstate(data);
    console.log("auth state ----------", data);
  }

  useEffect(() => {
    isRegistered();
  }, [signer]);

  useEffect(() => {
    if (authstate === false) {
      connect();
    } else {
      history.push(`/app/dashboard`);
    }
  }, []);

  console.log(web3Provider);

  return (
    <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
        <div className="flex flex-col overflow-y-auto md:flex-row">
          <div className="h-32 md:h-auto md:w-1/2">
            <img
              aria-hidden="true"
              className="object-cover w-full h-full dark:hidden"
              src={Image_}
              alt="Office"
            />
            <img
              aria-hidden="true"
              className="hidden object-cover w-full h-full dark:block"
              src={Image_}
              alt="Office"
            />
          </div>
          <main className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
            <div className="w-full">
              <h1 className="mb-0 text-2xl font-semibold text-gray-700 dark:text-gray-200">
                Welcome to ArTrackrHub 🎉
              </h1>
              <p className="mb-4">web3 decentralize storage Platform</p>
              <Label>
                <span>Tell us something interesting about you</span>
                <Textarea rows={4}></Textarea>
              </Label>

              <Label className="mt-4">
                <span>Choose a web3 avatar</span>
                <Input
                  className="mt-1"
                  type="file"
                  required
                  placeholder="***************"
                />
              </Label>

              <Button className="mt-4" block tag={Link} to="/app">
                Upload
              </Button>

              <hr className="my-8" />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Login;
