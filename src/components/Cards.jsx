import React from "react";
import { Card, CardBody, CardFooter, Image } from "@nextui-org/react";
import { Link } from 'react-router-dom';
import imagen from "../assets/categoria.svg"

const Cards = ({ title, imagen, to }) => {
  return (
    <Link to={to} style={{ textDecoration: 'none' }}>
      <Card shadow="sm" isPressable>
        <CardBody className="overflow-visible p-0">
          <img
            shadow="sm"
            radius="lg"
            width="100%"
            alt={title}
            className="w-full object-cover h-[140px]"
            src={imagen}
          />
        </CardBody>
        <CardFooter className="text-small justify-between bg-[#212121]">
          <b className="text-white">{title}</b>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default Cards;
