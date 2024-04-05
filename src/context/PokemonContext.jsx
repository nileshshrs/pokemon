import { createContext, useContext } from "react";
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const PokemonContext = createContext();

export const PokemonProvider = ({ children }) => {

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
                    type: data.types?.map(type => type.type.name),
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
        const result = [];
        let currentIndex = 0;

        for (const element of array) {
            const randomIndex = Math.floor(Math.random() * (currentIndex + 1));
            if (randomIndex !== currentIndex) {
                result[currentIndex] = result[randomIndex];
            }
            result[randomIndex] = element;
            currentIndex++;
        }

        return result;
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


    return <PokemonContext.Provider value={{pokemonQuery}}>
        {children}
    </PokemonContext.Provider>
}

export const usePokemonContext = () => {
    return useContext(PokemonContext);
}