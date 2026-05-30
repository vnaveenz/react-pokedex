import { useState, useEffect } from 'react';
import PokemonCard from './components/PokemonCard';
import './App.css';

/**
 * App - The root component of our Pokedex.
 *
 * KEY REACT CONCEPTS demonstrated here:
 *   1. useState   - managing state (pokemon list, search, loading, error)
 *   2. useEffect  - side effects (fetching data when the component mounts)
 *   3. Conditional rendering - showing loader, error, or content
 *   4. Controlled input - search bar value tied to state
 *   5. Array methods - .filter() and .map() for transforming data
 */

const POKEMON_COUNT = 4700; // how many Pokemon to load
const API_BASE = 'https://pokeapi.co/api/v2';

function App() {
  // ---------- State ----------
  const [pokemon, setPokemon] = useState([]);    // full list
  const [search, setSearch] = useState('');       // search query
  const [loading, setLoading] = useState(true);   // loading flag
  const [error, setError] = useState(null);       // error message

  // ---------- Fetch data on mount ----------
  useEffect(() => {
    fetchPokemon();
  }, []); // empty dependency array = run once on mount

  async function fetchPokemon() {
    setLoading(true);
    setError(null);

    try {
      // Step 1: Get a list of Pokemon names & URLs
      const listResponse = await fetch(
        `${API_BASE}/pokemon?limit=${POKEMON_COUNT}`
      );
      if (!listResponse.ok) throw new Error('Failed to fetch Pokemon list');
      const listData = await listResponse.json();

      // Step 2: Fetch detailed data for each Pokemon in parallel
      const detailPromises = listData.results.map((p) =>
        fetch(p.url).then((res) => {
          if (!res.ok) throw new Error(`Failed to fetch ${p.name}`);
          return res.json();
        })
      );
      const details = await Promise.all(detailPromises);

      setPokemon(details);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // ---------- Derived data ----------
  const filtered = pokemon.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // ---------- Render ----------
  return (
    <>
      <header className="header">
        <h1 className="title">Pokedex</h1>
        <p className="subtitle">
          A React app powered by the PokeAPI — fetching {POKEMON_COUNT} Pokemon
        </p>
      </header>

      <div className="searchBar">
        <input
          className="searchInput"
          type="text"
          placeholder="Search Pokemon by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading && (
        <div className="loader">
          <div className="spinner" />
          <p>Loading Pokemon...</p>
        </div>
      )}

      {error && (
        <div className="error">
          <p>Something went wrong: {error}</p>
          <button onClick={fetchPokemon}>Try Again</button>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="empty">
          No Pokemon found matching &quot;{search}&quot;
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="grid">
          {filtered.map((p) => (
            <PokemonCard key={p.id} pokemon={p} />
          ))}
        </div>
      )}
    </>
  );
}

export default App;
