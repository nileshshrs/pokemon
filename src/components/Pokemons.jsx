import axios from 'axios';
import { useEffect, useState } from 'react';
import "./pokemons.scss"


const Pokemons = () => {

    const [loading, setLoading] = useState(false);
    const [pokemons, setPokemons] = useState([]);

    const fetchPokemon = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=151`);
            const fetchedData = response.data.results;
            setLoading(false);

            const urls = fetchedData.map(data => data.url);

            setLoading(true);
            const data = await Promise.all(urls.map(url => axios.get(url)));

            const pokemonData = data.map(data => data.data);

            const formattedPokemonData = await Promise.all(pokemonData.map(async (data) => ({
                name: data.name,
                sprites: data.sprites,
                type: data.types.map(type => type.type.name),
                moves: await getRandomMoves(data.moves),
            })));

            setLoading(false);

            setPokemons(formattedPokemonData);
        } catch (err) {
            console.log(err);
        }
    };

    console.log(pokemons[0])

    const getRandomMoves = async (movesData, selectedMoves = []) => {
        while (selectedMoves.length < 4 && movesData.length > 0) {
            const randomIndex = Math.floor(Math.random() * movesData.length);
            const moveName = movesData[randomIndex]?.move?.name;

            if (moveName) {
                const moveDetails = await getMoveDetails(moveName);

                if (moveDetails && moveDetails.damage_class.name !== 'status' && !selectedMoves.some(move => move.name === moveName)) {
                    selectedMoves.push({
                        name: moveName,
                        accuracy: moveDetails.accuracy,
                        pp: moveDetails.pp,
                        power: moveDetails.power,
                        attribute: moveDetails.damage_class.name,
                        effect: moveDetails.effect_entries,
                        damage_type: moveDetails.type.name
                    });
                }
            }

            movesData.splice(randomIndex, 1);
        }

        return selectedMoves;
    };

    const getMoveDetails = async (moveName) => {
        try {
            const response = await axios.get(`https://pokeapi.co/api/v2/move/${moveName}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching move details for ${moveName}:`, error);
            return null;
        }
    };



    useEffect(() => {
        fetchPokemon();
    }, []);

    return (
        <>

            <div className="px-5 py-2">
                <div className="pokemon-list">
                    {pokemons.map((pokemon, index) => (
                        <div key={index} className="pokemon-card font-sans">
                            <div className="flex items-center justify-around w-full">
                                <div className="pokemon">
                                    <img
                                        src={pokemon.sprites.front_default}
                                        width={100}
                                        height={100}
                                        alt="Picture of the pokemon"
                                        quality={80}
                                        loading="lazy"
                                    />

                                    <div className="">
                                        <div className="uppercase font-bold text-md">{pokemon.name}</div>
                                    </div>
                                </div>
                                <div className="detail">
                                    <div className="uppercase font-bold text-sm">Type: {pokemon.type.join(', ')}</div>
                                    <div className="moves">
                                        <h3 className="font-bold text-sm">MOVES/ABILITIES</h3>
                                        <ul className="w-full font-semibold text-sm">
                                            {pokemon.moves.map((move, index) => (
                                                <li key={index} className="flex w-full justify-between gap-5 items-center">
                                                    <span> {move.name}</span>  <span className="font-normal">PP: {move.pp < 10 ? `0${move.pp}` : move.pp}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <button className="w-[90%] capitalize rounded-sm font-bold text-sm py-[4px]">
                                choose {pokemon.name}
                            </button>
                        </div>

                    ))}
                </div>
            </div>

        </>
    )
}

export default Pokemons;