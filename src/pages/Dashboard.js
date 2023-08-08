import React, { useState, useEffect, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import InfoCard from "../components/Cards/InfoCard";
import FileCard from "../components/Cards/FileCard";
import { AuthContext } from "../utils/AuthProvider";
import { Modal, Text, Loading } from "@nextui-org/react";
import PageTitle from "../components/Typography/PageTitle";
import response from "../utils/demo/tableData";
import Modals from "../components/Modal/Modal";
import FileViewer from "react-file-viewer";
import prettyBytes from "pretty-bytes";
import { CopyToClipboard } from "react-copy-to-clipboard";
import DownloadLink from "react-download-link";

import { Input, HelperText, Label, Select, Textarea } from "@windmill/react-ui";
import FileDetail from "../components/Modal/FileDetail";
import {
  TableBody,
  TableContainer,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  TableFooter,
  Avatar,
  Badge,
  Pagination,
  Button,
} from "@windmill/react-ui";

import {
  PhotoIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  PlusIcon,
  ServerIcon,
  CalendarIcon,
  ShieldCheckIcon,
  UserIcon,
  LockClosedIcon,
  MusicalNoteIcon,
} from "@heroicons/react/24/outline";
import Image1 from "../assets/img/create-account-office-dark.jpeg";

import WS from "../assets/img/ws.png";
import IPFS from "../assets/img/ipfs.png";
import Moralis from "../assets/img/moralis.png";
import FolderCard from "../components/Cards/FolderCard";
import { ellipseAddress, timeConverter } from "../lib/utilities";

function Dashboard() {
  let isActive = localStorage.getItem("isActive");

  const history = useHistory();
  const [visible, setVisible] = React.useState(false);
  const [visible2, setvisible2] = useState(false);
  const handler = () => setVisible(true);
  const {
    address,
    signer,
    contract,
    provider,
    chainId,
    connect,
    web3Provider,
  } = useContext(AuthContext);

  console.log("signer", signer);
  const [isloading, setisloading] = useState(false);
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [folders, setfolders] = useState([]);
  const [modal, setModal] = useState(false);
  const [fileModal, setFileModal] = useState(false);
  const [storage, setstorage] = useState([]);
  const [foldername, setfoldername] = useState("");
  const [files, setfiles] = useState([]);
  const [fileinfo, setfileinfo] = useState({});
  const [copied, setcopied] = useState(false);
  // pagination setup
  const [webstorageready, setwebstorageready] = useState(false);
  const [isipfsready, setisipfsready] = useState(false);
  const [currectplatform, setcurrectplatform] = useState([]);
  const [isplatformready, setisplatformready] = useState(false);
  const [isactiveid, setisactiveid] = useState();
  const [isnotconnected, setisnotconnected] = useState(false);
  // console.log(foldername);
  async function loadfolders(id) {
    const data = await signer?.getFolders(id);
    // console.log(data);
    const filterr = data.filter((items) => items.folderName !== "");

    setfolders(filterr);
    loadfiles(filterr[0]?.id.toString());
    console.log("folders ----------", filterr);
  }

  const onError = (err) => {
    console.log("Error:", err); // Write your own logic
  };
  async function loadStorages() {
    const data = await signer?.getPlatforms();
    setstorage(data);
    console.log("storage ----------", data);
  }

  async function loadfiles(folderId = 0) {
    const data = await signer?.getFiles(folderId);
    // console.log(data);
    setfiles(data);
    // setfileready(!fileready);
    console.log("files ----------", data);
  }

  useEffect(() => {
    if (!web3Provider) {
      setisnotconnected(true);
      setvisible2(true);
    }
    let active = localStorage.getItem("isActive");
    if (active == "ipfs") {
      setisipfsready(true);
      var res = JSON.parse(localStorage.getItem(active));
      loadfolders(res[1]);
      setisactiveid(res[1]);
      setcurrectplatform(res);
    } else if (active == "webStorage") {
      var res = JSON.parse(localStorage.getItem(active));
      loadfolders(res[1]);
      setisactiveid(res[1]);
      setcurrectplatform(res);
      setwebstorageready(true);
    }
    // loadfolders();
    loadStorages();

    // loadfiles();
  }, [signer, isplatformready]);

  const resultsPerPage = 10;
  const totalResults = files.length;
  console.log(storage?.length);
  // pagination change control
  function onPageChange(p) {
    setPage(p);
  }

  useEffect(() => {
    // if(copied === ')
    setData(response.slice((page - 1) * resultsPerPage, page * resultsPerPage));
  }, [page]);

  console.log("isactiveid", isactiveid);

  const onCreateFolder = async (foldername_) => {
    if (foldername_ === "") {
      alert("foldername cant be empty");
      return;
    }
    let transaction = await signer.createFolder(foldername_, isactiveid);
    setisloading(true);
    let txReceipt = await transaction.wait();
    setisloading(false);
    setModal(false);
    const [transferEvent] = txReceipt.events;
    const { foldername, _id } = transferEvent.args;
    history.push(`/app/folder/${foldername.toString()}/${_id.toString()}`);
    console.log(foldername, _id);
  };

  const setPlatformActive = async (type) => {
    if (type === "ipfs") {
      var res = JSON.parse(localStorage.getItem(type));
      setisipfsready(true);
      setwebstorageready(false);
      loadfolders(res[1]);
      setisplatformready(true);
    } else {
      var res = JSON.parse(localStorage.getItem(type));
      setwebstorageready(true);
      setisipfsready(false);
      loadfolders(res[1]);
      setisplatformready(true);
    }
  };

  const fileFormatIcon = (type) => {
    if (type == "pdf") {
      return <DocumentTextIcon className="h-8 text-red-500 pr-2" />;
    } else if (type == "mp3") {
      return <MusicalNoteIcon className="h-8 text-green-500 pr-2" />;
    } else if (type == "mp4") {
      return <VideoCameraIcon className="h-8 text-yellow-400 pr-2" />;
    } else {
      return <PhotoIcon className="h-8 text-blue-400 pr-2" />;
    }
  };
  return ( 
    <>
      <Modal blur aria-labelledby="modal-title" open={visible} preventClose>
        <Modal.Header>
          <Text id="modal-title" size={18}>
            <Text b size={18}>
              ArTrackrHub
            </Text>
          </Text>
        </Modal.Header>
        <Modal.Body>
          <Text id="modal-title" size={18}>
            Add a storage platform to process with the application{" "}
          </Text>
        </Modal.Body>
        <Modal.Footer>
          <Link to="/app/storage">
            <Button>Add storage platform</Button>
          </Link>
        </Modal.Footer>
      </Modal>

      <Modals
        title={"Create Folder"}
        state={modal}
        onClick={() => {
          setModal(false);
        }}
        actionButtonDesktop={
          <div className="hidden sm:block">
            <Button
              onClick={() => {
                onCreateFolder(foldername);
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
                onCreateFolder(foldername);
              }}
            >
              Create
            </Button>
          </div>
        }
      >
        <Label>
          <span>Name</span>
          <Input
            className="mt-1"
            placeholder="Folder name"
            value={foldername}
            onChange={(e) => {
              setfoldername(e.target.value);
            }}
          />
        </Label>
      </Modals>
      <FileDetail
        title={"Details"}
        state={fileModal}
        onClick={() => {
          setFileModal(false);
        }}
        actionButtonDesktop={
          <div className="hidden sm:block">
            {/* <Button block size="large">
              Download
            </Button> */}
          </div>
        }
        actionButtonMobile={
          <div className="block w-full sm:hidden">
            <DownloadLink filename={fileinfo.fileHash}>
              {/* <Button block size="large">
                Download
              </Button> */}
            </DownloadLink>
          </div>
        }
      >
        <div className="mb-4">
          {copied ? (
            <p className="text-center text-xl bg-green-400 rounded-lg py-0 max-w-xs text-white m-auto mb-2">
              copied
            </p>
          ) : (
            ""
          )}
          <CopyToClipboard
            text={fileinfo.fileHash}
            onCopy={() => {
              setcopied(true);
            }}
          >
            <Button block size="small" layout="outline">
              Copy URL
            </Button>
            {/* <span>Copy to clipboard with span</span> */}
          </CopyToClipboard>
        </div>
        {/* <img src={Image1} className="rounded-lg" /> */}
        <div className="h-48 rounded-lg w-full">
          <FileViewer
            fileType={fileinfo.fileType}
            filePath={fileinfo.fileHash}
            // errorComponent={CustomErrorComponent}
            onError={onError}
          />
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full text-sm divide-y divide-gray-200">
            <thead>
              <tr className="">
                <th class="p-4 font-medium text-left text-gray-900 dark:text-gray-300 whitespace-nowrap">
                  <div class="flex items-center">Type</div>
                </th>
                <th class="p-4 font-medium text-left text-gray-900 dark:text-gray-300 whitespace-nowrap">
                  <div class="flex items-center">Size</div>
                </th>
                <th class="p-4 font-medium text-left text-gray-900 dark:text-gray-300 whitespace-nowrap">
                  <div class="flex items-center">Created</div>
                </th>
                <th class="p-4 font-medium text-left text-gray-900 dark:text-gray-300 whitespace-nowrap">
                  <div class="flex items-center">Platform</div>
                </th>
                <th class="p-4 font-medium text-left text-gray-900 dark:text-gray-300 whitespace-nowrap">
                  <div class="flex items-center">Owner</div>
                </th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-100">
              <tr>
                <td class="p-4 font-medium text-gray-900 dark:text-gray-300 flex flex-col justify-start items-center whitespace-nowrap">
                  <DocumentTextIcon className="h-6 dark:text-gray-200" />{" "}
                  <span>{fileinfo.fileType}</span>
                </td>
                <td class="p-4 text-gray-700 dark:text-gray-300  whitespace-nowrap">
                  <ServerIcon className="h-6  dark:text-gray-200" />{" "}
                  <span>
                    {prettyBytes(parseInt(fileinfo?.fileSize?.toString()) || 0)}
                  </span>
                </td>
                <td class="p-4 text-gray-700 dark:text-gray-300 items-center whitespace-nowrap">
                  <CalendarIcon className="h-6  dark:text-gray-200" />{" "}
                  <span>{fileinfo?.uploadTime?.toString()}</span>
                </td>
                <td class="p-4 text-gray-700 dark:text-gray-300 whitespace-nowrap">
                  <ShieldCheckIcon className="h-6  dark:text-gray-200" />{" "}
                  <span>IPFS</span>
                </td>
                <td class="p-4 text-gray-700 dark:text-gray-300 whitespace-nowrap">
                  <UserIcon className="h-6  dark:text-gray-200" />{" "}
                  <span>{ellipseAddress(fileinfo.sender)}</span>
                </td>
                {/* <td class="p-4 text-gray-700 dark:text-gray-300 whitespace-nowrap">
                  <LockClosedIcon className="h-6  dark:text-gray-200" />{" "}
                  <span>Only You</span>
                </td> */}
              </tr>
            </tbody>
          </table>
        </div>
      </FileDetail>
      <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
        {/* {storage?.map((platform) => { */}

        <>
          <Link to="/app/storage">
            <div
              onClick={() => {
                setPlatformActive("ipfs");
              }}
              className={` ${
                isipfsready
                  ? "mt-5 flex flex-row space-x-3 cursor-pointer items-center border-2 p-3 rounded-lg md:max-w-sm max-w-full border-blue-300"
                  : "mt-5 flex flex-row space-x-3 cursor-pointer items-center border-2 p-3 rounded-lg md:max-w-sm max-w-full"
              }  `}
            >
              <img src="https://cryptologos.cc/logos/arweave-ar-logo.svg?v=026" alt="img" className="w-8 rounded-lg" />
              <p class="text-xl font-medium text-gray-900 dark:text-gray-300">
                Arweave
              </p>{" "}
            </div>
          </Link>
          <Link to="/app/storage">
            <div
              onClick={() => {
                setPlatformActive("webStorage");
              }}
              className={` ${
                webstorageready
                  ? "mt-5 flex flex-row space-x-3 cursor-pointer items-center border-2 p-3 rounded-lg md:max-w-sm max-w-full border-blue-300"
                  : "mt-5 flex flex-row space-x-3 cursor-pointer items-center border-2 p-3 rounded-lg md:max-w-sm max-w-full"
              }  `}
            >
              <img src="https://blog.othent.io/blog/introducing-othent/favicon.svg" alt="img" className="w-8 rounded-lg" />
              <p class="text-xl font-medium text-gray-900 dark:text-gray-300">
                Othent
                
              </p>{" "}
            </div>
          </Link>
        </>
      </div>
      <PageTitle>Quick Access</PageTitle>
      {/* <!-- Cards --> */}
      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
        {/* {folders?.length > 0 ? loadfiles(folders[0]?.id.toString()) : ""} */}
        {files
          ?.slice(0, 5)
          .map((files) => {
            if (
              files.fileType === "png" ||
              files.fileType === "jpeg" ||
              files.fileType === "gif" ||
              files.fileType === "jpg"
            ) {
              return (
                <div
                  onClick={() => {
                    setFileModal(true);
                    setfileinfo(files);
                  }}
                >
                  <InfoCard
                    title={files.fileName}
                    image={files.fileHash}
                    value={timeConverter(files.uploadTime.toString())}
                  ></InfoCard>
                </div>
              );
            } else {
              return (
                <div
                  onClick={() => {
                    setFileModal(true);
                    setfileinfo(files);
                  }}
                >
                  <FileCard
                    title={files.fileName}
                    value={timeConverter(files.uploadTime.toString())}
                    type={files.fileType}
                  />
                </div>
              );
            }
          })
          .reverse()}

        {/* <InfoCard
          title="Desktop"
          image={Image2}
          value="Created on 23/3/11"
        ></InfoCard>
        <InfoCard
          title="Desktop"
          image={Image3}
          value="Created on 23/3/11"
        ></InfoCard>
        <InfoCard
          title="Desktop"
          image={Image4}
          value="Created on 23/3/11"
        ></InfoCard> */}
      </div>
      <div className="flex flex-row items-center space-x-4">
        <PageTitle>Folders</PageTitle>
        <PlusIcon
          onClick={() => {
            if (storage?.length <= 0) {
              handler();
            }
            setModal(true);
          }}
          className="h-6 cursor-pointer dark:text-gray-200"
        />
      </div>
      {/* <!-- Cards --> */}
      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
        {folders?.map((folders) => (
          <Link
            to={`/app/folder/${folders.folderName.toString()}/${folders.id.toString()}`}
          >
            <FolderCard
              title={folders.folderName}
              image={Image1}
              value="Modified 8m ago"
            ></FolderCard>
          </Link>
        ))}

        {/* <FolderCard
          title="Folder 2"
          image={Image1}
          value="Modified 8m ago"
        ></FolderCard>
        <FolderCard
          title="Folder 3"
          image={Image1}
          value="Modified 8m ago"
        ></FolderCard> */}
      </div>

      <PageTitle>
        Your files in '{folders[0]?.folderName || ""}' folder
      </PageTitle>
      <TableContainer>
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>File Size</TableCell>
              <TableCell>Upload Time</TableCell>
              <TableCell>Action</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {files
              ?.map((files, i) => (
                <TableRow
                  onClick={() => {
                    setFileModal(true);
                    setfileinfo(files);
                  }}
                >
                  <TableCell>
                    <div className="flex items-center text-sm">
                      {fileFormatIcon(files.fileType)}
                      <div>
                        <p className="font-semibold">{files.fileName}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm"> {files.fileType}</span>
                  </TableCell>
                  <TableCell>
                    <span>
                      {prettyBytes(parseInt(files?.fileSize?.toString()) || 0)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span>{timeConverter(files?.uploadTime?.toString())}</span>
                  </TableCell>
                  <TableCell>
                    {files?.fileType != "mp3" &&
                    files?.fileType != "mp4" &&
                    files?.fileType != "pdf" ? (
                      <Button
                        onClick={() => {
                          localStorage.setItem("nftstring", files?.fileHash);
                          localStorage.setItem("nftactive", true);
                        }}
                      >
                        <Link to="/app/nft">Use as NFT</Link>
                      </Button>
                    ) : (
                      ""
                    )}
                  </TableCell>
                </TableRow>
              ))
              .reverse()}
          </TableBody>
        </Table>
        <TableFooter>
          <Pagination
            totalResults={totalResults}
            resultsPerPage={resultsPerPage}
            label="Table navigation"
            onChange={onPageChange}
          />
        </TableFooter>
      </TableContainer>
    </>
  );
}

export default Dashboard;