
import { Link, Route, Routes } from "react-router-dom";
import "./App.scss"
import Home from "./pages/Home";
import Pokemons from "./components/Pokemons"
import Test from "./Test";

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pokemons" element={<Pokemons />} />
        <Route path="/test" element={<Test />} />
      </Routes>
    </>
  );
}

export default App;
