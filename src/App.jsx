import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const apiKey = import.meta.env.VITE_KEY;
  const language = "fr-FR";

  // Liste des titres des films
  const movieTitles = [
    "Deadpool",
    "Death at a Funeral",
    "Flow",
    "Fury",
    "Hot Fuzz",
    "La Part des Anges",
    "OSS 117 : Le Caire, nid d'espions",
    "OSS 117 : Rio ne répond plus",
    "Tais-toi !",
    "Tetris",
    "U Turn",
  ];

  // État pour stocker les données des films
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      const fetchedMovies = [];

      for (const title of movieTitles) {
        try {
          // Rechercher le film pour obtenir son ID
          const searchResponse = await fetch(
            `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(
              title
            )}&language=${language}`
          );
          const searchData = await searchResponse.json();
          const movie = searchData.results[0]; // Prendre le premier résultat

          if (movie) {
            // Récupérer les acteurs via l'ID du film
            const creditsResponse = await fetch(
              `https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${apiKey}&language=${language}`
            );
            const creditsData = await creditsResponse.json();

            const topActors = creditsData.cast
              .slice(0, 5) // Limiter aux 5 acteurs principaux
              .map((actor) => ({
                name: actor.name,
                role: actor.character || "Rôle inconnu", // Inclure le rôle
                photo: actor.profile_path
                  ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                  : "https://via.placeholder.com/100x100?text=No+Photo",
              }));

            // Ajouter les détails du film
            fetchedMovies.push({
              title: movie.title,
              description: movie.overview,
              releaseYear: movie.release_date?.split("-")[0],
              poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
              actors: topActors,
            });
          } else {
            console.error(`Film "${title}" non trouvé.`);
          }
        } catch (error) {
          console.error(
            `Erreur lors de la récupération du film "${title}":`,
            error
          );
        }
      }

      setMovies(fetchedMovies);
    };

    fetchMovies();
  }, []);

  return (
    <div className="min-h-screen bg-red-50">
      {/* En-tête style Noël */}
      <header className="bg-red-600 text-white py-6 mb-8 shadow-lg">
        <h1 className="text-5xl font-extrabold text-center tracking-wide">
          Ma Sélection de Films pour Noël
        </h1>
      </header>

      {/* Section de cartes */}
      <main className="container mx-auto px-6 space-y-12">
        {movies.map((movie) => (
          <div
            key={movie.title}
            className="
              flex flex-col md:flex-row bg-white shadow-lg 
              rounded-lg overflow-hidden 
              transition-transform transform hover:scale-105 hover:shadow-2xl
            "
          >
            {/* Image à gauche */}
            <div className="md:w-1/3 p-4 flex-shrink-0">
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full h-auto object-cover rounded-md border-4 border-red-100"
              />
            </div>

            {/* Contenu à droite */}
            <div className="p-8 md:w-2/3 flex flex-col justify-between">
              <div>
                <h2 className="text-4xl font-bold text-red-700 mb-6">
                  {movie.title}
                </h2>
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  {movie.description || "Description non disponible."}
                </p>
                <p className="text-lg text-green-700 mb-4">
                  <span className="font-semibold">Année :</span>{" "}
                  {movie.releaseYear || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-green-700 mb-6">
                  Acteurs Principaux :
                </p>
                <div className="flex flex-wrap items-center gap-6">
                  {movie.actors.length > 0 ? (
                    movie.actors.map((actor) => (
                      <div
                        key={actor.name}
                        className="flex flex-col items-center w-28"
                      >
                        <img
                          src={actor.photo}
                          alt={actor.name}
                          className="w-20 h-20 object-cover rounded-full mb-2 border-2 border-green-700"
                        />
                        <p className="text-center text-sm text-gray-800 font-semibold">
                          {actor.name}
                        </p>
                        <p className="text-center text-xs text-gray-600">
                          {actor.role}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">Non disponible</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </main>

      {/* Pied de page festif */}
      <footer className="bg-green-700 text-white py-6 mt-12">
        <p className="text-center text-lg">
          Joyeuses Fêtes 2024 Papi et Mamie !
        </p>
      </footer>
    </div>
  );
}

export default App;
