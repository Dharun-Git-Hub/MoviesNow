import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MovieCard = ({ movie }) => {
    const navigate = useNavigate()
  return (
    <div className="movie-card" onClick={()=>navigate('/movie',{state: movie})}>
      <div
        className="movie-image"
        style={{ backgroundImage: `url(${movie.poster_url})` }}
      ></div>
      <div className="movie-content">
        <h2>{movie.title}</h2>
        <p>{movie.description}</p>
      </div>
    </div>
  );
};

export default MovieCard;
