import React, { useState, useEffect, useContext, useRef } from "react";
import PageTitle from "../components/Typography/PageTitle";
import { useMoralis, useMoralisQuery } from "react-moralis";

import Profile from "../assets/img/irupus.png";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import Emojicons from "./Emojicons";
import { Input } from "@windmill/react-ui";
import { ellipseAddress } from "../lib/utilities";
import { AuthContext } from "../utils/AuthProvider";

const MINS_DURATION = 90;

function Modals() {
  const { isAuthenticated, logout, authenticate, user, Moralis, setUserData } =
    useMoralis();
  const endOfMessagesRef = useRef(null);
  const [message, setMessage] = useState("");
  const [userprofile, setuserprofile] = useState("");
  const [username, setusername] = useState("");
  const { address, signer, connect } = useContext(AuthContext);
  async function loaduser() {
    const data = await signer.getSingleUser();
    console.log(data);
    localStorage.setItem("userprofile", JSON.stringify(data));
    setuserprofile(data);
  }

  useEffect(() => {
    loaduser();
  }, [signer]);

  const { data } = useMoralisQuery(
    "Messages",
    (query) =>
      query
        .ascending("createdAt")
        .greaterThan(
          "createdAt",
          new Date(Date.now() - 1000 * 60 * MINS_DURATION)
        ),
    [],
    {
      live: true,
    }
  );

  const sendMessage = (e) => {
    e.preventDefault();
    if (!message) return;
    const Messages = Moralis.Object.extend("Messages");
    const messages = new Messages();
    messages
      .save({
        message: message,
        username: user.getUsername(),
        ethAddress: user.get("ethAddress"),
      })
      .then(
        (message) => {},
        (error) => {
          console.log(error.message);
        }
      );
    endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    setMessage("");
  };

  const onChangeUserName = () => {
    if (username === "") {
      return;
    }
    setUserData({
      username: username,
    }).then((res) => {
      setusername("");
    });
  };

  if (!isAuthenticated) {
    // alert("not authenticated");
    return (
      <h1
        
        className="bg-blue-600 items-center space-x-4 flex rounded-full px-8 py-2 text-white item-center m-auto mt-6 "
      >
          will be available soon
      </h1>
    );
  }

  return (
    <>
      <PageTitle>Chat</PageTitle>

      <div class="flex h-screen antialiased text-blue-800">
        <div class="flex md:flex-row flex-col h-full w-full overflow-x-hidden">
          <div class="flex flex-col px-4 mb-5 mt-6 dark:bg-gray-700 rounded-lg  w-full md:w-64 bg-white flex-shrink-0">
            <div class="w-full mt-4 bg-white rounded-lg border border-gray-200  dark:bg-gray-800 dark:border-gray-700">
              <div class="flex justify-end px-4 pt-4"></div>
              <div class="flex flex-col items-center pb-10">
                {userprofile.image?.length === 0 ? (
                  <Emojicons username={user.getUsername()} />
                ) : (
                  <img
                    class="mb-3 w-24 h-24 rounded-full shadow-lg"
                    src={userprofile?.image}
                    alt="Bonnie image"
                  />
                )}

                <h5 class="mb-1 text-xl font-medium text-gray-900 dark:text-white">
                  {user.getUsername()}
                </h5>
                <span class="text-sm text-gray-500 dark:text-gray-400"></span>
                <div className="items-center justify-center ">
                  <div class="w-4 h-4 animate-ping mt-1 bg-green-400  rounded-full m-auto"></div>

                  <p className="dark:text-white">Online</p>
                </div>

                {/* <Input clearable label="Name" placeholder="Name" initialValue="NextUI" /> */}
                <div className="flex flex-row items-center">
                  <Input
                    className="focus:ring-0 focus:border-transparent"
                    placeholder="change username"
                    onChange={(e) => {
                      setusername(e.target.value);
                    }}
                    value={username}
                  />
                  <div
                    onClick={() => {
                      onChangeUserName();
                    }}
                  >
                    <CheckCircleIcon className="h-6 dark:text-gray-200" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="flex flex-col flex-auto h-full p-6">
            <div class="flex flex-col flex-auto w-full flex-shrink-0 rounded-2xl dark:bg-gray-700 bg-gray-100 h-full p-4">
              <div class="flex flex-col h-full overflow-x-auto mb-4">
                <div class="flex flex-col h-full">
                  <div class="grid grid-cols-12 gap-y-2">
                    {data.map((message) => {
                      const isUserMessage =
                        message.get("ethAddress") === user.get("ethAddress");
                      if (isUserMessage) {
                        return (
                          <>
                            <div class="col-start-6 flex flex-col col-end-13 p-3 rounded-lg">
                              <div class="flex items-center justify-start flex-row-reverse">
                                <div class="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                                  {userprofile.image?.length === 0 ? (
                                    <Emojicons
                                      username={message.get("username")}
                                    />
                                  ) : (
                                    <img
                                      class="mb-0 w-10 h-10 rounded-full shadow-lg"
                                      src={userprofile?.image}
                                      alt="Bonnie image"
                                    />
                                  )}
                                </div>
                                <div class="relative mr-3 text-sm bg-indigo-100 dark:bg-gray-600 dark:text-white rounded-md py-2 px-4 shadow rounded-xl">
                                  <div>{message.get("message")}</div>
                                </div>
                              </div>
                              <span className="justify-end dark:text-gray-200 items-end text-xs flex flex-row">
                                {message.get("username")}
                              </span>
                            </div>
                          </>
                        );
                      } else {
                        <div class="col-start-1 col-end-8 p-3 rounded-lg">
                          <div class="flex flex-row items-center">
                            <div class="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                              {userprofile.image?.length === 0 ? (
                                <Emojicons username={message.get("username")} />
                              ) : (
                                <img
                                  class="mb-0 w-10 h-10 rounded-full shadow-lg"
                                  src={userprofile?.image}
                                  alt="Bonnie image"
                                />
                              )}
                            </div>
                            <div class="relative ml-3 text-sm bg-white rounded-md dark:bg-gray-800 dark:text-white py-2 px-4 shadow rounded-xl">
                              <div>{message.get("message")}</div>
                            </div>
                          </div>
                          <span className="justify-end dark:text-gray-200 items-end text-xs flex flex-row">
                            {message.get("username")}
                          </span>
                        </div>;
                      }
                    })}
                  </div>
                </div>
              </div>
              <div
                ref={endOfMessagesRef}
                className="flex flex-row items-center justify-center text-lg dark:text-gray-300 "
              >
                <CheckCircleIcon className="h-4 text-green-500 " />
                {""} You're caught up {user.getUsername()}
              </div>
              <div class="flex flex-row items-center h-16 rounded-xl bg-white rounded-md dark:bg-gray-800 dark:text-white w-full px-4">
                <div>
                  <button class="flex items-center justify-center text-gray-400 hover:text-gray-600">
                    <svg
                      class="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                      ></path>
                    </svg>
                  </button>
                </div>
                <div class="flex-grow ml-4">
                  <div class="relative w-full">
                    <input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={`Enter a Message ${user.getUsername()}`}
                      type="text"
                      class="flex w-full border rounded-lg dark:bg-gray-900 dark:border-transparent rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
                    />
                  </div>
                </div>
                <div class="ml-4">
                  <button
                    onClick={sendMessage}
                    class="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0"
                  >
                    <span>Send</span>
                    <span class="ml-2">
                      <svg
                        class="w-4 h-4 transform rotate-45 -mt-px"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        ></path>
                      </svg>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Modals;
