import React, { useEffect, useState, useMemo, memo, useCallback } from "react";
import { Pokemon, getAll, getByName } from "./API";

import "./styles.css";

interface PokemonWithPower extends Pokemon {
  power: number;
}

const calculatePower = (pokemon: Pokemon) =>
  pokemon.hp +
  pokemon.attack +
  pokemon.defense +
  pokemon.special_attack +
  pokemon.special_defense +
  pokemon.speed;

let tableRender = 0
const PokemonTable: React.FunctionComponent<{
  pokemon: PokemonWithPower[];
}> = ({ pokemon }) => {
  console.log(`Table Render: ${tableRender++}`)
  return (
    <table>
      <thead>
        <tr>
          <td>ID</td>
          <td>Name</td>
          <td>Type</td>
          <td colSpan={6}>Stats</td>
          <td>Power</td>
        </tr>
      </thead>
      <tbody>
        {pokemon.map((p) => (
          <tr key={p.id}>
            <td>{p.id}</td>
            <td>{p.name}</td>
            <td>{p.type.join(",")}</td>
            <td>{p.hp}</td>
            <td>{p.attack}</td>
            <td>{p.defense}</td>
            <td>{p.special_attack}</td>
            <td>{p.special_defense}</td>
            <td>{p.speed}</td>
            <td>{p.power}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const MemoPokemonTable = memo(PokemonTable)

let appRender = 0
export default function App() {
  console.log(`App Render: ${appRender++}`)
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [search, setSearch] = useState('');
  const onSetSearch = useCallback((env) =>
    setSearch(env.target.value),
    []
  );

  useEffect(() => {
    getByName(search).then(setPokemon)
  }, [search]);

  const pokemonWithPower = useMemo(() => pokemon.map((p) => ({
    ...p,
    power: calculatePower(p)
  })), [pokemon]);

  const [threshold, setThreshold] = useState(0)
  const onSetThreshold = useCallback((env) =>
    setThreshold(parseInt(env.target.value, 10)),
    []
  );

  const countOverThreshold = useMemo(() =>
    pokemonWithPower.filter(p => p.power > threshold).length,
    [pokemonWithPower, threshold]
  );

  const min = useMemo(() => Math.min(...pokemonWithPower.map(p => p.power)), [pokemonWithPower])
  const max = useMemo(() => Math.max(...pokemonWithPower.map(p => p.power)), [pokemonWithPower])

  return (
    <div>
      <div className="top-bar">
        <div>Search</div>
        <input type="text" onChange={onSetSearch} value={search}></input>
        <div>Power threshold</div>
        <input type="text" value={threshold} onChange={onSetThreshold}></input>
        <div>Count over threshold: {countOverThreshold}</div>
      </div>
      <div className="two-column">
        <MemoPokemonTable pokemon={pokemonWithPower} />
        <div>
          <div>Min: {min}</div>
          <div>Max: {max}</div>
        </div>
      </div>
    </div>
  );
}
