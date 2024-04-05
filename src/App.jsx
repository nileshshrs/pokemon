
import { Link, Route, Routes } from "react-router-dom";
import "./App.scss"
import Home from "./pages/Home";
import Pokemons from "./components/Pokemons/Pokemons"


function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pokemons" element={<Pokemons />} />
      </Routes>
    </>
  );
}

export default App;
