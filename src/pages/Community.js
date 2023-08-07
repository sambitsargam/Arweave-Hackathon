import React, { useState, useEffect, useContext } from "react";
import { ethers } from "ethers";
import { Link } from "react-router-dom";
import {
  Modal,
  Input,
  Row,
  Checkbox,
  Button,
  Text,
  Loading,
  Textarea,
} from "@nextui-org/react";

import { AuthContext } from "../utils/AuthProvider";
import PageTitle from "../components/Typography/PageTitle";
import SectionTitle from "../components/Typography/SectionTitle";
import CTA from "../components/CTA";
import {} from "@windmill/react-ui";
import PONK from "../assets/img/irupus.png";
import { ellipseAddress } from "../lib/utilities";
function Buttons() {
  const { address, signer, connect } = useContext(AuthContext);
  const [visible, setVisible] = React.useState(false);
  const [visible2, setVisible2] = React.useState(false);
  const [userstatus, setuserstatus] = useState("");
  const [imageurl, setimageurl] = useState("");
  const [profile, setprofile] = useState("");
  const [isloading, setisloading] = useState(false);
  const [amount, setamount] = useState("");
  const [users, setusers] = useState([]);
  const [userid, setuserid] = useState("");
  const handler = () => setVisible(true);
  const closeHandler = () => {
    setVisible(false);
    console.log("closed");
  };
  const closeHandler2 = () => {
    setVisible2(false);
    console.log("closed");
  };
  async function isUserRegistered() {
    const data = await signer?.isRegistered();
    setuserstatus(data);
  }

  async function allUsers() {
    const data = await signer?.fetchAllUsers();
    setusers(data);
    console.log(data);
    // setuserstatus(data);
  }
  useEffect(() => {
    isUserRegistered();
    allUsers();
  }, [signer]);

  const onAddProfile = async () => {
    let transaction = await signer.createProfile(imageurl, profile);
    setisloading(true);
    let txReceipt = await transaction.wait();
    setisloading(false);
    setVisible(false);
  };

  const onTipUser = async () => {
    const amount_ = ethers.utils.parseUnits(amount, "ether");
    let transaction = await signer.tipUser(userid, {
      value: amount_,
    });
    setisloading(true);
    let txReceipt = await transaction.wait();
    setisloading(false);
    setVisible(false);
  };
  return (
    <>
      {/* {isUserRegistered() == false ? setVisible(true) : setVisible(false)} */}
      {/* <Button onClick={handler}>Open modal</Button> */}
      {userstatus == false ? (
        <Button color="gradient" onClick={handler} className="mt-6">
          Add Profile
        </Button>
      ) : (
        ""
      )}

      <Modal
        closeButton
        blur
        aria-labelledby="modal-title"
        open={visible}
        onClose={closeHandler}
      >
        <Modal.Header>
          <Text id="modal-title" size={18}>
            Add a profile <Text b size={18}></Text>
          </Text>
        </Modal.Header>
        <Modal.Body>
          <Input
            clearable
            bordered
            fullWidth
            color="primary"
            size="lg"
            required
            value={imageurl}
            onChange={(e) => {
              setimageurl(e.target.value);
            }}
            placeholder="place image url here"
          />
          <Textarea
            clearable
            bordered
            fullWidth
            color="primary"
            size="lg"
            value={profile}
            required
            onChange={(e) => {
              setprofile(e.target.value);
            }}
            placeholder="tell us something interesting about yourself"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button auto flat color="error" onClick={closeHandler}>
            Close
          </Button>
          <Button
            auto
            onClick={() => {
              onAddProfile();
            }}
          >
            {isloading ? (
              <Loading size="xs" color="white" className="pr-4" />
            ) : (
              ""
            )}
            Add
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        closeButton
        blur
        aria-labelledby="modal-title"
        open={visible2}
        onClose={closeHandler2}
      >
        <Modal.Header>
          <Text id="modal-title" size={18}>
            Enter an amount <Text b size={18}></Text>
          </Text>
        </Modal.Header>
        <Modal.Body>
          <Input
            clearable
            bordered
            fullWidth
            color="primary"
            size="lg"
            required
            value={amount}
            onChange={(e) => {
              setamount(e.target.value);
            }}
            placeholder="Enter amount(eth)"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button auto flat color="error" onClick={closeHandler2}>
            Close
          </Button>
          <Button
            auto
            onClick={() => {
              onTipUser();
            }}
          >
            {isloading ? (
              <Loading size="xs" color="white" className="pr-4" />
            ) : (
              ""
            )}
            Add
          </Button>
        </Modal.Footer>
      </Modal>
      <PageTitle>ArTrackrHub Community</PageTitle>

      <form className="mb-4">
        <label
          for="default-search"
          class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-gray-300"
        >
          Search
        </label>
        <div class="relative">
          <div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
            <svg
              aria-hidden="true"
              class="w-5 h-5 text-gray-500 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
          <input
            type="search"
            id="default-search"
            class="block p-3 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 focus:outline-none"
            placeholder="Search Users"
            required=""
          />
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ">
        {users?.map((users) => (
          <div
            class="overflow-hidden border border-gray-200 rounded-lg grid grid-cols-1 group sm:grid-cols-3"
            href=""
          >
            <div class="relative">
              <img
                class="absolute inset-0 object-cover w-full h-full"
                src={users?.image}
                alt=""
              />
            </div>

            <div class="p-8 sm:col-span-2">
              <ul class="flex space-x-1">
                <li
                  onClick={() => {
                    setVisible2(true);
                    setuserid(users?.id?.toString());
                    // onTipUser(users?.id?.toString());
                  }}
                  class="inline-block px-3 py-1 text-xs font-semibold text-white bg-blue-600 rounded-full"
                >
                  Tip
                </li>
              </ul>

              <h5 class="mt-4 font-bold dark:text-gray-300">
                {" "}
                {ellipseAddress(users?._address)}
              </h5>

              <p class="mt-2 text-sm text-gray-500 dark:text-gray-200">
                {users?.profile}
              </p>
              <p class="mt-2 text-sm text-gray-500 dark:text-gray-200">
                {ethers.utils.formatEther(users?.balance?.toString())}
                ETH
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Buttons;
