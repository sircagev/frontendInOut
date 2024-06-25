import React from "react";
import { Card, CardBody, CardFooter, Image } from "@nextui-org/react";
import { Link } from 'react-router-dom';
import imagen from "../assets/categoria.svg"
import { ButtonGeneral } from "./Buttons/Button";


const CardsReserva = ({ title }) => {
  return (
    <Link  style={{ textDecoration: 'none' }}>
      <Card shadow="sm" isPressable className="w-72">
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
        <CardFooter className="text-small justify-between inline-block gap-2 bg-[#212121]">
          <b className="text-white">{title}</b>
          <ButtonGeneral
            label={"Reservar"}
          />
        </CardFooter>
      </Card>
    </Link>
  );
};

export default CardsReserva;