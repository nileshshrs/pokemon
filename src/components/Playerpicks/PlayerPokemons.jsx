import React from 'react'
import "./PlayerPokemons.scss"
import { AiOutlineClose } from "react-icons/ai";

const PlayerPokemons = ({ handleSlide, slide }) => {
  return (
    <div className={slide ? "vciXo" : "vciXo slide"}>
      <div className='flex items-center justify-between'>
        <h2 className='font-bold'>Your Pokemon Party: [0/6]</h2>
        <button onClick={() => handleSlide()}><AiOutlineClose className='font-bold text-xl'/></button>
      </div>
    </div>
  )
}

export default PlayerPokemons