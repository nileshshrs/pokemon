import axios from 'axios';
import { useEffect, useState } from 'react';
import './App.css';
import { lazy } from 'react';

function App() {
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
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          {pokemons.map(pokemon => (
            <div key={pokemon.name}>

              <img src={pokemon.sprites.front_default} alt="" loading='lazy' />
              <div>Name: {pokemon.name}</div>
              <div>Type: {pokemon.type.join(', ')}</div>
              <div>Moves:
                <ul>
                  {pokemon.moves.map((move, index) => (
                    <li key={index}>
                      {move.name} - Power: {move.power}, PP: {move.pp}, Accuracy: {move.accuracy}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default App;
