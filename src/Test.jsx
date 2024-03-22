import { useQuery } from '@tanstack/react-query'
import axios from 'axios';
import React from 'react'

const Test = () => {

    const pokemonQuery = useQuery({
        queryKey: ['pokemon'],
        queryFn: async () => {
            try {
                const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=151`);
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
        }
    })

    const getRandomMoves = async (movesData, selectedMoves = []) => {
        console.log(movesData)
        while (selectedMoves.length < 4 && movesData.length > 0) {
            const randomIndex = Math.floor(Math.random() * movesData.length);
            const moveName = movesData[randomIndex]?.move?.name;
            console.log(moveName)

            if (moveName) {
                const moveDetails = await getMoveDetails(moveName);

                // if (moveDetails && moveDetails.damage_class.name !== 'status' && !selectedMoves.some(move => move.name === moveName)) {
                //     selectedMoves.push({
                //         name: moveName,
                //         accuracy: moveDetails.accuracy,
                //         pp: moveDetails.pp,
                //         power: moveDetails.power,
                //         attribute: moveDetails.damage_class.name,
                //         effect: moveDetails.effect_entries,
                //         damage_type: moveDetails.type.name
                //     });
                // }
            }

            // movesData.splice(randomIndex, 1);
        }

        // return selectedMoves;
    };

    const getMoveDetails = async (moveName) => {

        return movesQuery.fetchQuery(moveName)
    }

    const movesQuery = useQuery({
        queryKey: ["moveName", getMoveDetails],
        queryFn: async (moveName) => {
            console.log(moveNave)
            // try {
            //     const response = await axios.get(`https://pokeapi.co/api/v2/move/${moveName}`);
            //     return response.data;
            // } catch (error) {
            //     console.error(`Error fetching move details for ${moveName}:`, error);
            //     return null;
            // }
        }
    })



    const { data: pokemon, isLoading, isError } = pokemonQuery;

    console.log(pokemon)
    return (
        <div>Test</div>
    )
}

export default Test