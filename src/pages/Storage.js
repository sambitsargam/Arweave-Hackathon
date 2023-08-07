import React, { useState, useEffect, useContext } from "react";
import response from "../utils/demo/tableData";
import ChartCard from "../components/Chart/ChartCard";
import PageTitle from "../components/Typography/PageTitle";
import WS from "../assets/img/ws.png";
import IPFS from "../assets/img/ipfs.png";
import { Input, Label } from "@windmill/react-ui";
import { AuthContext } from "../utils/AuthProvider";
import { Loading } from "@nextui-org/react";
import { Button } from "@windmill/react-ui";
import { ServerIcon, PlusIcon } from "@heroicons/react/24/outline";
import Modals from "../components/Modal/Modal";
import { ellipseAddress } from "../lib/utilities";
function Charts() {
  const [modal, setModal] = useState(false);
  const { address, signer, connect } = useContext(AuthContext);

  const [token, settoken] = useState("");
  const [isloading, setisloading] = useState(false);

  const totalResults = response.length;
  const [platforms, setplatforms] = useState([]);
  const [platformName, setplatformName] = useState("");
  const [projectid, setprojectid] = useState("");
  const [projectsecret, setprojectsecret] = useState("");
  const [isplatformready, setisplatformready] = useState(false);
  const [webstorageready, setwebstorageready] = useState(false);
  const [isipfsready, setisipfsready] = useState(false);
  const [currectplatform, setcurrectplatform] = useState([]);
  const [folders, setfolders] = useState([{ folderName: "" }]);
  async function loadPlatforms() {
    const data = await signer?.getPlatforms();
    setplatforms(data);
  }

  async function loadFolders(id) {
    const data = await signer?.getFolders(id);
    const filterr = data.filter((items) => items.folderName !== "");
    // setisplatformready(false);
    // console.log(filterr);
    setfolders(filterr);
  }
  // console.log(currectplatform[0]);
  useEffect(() => {
    let active = localStorage.getItem("isActive");
    if (active == "ipfs") {
      setisipfsready(true);
      var res = JSON.parse(localStorage.getItem(active));
      loadFolders(res[1]);
      setcurrectplatform(res);
    } else if (active == "webStorage") {
      var res = JSON.parse(localStorage.getItem(active));
      loadFolders(res[1]);
      setcurrectplatform(res);
      setwebstorageready(true);
    }
    loadPlatforms();
  }, [signer, isplatformready]);

  console.log("folders", folders);
  const getWeb3storage = () => {
    var res = platforms?.filter((data) => data.platformName === "Web3 Storage");
    return res;
  };

  const getIPFSstorage = () => {
    var res = platforms?.filter((data) => data.platformName === "IPFS");
    return res;
  };

  const onCreatePlatform = async () => {
    // console.log(token);
    if (
      token == ""
      // ||
      // platformName === "" ||
      // projectid === "" ||
      // projectsecret === ""
    ) {
      alert("All fields are required");
      return;
    }
    let transaction = await signer.addPlatform(
      platformName,
      token,
      projectid,
      projectsecret
    );
    setisloading(true);
    await transaction.wait();
    setPlatformActive(platformName);
    setisplatformready(true);
    setisloading(false);
    setModal(false);
  };

  const setPlatformActive = async (type) => {
    if (type === "ipfs") {
      setisipfsready(true);
      setwebstorageready(false);
      let arr = getIPFSstorage();
      localStorage.setItem(
        `ipfs`,
        JSON.stringify([arr[0]?.platformName, arr[0].platform_id.toString()])
      );
      localStorage.setItem("isActive", type);
      var res = JSON.parse(localStorage.getItem(type));
      loadFolders(res[1]);
      setcurrectplatform(res);
    } else {
      setwebstorageready(true);
      setisipfsready(false);
      let arr = getWeb3storage();
      localStorage.setItem(
        `webStorage`,
        JSON.stringify([arr[0]?.platformName, arr[0].platform_id.toString()])
      );
      localStorage.setItem("isActive", type);
      var res = JSON.parse(localStorage.getItem(type));
      loadFolders(res[1]);
      setcurrectplatform(res);
    }
  };

  return (
    <>
      <PageTitle>Storage Statistics</PageTitle>
      <Modals
        title={"Add Credentials"}
        state={modal}
        onClick={() => {
          setModal(false);
        }}
        actionButtonDesktop={
          <div className="hidden sm:block">
            <Button
              onClick={() => {
                onCreatePlatform();
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
                onCreatePlatform();
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
      >
        {platformName === "IPFS" ? (
          <>
            <Label>
              <span>Project Id</span>
              <Input
                className="mt-1 mb-4"
                placeholder="Project id"
                value={projectid}
                onChange={(e) => {
                  setprojectid(e.target.value);
                }}
              />
            </Label>
            <Label>
              <span>Project Secrete</span>
              <Input
                className="mt-1 mb-4"
                placeholder="Project secret"
                value={projectsecret}
                onChange={(e) => {
                  setprojectsecret(e.target.value);
                }}
              />
            </Label>
          </>
        ) : (
          <Label>
            <span>Token</span>
            <Input
              className="mt-1 mb-4"
              placeholder="token"
              value={token}
              onChange={(e) => {
                settoken(e.target.value);
              }}
            />
          </Label>
        )}
      </Modals>
      <div className="mb-4">
        <ChartCard title="Decentralize storage ">
          <div className="grid md:grid-cols-2 grid-cols-1  gap-6">
            <article
              onClick={() => {
                setPlatformActive("ipfs");
              }}
              class={`${
                isipfsready
                  ? "p-6 cursor-pointer bg-white dark:bg-gray-800 border-4 border-gray-400 dark:border-gray-500  rounded-lg"
                  : "p-6 cursor-pointer bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-500  rounded-lg"
              } `}
            >
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-500 dark:text-gray-300">
                    Platform
                  </p>

                  <p class="text-2xl font-medium text-gray-900 dark:text-gray-300">
                    IPFS
                  </p>
                </div>

                <img src={IPFS} className="rounded-full w-10 h-10" />
              </div>

              {getIPFSstorage()?.length >= 1 ? (
                <div class="flex mt-1 text-green-600 dark:text-green-400 gap-1 cursor-pointer">
                  Platform added already
                </div>
              ) : (
                <>
                  <p className="text-red-500">NB: Credentials are Immutable</p>
                  <div
                    onClick={() => {
                      setplatformName("IPFS");
                      setModal(true);
                    }}
                    class="flex mt-1 text-green-600 dark:text-green-400 gap-1 cursor-pointer"
                  >
                    Add Credential <PlusIcon className="h-6" />
                  </div>
                </>
              )}
            </article>

            <article
              onClick={() => {
                setPlatformActive("webStorage");
              }}
              class={`${
                webstorageready
                  ? "p-6 cursor-pointer bg-white dark:bg-gray-800 border-4 border-gray-400 dark:border-gray-500  rounded-lg"
                  : "p-6 cursor-pointer bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-500  rounded-lg"
              } `}
            >
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-500 dark:text-gray-300">
                    Platform
                  </p>

                  <p class="text-2xl font-medium text-gray-900 dark:text-gray-300">
                    Web3.storage
                  </p>
                </div>

                <img src={WS} className="rounded-full w-10 h-10" />
              </div>

              {getWeb3storage()?.length >= 1 ? (
                <div class="flex mt-1 text-green-600 dark:text-green-400 gap-1 cursor-pointer">
                  Platform added already
                </div>
              ) : (
                <>
                  <p className="text-red-500">NB: Credentials are Immutable</p>
                  <div
                    onClick={() => {
                      setplatformName("Web3 Storage");
                      setModal(true);
                    }}
                    class="flex mt-1 text-green-600 dark:text-green-400 gap-1 cursor-pointer"
                  >
                    Add Credential <PlusIcon className="h-6" />
                  </div>
                </>
              )}
            </article>
          </div>
        </ChartCard>
      </div>
      <div className="grid gap-6 mb-8 md:grid-cols-1">
        <ChartCard title={`${ellipseAddress(address)} Storage`}>
          <div className="flex flex-row space-x-3 items-center ">
            <img
              src={
                currectplatform[0] == "IPFS"
                  ? IPFS
                  : currectplatform[0] === "Web3 Storage"
                  ? WS
                  : ""
              }
              className="w-8 rounded-lg"
            />
            <h1 className="text-xl font-bold dark:text-gray-200 ">
              {currectplatform[0] || ""}
            </h1>
          </div>
          <ServerIcon className="h-40 dark:text-gray-100 text-gray-600" />
          <div className="flex flex-row space-x-3">
            <div class="w-full bg-gray-200 rounded-lg dark:bg-gray-700">
              <div
                class="bg-blue-600 text-xs font-medium text-blue-100 text-center p-1 leading-none rounded-full"
                style={{
                  width: `${folders?.length}%`,
                }}
              >
                {folders?.length}%
              </div>
            </div>
            <span className="dark:text-white">1TB</span>
          </div>
        </ChartCard>

        {/* <ChartCard title="Breakdown">
          <div className="grid md:grid-cols-2 grid-cols-1  gap-6">
            <div className="bg-red-400 rounded-lg p-4">
              <MusicalNoteIcon className="h-8 text-white" />
              <h3 className="font-bold text-2xl text-gray-100">0</h3>
              <p className="text-white text-md">Music</p>
            </div>
            <div className="bg-yellow-300 rounded-lg p-4">
              <PhotoIcon className="h-8 text-white" />
              <h3 className="font-bold text-2xl text-gray-100">0</h3>

              <p className="text-white text-md">Image</p>
            </div>
            <div className="bg-blue-400 rounded-lg p-4">
              <FilmIcon className="h-8 text-white" />
              <h3 className="font-bold text-2xl text-gray-100">0</h3>

              <p className="text-white text-md">Videos</p>
            </div>
            <div className="bg-green-400 rounded-lg p-4">
              <DocumentTextIcon className="h-8 text-white" />
              <h3 className="font-bold text-2xl text-gray-100">0</h3>

              <p className="text-white text-md">Files</p>
            </div>
          </div>
        </ChartCard> */}
      </div>
    </>
  );
}

export default Charts;
