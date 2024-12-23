import React from "react";
import { movies } from "./data.js";
import "./App.css";

function App() {
  return (
    <div style={{ fontFamily: "sans-serif", padding: "1rem" }}>
      <h1>Liste de Films</h1>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {movies.map((movie) => (
          <li key={movie.title} style={{ marginBottom: "1rem" }}>
            <h2>{movie.title}</h2>
            <img
              src={movie.image}
              alt={movie.title}
              style={{ maxWidth: "200px", display: "block" }}
            />
            <p>{movie.description}</p>
            <p>
              <strong>Langues:</strong> {movie.languages.join(", ")}
            </p>
            <p>
              <strong>Acteurs:</strong> {movie.actors.join(", ")}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
