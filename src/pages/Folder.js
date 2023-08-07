import React, { useState, useEffect, useContext } from "react";
import { FolderOpenIcon } from "@heroicons/react/24/solid";
import { useParams, useHistory, Link } from "react-router-dom";
import PageTitle from "../components/Typography/PageTitle";
// import { NFTStorage } from "https://cdn.jsdelivr.net/npm/nft.storage/dist/bundle.esm.min.js";
import { Web3Storage } from "web3.storage";
import axios from "axios";
import { Progress } from "@nextui-org/react";

// import { Web3Storage } from "web3.storage/dist/bundle.esm.min.js.map";
import response from "../utils/demo/tableData";
import Modals from "../components/Modal/Modal";
import { Input, HelperText, Label, Select, Textarea } from "@windmill/react-ui";
import FileDetail from "../components/Modal/FileDetail";
import FileViewer from "react-file-viewer";
// import { CustomErrorComponent } from "custom-error";
import { AuthContext } from "../utils/AuthProvider";
// import { create as ipfsHttpClient } from "ipfs-http-client";
import prettyBytes from "pretty-bytes";
import DownloadLink from "react-download-link";
import { CopyToClipboard } from "react-copy-to-clipboard";

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
  GifIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  MusicalNoteIcon,
  PlusIcon,
  ServerIcon,
  CalendarIcon,
  ShieldCheckIcon,
  UserIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import Image1 from "../assets/img/create-account-office-dark.jpeg";
import Image2 from "../assets/img/create-account-office.jpeg";
import Image3 from "../assets/img/forgot-password-office-dark.jpeg";
import Image4 from "../assets/img/forgot-password-office.jpeg";
import WS from "../assets/img/ws.png";
import IPFS from "../assets/img/ipfs.png";
import Moralis from "../assets/img/moralis.png";
import FolderCard from "../components/Cards/FolderCard";
import { ellipseAddress, timeConverter } from "../lib/utilities";
import { Loading } from "@nextui-org/react";

