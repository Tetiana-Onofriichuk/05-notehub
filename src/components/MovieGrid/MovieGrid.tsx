import css from "./MovieGrid.module.css";
import type { Movie } from "../../types/movie";
import { getImageUrl } from "../../services/movieService";

interface MovieGridProps {
  movies: Movie[];
  onSelect: (movie: Movie) => void;
}

export default function MovieGrid({ movies, onSelect }: MovieGridProps) {
  console.log("Rendering MovieGrid", movies);
  if (movies.length === 0) return null;

  return (
    <ul className={css.grid}>
      {movies.map((movie) => {
        const imageUrl = getImageUrl(movie.poster_path);
        return (
          <li key={movie.id}>
            <div className={css.card} onClick={() => onSelect(movie)}>
              {imageUrl ? (
                <img
                  className={css.image}
                  src={imageUrl}
                  alt={movie.title}
                  loading="lazy"
                />
              ) : (
                <div className={css.noImage}>No image available</div>
              )}
              <h2 className={css.title}>{movie.title}</h2>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
