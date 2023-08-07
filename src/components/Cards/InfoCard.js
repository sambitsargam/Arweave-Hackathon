import React from "react";
import { Card, CardBody } from "@windmill/react-ui";
function InfoCard({ title, value, children: icon, image }) {
  return (
    // <Card>
    //   <CardBody className="flex items-center">
    //     {icon}
    <div className="object-cover w-full ">
      <img src={image} className="rounded-tl-lg h-40 rounded-tr-lg w-full" />
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

export default InfoCard;