function Dashboard() {
  const [token, settoken] = useState("");
  const [projectid, setprojectid] = useState("");
  const [projectsecrete, setprojectsecrete] = useState("");

  function getAccessToken() {
    // return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDNCQzQzMDliYTJGRGIxMDZGZWM0YzJGMTJiZmE4RTMwQTUzMTZiZDUiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjI0OTA3ODUyMjUsIm5hbWUiOiJkZWNlbnRyb2dlIn0.kcD-OCoPPtPAYR9Ph_cOfz0A9Jl_KamPPmo20j0Q1Dc";
    return token;
  }

  function makeStorageClient() {
    return new Web3Storage({ token: getAccessToken() });
  }

  // const projectId = "2DB3mQQJtzIC03GYarET8tFZJIm";
  const projectId = projectid;
  const projectSecret = projectsecrete;
  // const projectSecret = "0dedd8064ff788414096e72cc7e3f4a1";
  const auth =
    "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");
  const ipfsClient = require("ipfs-http-client");
  console.log(auth);
  const ipfs = ipfsClient.create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
    apiPath: "/api/v0",
    headers: {
      authorization: auth,
    },
  });

  const { address, signer, contract, provider, chainId, connect } =
    useContext(AuthContext);
  let { foldername, id } = useParams();
  const [fileinfo, setfileinfo] = useState({});
  const [copied, setcopied] = useState(false);
  const [isloading, setisloading] = useState(false);
  const [isfileuploading, setisfileuploading] = useState(false);
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [file, setFile] = useState("");
  const [filetype, setfiletype] = useState("");
  const [filesize, setfilesize] = useState("");
  const [files, setfiles] = useState([]);
  const [fileready, setfileready] = useState(false);
  const [fileModal, setFileModal] = useState(false);
  // pagination setup
  const resultsPerPage = 10;
  const totalResults = files?.length;

  // pagination change control
  function onPageChange(p) {
    setPage(p);
  }

  let isActive = localStorage.getItem("isActive");

  async function loadPlatforms() {
    let active = localStorage.getItem("isActive");
    if (active == "ipfs") {
      const data = await signer?.getPlatforms();
      const filterr = data.filter((items) => items.platformName == "IPFS");
      setprojectid(filterr[0]?.platformid);
      setprojectsecrete(filterr[0]?.platformsecret);
      console.log(filterr[0]?.platformid);
      console.log(filterr[0]?.platformsecret);
    } else {
      const data = await signer?.getPlatforms();
      const filterr = data.filter(
        (items) => items.platformName == "Web3 Storage"
      );
      settoken(filterr[0]?.token);
      console.log(filterr[0]?.token);
    }
    // setplatforms(data);
  }

  async function loadfiles() {
    const data = await signer?.getFiles(id);
    // console.log(data);
    setfiles(data);
    console.log("files ----------", data);
  }

  useEffect(() => {
    loadfiles();
    loadPlatforms();
  }, [signer, fileready]);

  // here you would make another server request for new data
  useEffect(() => {
    setData(response.slice((page - 1) * resultsPerPage, page * resultsPerPage));
  }, [page]);

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

  function getExtension() {
    return filetype.split(".").pop();
  }

  //web3 storage
  async function onChangeCoverImage(e) {
    setisloading(true);
    const files = e.target.files[0];
    const client = makeStorageClient();
    const cid = await client.put([files]);
    console.log("stored files with cid:", cid);

    const res = await client.get(cid);
    console.log(`Got a response! [${res.status}] ${res.statusText}`);
    if (!res.ok) {
      throw new Error(
        `failed to get ${cid} - [${res.status}] ${res.statusText}`
      );
    }

    // unpack File objects from the response
    const filess = await res.files();
    setFile(`https://${cid}.ipfs.dweb.link/${files.name}`);
    // console.log(file);
    console.log(files);
    setisloading(false);
    for (const file of filess) {
      setfiletype(file.name);
      setfilesize(file.size);
      console.log(
        `${file.cid} -- ${file.path} -- ${file.size} -- ${file.name}`
      );
    }
    return cid;
  }

  const onError = (err) => {
    console.log("Error:", err); // Write your own logic
  };

  //ipfs
  async function onChange(e) {
    setisloading(true);
    const file = e.target.files[0];
    console.log(file);
    try {
      const added = await ipfs.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });

      const url = `https://infura-ipfs.io/ipfs/${added.path}`;
      console.log(url);
      setFile(url);
      setisloading(false);
      setfiletype(file.name);
      setfilesize(file.size);
      // setFileUrl(url);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  const onUploadFile = async () => {
    setisfileuploading(true);
    let transaction = await signer.addFiles(
      id,
      file,
      filesize,
      getExtension(),
      filetype,
      ""
    );

    let txReceipt = await transaction.wait();
    const [transferEvent] = txReceipt.events;
    console.log(transferEvent);
    setisfileuploading(false);
    setFile("");
    setfileready(true);

    // history.push(0);
    // const { foldername, _id } = transferEvent.args;
    // history.push(`/app/folder/${foldername.toString()}/${_id.toString()}`);
    // console.log(foldername, _id);
  };

  return (
    <>
      <FileDetail
        title={"Details"}
        state={fileModal}
        onClick={() => {
          setFileModal(false);
        }}
        actionButtonDesktop={
          <div className="hidden sm:block">
            {/* <Button>Download</Button> */}
          </div>
        }
        actionButtonMobile={
          <div className="block w-full sm:hidden">
            {/* <DownloadLink
              label="Save"
              filename="myfile.txt"
              exportFile={() => "My cached data"}
            /> */}
            <DownloadLink filename={fileinfo.fileHash}>
              {/* <Button block size="large">
                Download
              </Button> */}
            </DownloadLink>
          </div>
        }
      >
        <div className="mb-4">
          <CopyToClipboard
            text={fileinfo.fileHash}
            onCopy={() => {
              setcopied(true);
            }}
          >
            <Button block size="small" layout="outline">
              {copied ? "Copied" : "Copy URL"}
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
      <div className="flex flex-row space-x-2  items-center">
        <FolderOpenIcon className="h-16 text-blue-500" />
        <PageTitle>{foldername}</PageTitle>
      </div>

      <div class="max-w-full mb-6">
        <label class="flex justify-center w-full h-32 px-4 transition bg-white dark:bg-gray-800 border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
          <span class="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-6 h-6 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <span class="font-medium text-gray-600">
              Click here to select file
              {/* <span class="text-blue-600 underline">browse</span> */}
            </span>
          </span>
          <input
            type="file"
            name="file_upload"
            class="hidden"
            onChange={isActive === "ipfs" ? onChange : onChangeCoverImage}
            // onChange={onChange}
            // onChange={sendFileToIPFS}
          />
        </label>
      </div>
      {file && (
        <FileViewer
          fileType={getExtension()}
          filePath={file}
          // errorComponent={CustomErrorComponent}
          onError={onError}
        />
      )}

      {isloading ? (
        <Progress
          indeterminated
          value={50}
          color="secondary"
          status="secondary"
        />
      ) : (
        ""
      )}

      {file && (
        <button
          onClick={() => {
            onUploadFile();
          }}
          className="bg-blue-600 items-center space-x-4 flex rounded-full px-8 py-2 text-white item-center m-auto mt-4 mb-4"
        >
          Upload
        </button>
      )}
      {isfileuploading ? (
        <Progress
          indeterminated
          value={50}
          color="secondary"
          status="secondary"
        />
      ) : (
        ""
      )}
      {/* <FilePreview type={"file"} file={file} onError={onError} /> */}
      {/* {file && <img className="rounded mt-4" width="full" src={file} />} */}
      <PageTitle>Files in {foldername}</PageTitle>

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
                    {/* <p>
                      {String(
                        files?.fileType != "mp3" &&
                          files?.fileType != "mp4" &&
                          files?.fileType != "pdf"
                      )}
                    </p> */}
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
