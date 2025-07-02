import { useNavigate } from "react-router-dom";

const TheatreCard = ({ theatre }) => {
  const navigate = useNavigate()
  return (
    <div className="movie-card" onClick={()=>navigate('/theatre',{state: theatre})}>
      <div
        className="movie-image"
        style={{ backgroundImage: `url(${theatre.poster_url})` }}
      ></div>
      <div className="movie-content">
        <h2>{theatre.name}</h2>
        <p>{theatre.location.state}</p>
        <p>{theatre.address}</p>
        <p>{theatre.location.city}</p>
      </div>
    </div>
  );
};

export default TheatreCard;
