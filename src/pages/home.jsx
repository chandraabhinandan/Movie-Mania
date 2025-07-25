// src/Home.jsx
import "./home.css";
import React, { useState, useEffect } from 'react';


function Home() {

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [didFetch, setDidFetch]= useState(false);
   useEffect(() => {
      async function fetchData(){
        setLoading(true);
        setMovies([]);
        try{
          const res = await fetch("http://localhost:5000/api/home", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });
          const data = await res.json();
          if (res.ok && data.suggestion) {
          let raw = data.suggestion;

          const start = raw.indexOf("[");
          const end   = raw.lastIndexOf("]") + 1;

          if (start === -1 || end === 0) {
              console.error("Cannot find JSON array in suggestion:", raw);
              setMovies([]);
          } else {
            const jsonStr = raw.slice(start, end);
            try {
              const arr = JSON.parse(jsonStr);
              setMovies(arr);
            } catch (err) {
              console.error("Failed to parse JSON:", err, jsonStr);
              setMovies([]);
            }
          }
          } else {
            setMovies([]); 
          }
        }
        catch (err) {
          console.error("Fetch/parse error:", err);
          setMovies([]);
        }
          setLoading(false);
          setDidFetch(true); 
        }
        fetchData();        
   }, []);


  return (
    <div className="home">
      <div className="container">
        <header className="d-flex justify-content-center py-3 mb-4 border-bottom">
          <a href="/search">
            <button type="button" className="btn btn-outline-primary">
              Search Movies
            </button>
          </a>
        </header>
      </div>
      <div className="newRelease">
        <h1>New Releases</h1>
      </div>
      {loading && <p className="temp">Loading...</p>}
      {!loading && movies.length === 0 && <p className="temp">No results found.</p>}
      {!loading && didFetch && movies.length === 0 && (
        <p className="temp">No results found.</p>
      )}

      {!loading && didFetch && movies.length > 0 && (
        <div className="results-grid">
          {movies.map((m, i) => (
            <div key={i} className="movie-card" style={{ animationDelay: `${i * 100}ms` }}>
              <h3>{m.title} <small>({m.year})</small></h3>
              <p className="desc">{m.description}</p>
              <p className="rating">IMDb: {m.imdb_rating ?? m.rating}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


export default Home;
