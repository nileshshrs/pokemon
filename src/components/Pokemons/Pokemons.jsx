
import "./pokemons.scss"
import { usePokemonContext } from "../../context/PokemonContext";



const Pokemons = () => {

    const { pokemonQuery } = usePokemonContext();


    const { data: pokemons, isLoading } = pokemonQuery;

    return (
        <>
            {
                isLoading ? <>Loading Pokemons</> : (
                    <div className="px-5 py-2">
                        <div className="pokemon-list">
                            {pokemons.map((pokemon) => (
                                <div key={pokemon.name} className="pokemon-card font-sans">
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
                                    <button className="w-[90%] capitalize rounded-sm font-bold text-sm py-[4px]" onClick={() => console.log(pokemon)}>
                                        choose {pokemon.name}
                                    </button>
                                </div>

                            ))}
                        </div>
                    </div>

                )
            }
        </>
    )
}

export default Pokemons;