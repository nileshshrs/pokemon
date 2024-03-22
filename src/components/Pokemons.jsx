import axios from 'axios';
import "./pokemons.scss"
import { useQuery } from '@tanstack/react-query';


const Pokemons = () => {

    const pokemonQuery = useQuery({
        queryKey: ['pokemon'],
        queryFn: async () => {
            try {
                const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?offset=0&limit=151`);
                const fetchedData = response.data.results;


                const urls = fetchedData.map(data => data.url);


                const data = await Promise.all(urls.map(url => axios.get(url)));

                const pokemonData = data.map(data => data.data);


                const pokemon = await Promise.all(pokemonData.map(async (data) => ({
                    name: data.name,
                    sprites: data.sprites,
                    type: data.types.map(type => type.type.name),
                    moves: await getRandomMoves(data.moves),
                })));


                return pokemon;

            } catch (err) {
                console.log(err)
            }
        },
        staleTime: Infinity
    })


    const getRandomMoves = async (movesData) => {
        // Shuffle the movesData array
        // console.log(movesData[0])
        movesData = shuffleArray(movesData);
        // console.log("after shuffle")
        // console.log(movesData[0])
        // console.log("finished shuffle")

        const selectedMoves = [];
        const selectedMoveNames = new Set();

        const getRandomMoveDetails = async (moveIndex) => {
            const move = movesData[moveIndex];
            const moveName = move?.move?.name;

            if (moveName && !selectedMoveNames.has(moveName)) {
                try {
                    const moveDetails = await getMoveDetails(moveName);
                    if (moveDetails && moveDetails.damage_class.name !== 'status') {
                        selectedMoves.push({
                            name: move.move.name,
                            accuracy: moveDetails.accuracy,
                            pp: moveDetails.pp,
                            power: moveDetails.power,
                            attribute: moveDetails.damage_class.name,
                            effect: moveDetails.effect_entries,
                            damage_type: moveDetails.type.name
                        });
                        selectedMoveNames.add(moveName);
                    }
                } catch (error) {
                    console.error(`Error fetching move details for ${moveName}:`, error);
                }
            }
        };

        let movesLeft = movesData.length;

        while (selectedMoves.length < 4 && movesLeft > 0) {
            const numMovesToFetch = Math.min(4 - selectedMoves.length, movesLeft);
            const requests = [];

            for (let i = 0; i < numMovesToFetch; i++) {
                requests.push(getRandomMoveDetails(movesData.length - movesLeft + i));
            }

            await Promise.all(requests);

            movesLeft -= numMovesToFetch;
        }

        return selectedMoves;
    };

    // Function to shuffle an array
    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };


    const getMoveDetails = async (moveName) => {
        try {
            const response = await axios.get(`https://pokeapi.co/api/v2/move/${moveName}`);
            const moveData = response.data;

            if (moveData.generation && moveData.generation.name === 'generation-i') {
                return moveData;
            }

            return
        } catch (error) {
            console.error(`Error fetching move details for ${moveName}:`, error);
            return
        }
    };




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