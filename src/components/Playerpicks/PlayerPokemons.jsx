import React from 'react'
import "./PlayerPokemons.scss"
import { AiOutlineClose } from "react-icons/ai";
import { usePokemonContext } from '../../context/PokemonContext';

const PlayerPokemons = ({ handleSlide, slide }) => {

  const { playerPokemon, removePokemon } = usePokemonContext();
  const pokemons = playerPokemon;

  return (
    <div className={slide ? "vciXo overflow-y-auto" : "vciXo slide overflow-y-auto"}>
      <div className='flex items-center justify-between'>
        <h2 className='font-bold'>Your Pokemon Party: [{pokemons.length}/6]</h2>
        <button onClick={() => handleSlide()}><AiOutlineClose className='font-bold text-xl' /></button>
      </div>
      <div className='py-5 grid gap-3 '>
        {
          pokemons.length === 0 ? (
            <div className='grid gap-5 w-full'>
              <h2 className='w-full text-center font-bold text-lg'>
                Your party has no pokemons in it.
              </h2>
              <p className='w-full text-center font-semibold text-sm'>
                please choose from 151 available pokemons
              </p>
            </div>
          ) : (
            pokemons.map(pokemon => {
              return (
                <div className='flex-col flex justify-center px-3 py-2 shadow border'>
                  <div className='flex gap-5 items-center justify-around'>
                    <div className='w-full flex items-center justify-center'>
                      <img src={pokemon.sprites.front_default} alt="" className='h-[70px]' />
                    </div>
                    <div className='flex-col gap-3 w-full items-center justify-center'>
                      <div className='font-bold capitalize text-md'>{pokemon.name}</div>
                      <div className='capitalize text-sm font-semibold w-full'>Type: {pokemon.type.join(",")}</div>
                      <div className='capitalize text-sm font-semibold w-full'>Moves: {pokemon.moves.length}/4</div>
                    </div>
                  </div>
                  <button onClick={() => removePokemon(pokemon)} className='w-full bg-black text-white font-bold text-sm py-1 rounded-sm'>
                    Remove from Party
                  </button>
                </div>
              )
            })
          )
        }
      </div>
      <button className='border border-black w-full bg-black text-white font-bold py-1 hover:text-black hover:bg-white transition ease-linear'>
        Start Game
      </button>
    </div>
  )
}

export default PlayerPokemons