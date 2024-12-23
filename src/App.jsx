import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const apiKey = import.meta.env.VITE_KEY;
  const language = "fr-FR";

  // Liste des titres des films
  const movieTitles = [
    "Deadpool",
    "Joyeuse Funérailles",
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
          // 1) Rechercher le film pour obtenir son ID
          const searchResponse = await fetch(
            `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(
              title
            )}&language=${language}`
          );
          const searchData = await searchResponse.json();
          const movie = searchData.results[0]; // On prend le premier résultat

          if (movie) {
            // 2) Récupérer des détails supplémentaires (vote_average, tagline, etc.)
            const detailResponse = await fetch(
              `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${apiKey}&language=${language}`
            );
            const detailData = await detailResponse.json();

            // 3) Récupérer les acteurs via l'ID du film
            const creditsResponse = await fetch(
              `https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${apiKey}&language=${language}`
            );
            const creditsData = await creditsResponse.json();

            const topActors = creditsData.cast
              .slice(0, 4) // Limiter aux 4 acteurs principaux
              .map((actor) => ({
                name: actor.name,
                role: actor.character || "Rôle inconnu",
                photo: actor.profile_path
                  ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                  : "https://via.placeholder.com/100x100?text=No+Photo",
              }));

            // Ajouter les détails du film
            fetchedMovies.push({
              title: detailData.title,
              tagline: detailData.tagline, // tagline du film
              description: detailData.overview,
              releaseYear: detailData.release_date?.split("-")[0],
              poster: detailData.poster_path
                ? `https://image.tmdb.org/t/p/w500${detailData.poster_path}`
                : "https://via.placeholder.com/500x750?text=No+Poster",
              voteAverage: detailData.vote_average,
              voteCount: detailData.vote_count,
              runtime: detailData.runtime,
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
    <div className="min-h-screen bg-red-50 flex flex-col">
      {/* En-tête style Noël */}
      <header className="bg-red-600 text-white py-6 mb-8 shadow-lg">
        <h1 className="text-5xl font-extrabold text-center tracking-wide">
          Ma Sélection de Films pour Noël
        </h1>
      </header>

      {/* Section de cartes */}
      <main className="container mx-auto px-6 flex-1 space-y-8">
        {movies.map((movie) => (
          <div
            key={movie.title}
            className="
              flex flex-col md:flex-row bg-white shadow-lg
              rounded-lg overflow-hidden font-semibold
              transition-transform transform hover:scale-105 hover:shadow-2xl
            "
          >
            {/* Image à gauche avec marge */}
            <div className="md:w-1/3 p-4 flex-shrink-0">
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full h-auto object-cover rounded-md border-4 border-red-100"
              />
            </div>

            {/* Contenu à droite */}
            <div className="p-6 md:w-2/3 flex flex-col justify-between space-y-6">
              {/* Titre et Tagline */}
              <div>
                <h2 className="text-3xl text-red-700 mb-2">{movie.title}</h2>
                {movie.tagline && (
                  <p className="italic text-sm text-green-800 mb-4">
                    « {movie.tagline} »
                  </p>
                )}
                {/* Description */}
                <p className="text-gray-800 text-sm mb-4">
                  {movie.description || "Description non disponible."}
                </p>
              </div>

              {/* Informations supplémentaires */}
              <div className="space-y-2">
                <p className="text-green-700">
                  <span className="text-gray-800">Année :</span>{" "}
                  {movie.releaseYear || "N/A"}
                </p>
                {movie.runtime && (
                  <p className="text-green-700">
                    <span className="text-gray-800">Durée :</span>{" "}
                    {movie.runtime} min
                  </p>
                )}
                {movie.voteAverage && (
                  <p className="text-green-700">
                    <span className="text-gray-800">Note moyenne :</span>{" "}
                    {movie.voteAverage.toFixed(1)} / 10
                    {movie.voteCount ? ` (${movie.voteCount} votes)` : ""}
                  </p>
                )}
              </div>

              {/* Acteurs principaux */}
              <div>
                <p className="text-xl text-green-700 mb-2">
                  Acteurs Principaux :
                </p>
                <div className="flex flex-wrap gap-4">
                  {movie.actors.length > 0 ? (
                    movie.actors.map((actor) => (
                      <div
                        key={actor.name}
                        className="flex flex-col items-center w-24"
                      >
                        <img
                          src={actor.photo}
                          alt={actor.name}
                          className="w-24 h-32 object-cover rounded-md border-2 border-green-700"
                        />
                        <p className="text-center text-sm text-gray-800 mt-1">
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
      <footer className="bg-green-700 text-white py-6 mt-8">
        <p className="text-center text-lg">
          Joyeuses Fêtes 2024 Papi et Mamie !
        </p>
      </footer>
    </div>
  );
}

export default App;
