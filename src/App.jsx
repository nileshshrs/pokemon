
import { Link, Route, Routes, useLocation } from "react-router-dom";
import "./App.scss"
import Home from "./pages/Home";
import Pokemons from "./components/Pokemons/Pokemons"
import Navigation from "./components/Navigation/Navigation";


function App() {
  const location = useLocation();
  return (
    <>
      {location.pathname !== "/" && <Navigation />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pokemons" element={<Pokemons />} />
      </Routes>
    </>
  );
}

export default App;
