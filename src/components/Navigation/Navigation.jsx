import React, { useState } from 'react'
import logo from "../../assets/Pokémon.jpeg"
import { usePokemonContext } from '../../context/PokemonContext'
import { CgPokemon } from "react-icons/cg";
import PlayerPokemons from '../Playerpicks/PlayerPokemons';

const Navigation = () => {
    const { playerPokemon } = usePokemonContext()

    const [slide, setSlide] = useState(false)

    const handleSlide = () => {
        setSlide(!slide)
    }
    return (
        <nav className='flex items-center justify-between mx-12 py-2 px-3'>
            <div>
                <img src={logo} alt="" className='h-[40px] w-[160px]' />

            </div>
            <div><button onClick={handleSlide} className='font-bold inline-flex items-center gap-3 cursor-pointer bg-black text-white py-1 px-3 rounded-sm'><CgPokemon className='text-xl' /> Your Pokemons Party: {playerPokemon.length}/6</button></div>
            <PlayerPokemons handleSlide={handleSlide} slide={slide} />
        </nav>
    )
}

export default Navigation