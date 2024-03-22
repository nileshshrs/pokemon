import React from 'react'
import { Link } from 'react-router-dom'
import "../App.scss"

const Home = () => {
    return (
        <div className='title-screen'>
            <h1>Welcome to Pokemon Battle Simulator!</h1>
            <h2>This is a "boss rush" style game where you will face off against a gauntlet
                of Pokemon from across the Kanto region!
            </h2>
            <h3>Make sure to take advantage of enemy type weaknesses to progress the game as efficiently as possible!</h3>
            <h3>**Be advised, music will begin to play once you hit start!**</h3>
            <Link to="/pokemons"><button className='start transition ease-linear' >START GAME</button></Link>
        </div>
    )
}

export default Home