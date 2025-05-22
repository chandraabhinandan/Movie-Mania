import './search.css';
import React, { useState } from 'react';



function Search() {  

  const [movies, setMovies]   = useState([]);
  const [genre,  setGenre]    = useState("");
  const [lang,   setLang]     = useState("");
  const [loading, setLoading] = useState(false);
  const [clicked, setClicked] = useState(false);

  const handleSubmit = async e => {
  e.preventDefault();
  setClicked(true);
  setLoading(true);
  setMovies([]);

  try {
    const res  = await fetch("http://localhost:5000/api/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ genre, lang }),
    });
    const data = await res.json();

    if (res.ok && data.suggestion) {
      // ——————————  INSERT START ——————————
      // raw AI response with ```json fences
      let raw = data.suggestion;

      // locate the JSON array inside
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
      // ——————————  INSERT END ——————————
    } else {
      setMovies([]); 
    }
  } catch (err) {
    console.error("Fetch/parse error:", err);
    setMovies([]);
  }

  setLoading(false);
  setGenre("");
  setLang("");
};


  return (
    <div className="search">
      <div className="container">
        <header className="d-flex justify-content-center py-3 mb-4 border-bottom">
            <a href="/">
            <button type="button" className="btn btn-outline-primary">Home</button>
            </a>
        </header>
      </div>
      <div className='dropdown'>
        <div className='card'>
          <form onSubmit={handleSubmit}>
            <label htmlFor="drop">What's your mood?</label>
            <select name="drop" id="drop" value={genre} onChange={e => setGenre(e.target.value)} required>
              <option value="" disabled selected hidden>Select a genre</option>
              <option value="romantic">Romantic</option>
              <option value="comedy">Comedy</option>
              <option value="drama">Drama</option>       
              <option value="action">Action</option>
              <option value="thriller">Thriller</option>
              <option value="horror">Horror</option>   
              <option value="historic">Historical</option>
              <option value="sci-fi">Sci-Fi</option>
            </select>
            <input type="text" placeholder='Language' value={lang} onChange={e => setLang(e.target.value)} required/>
            <input type="submit" value="Search"></input>
          </form>
        </div>
      </div>
      {clicked && loading && <p className='temp'>Loading...</p>}
      {!loading && clicked && movies.length === 0 && <p className='temp'>No results found.</p>}
      {!loading && movies.length > 0 && (
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
};



export default Search;
