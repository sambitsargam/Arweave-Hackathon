import React from "react";
import { Card, CardBody } from "@windmill/react-ui";
import {
  MusicalNoteIcon,
  GifIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  PlusIcon,
  ServerIcon,
  CalendarIcon,
  ShieldCheckIcon,
  UserIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
function FileCard({ title, value, type, children: icon, image }) {
  const fileFormatIcon = (type) => {
    if (type == "pdf") {
      return (
        <div className="rounded-tl-lg h-40  flex flex-col justify-center items-center bg-red-400 rounded-tr-lg w-full">
          <DocumentTextIcon className="h-16 text-white " />
        </div>
      );
    } else if (type == "mp3") {
      return (
        <div className="rounded-tl-lg h-40  flex flex-col justify-center items-center bg-green-400 rounded-tr-lg w-full">
          <MusicalNoteIcon className="h-16 text-white " />
        </div>
      );
    } else if (type == "mp4") {
      return (
        <div className="rounded-tl-lg h-40  flex flex-col justify-center items-center bg-yellow-400 rounded-tr-lg w-full">
          <VideoCameraIcon className="h-16 text-white" />
        </div>
      );
    } else {
      return <p>File format not supported</p>;
    }
  };
  return (
    // <Card>
    //   <CardBody className="flex items-center">
    //     {icon}
    <div className="object-cover w-full ">
      {fileFormatIcon(type)}
      <div className="flex flex-row items-center justify-between">
        <div>
          <h2 className="text-md dark:text-gray-100 font-bold mb-0 mt-1 text-gray-600">
            {title}
          </h2>
          <p className="text-gray-500 dark:text-gray-50 text-sm">{value}</p>
        </div>
      </div>
      {/* <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">{value}</p> */}
    </div>
    //   </CardBody>
    // </Card>
  );
}

export default FileCard;
