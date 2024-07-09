import React, { useState, useEffect } from 'react';
import CardsReserva from '../components/CardsReserva';


const Home = () => {

  const list = [
    {
      title: "Ubicaciones",
    },
  ];

  return (
    <div className="flex flex-col">
      <h1 className="mt-8 text-xl text-center font-semibold">Elementos</h1>
      <div className='w-[95%] h-screen ml-[2.5%] mr-[2.5%]'>
        {list.map((item, index) => (
          <CardsReserva
            key={index}
            title={item.title}
          />
        ))}
      </div>
    </div>
  );
}

export default Home;
