import React from "react";
import { Card, CardBody, CardFooter, Image } from "@nextui-org/react";
import { Link } from 'react-router-dom';

const Cards = ({ title, img, to }) => {
  return (
    <Link to={to} style={{ textDecoration: 'none' }}>
      <Card shadow="sm" isPressable>
        <CardBody className="overflow-visible p-0">
          <Image
            shadow="sm"
            radius="lg"
            width="100%"
            alt={title}
            className="w-full object-cover h-[140px]"
            src={img}
          />
        </CardBody>
        <CardFooter className="text-small justify-between">
          <b>{title}</b>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default Cards;
