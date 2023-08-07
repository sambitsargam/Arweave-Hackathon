import React from "react";
import { Card, CardBody } from "@windmill/react-ui";
import { FolderIcon } from "@heroicons/react/24/solid";
function InfoCard({ title, value, children: icon, image }) {
  return (
    <Card>
      <CardBody className="flex items-start flex-col">
        {icon}
        <FolderIcon className="h-16 text-blue-500" />
        <p className="pl-1 mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
          {title}
        </p>
      </CardBody>
    </Card>
  );
}

export default InfoCard;
