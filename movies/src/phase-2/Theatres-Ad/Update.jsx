import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { loadTheatres } from "../../Slices/TheatreSlice";
import { useNavigate } from "react-router-dom";
import { loadMovies } from "../../Slices/MoviesSlice";

const UpdateTheatre = ({ name: targetName, setTheatres })=>{
  const [theatre, setTheatre] = useState(null);
  const [movies,setMovies] = useState([])
  const [screens, setScreens] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(()=>{
    const fetchMovies = async () => {
      const response = await dispatch(loadMovies()).unwrap()
      console.log(response)
      const listOfMovies = []
      response.list.map((el)=>{
        listOfMovies.push(el.title)
      })
      setMovies(listOfMovies)
    }
    fetchMovies()
  },[])

  useEffect(()=>{
    const fetchTheatre = async ()=>{
      const res = await dispatch(loadTheatres()).unwrap();
      const matched = res.list.find(t => t.name === targetName);
      if (matched) {
        setTheatre({
          _id: matched._id,
          name: matched.name,
          address: matched.location.address,
          city: matched.location.city,
          state: matched.location.state,
          max: matched.max || matched.screens.length
        });
        setScreens(structuredClone(
          matched.screens.map((screen) => ({
            ...screen,
            currently_showing: {
              movie_name: screen.currently_showing?.movie_name || "",
              price: screen.currently_showing?.price || "",
              showtimes: screen.currently_showing?.showtimes?.length
                ? screen.currently_showing.showtimes.map(formatForDatetimeLocal)
                : [""],
            },
          }))
        ))
      }
      setLoading(false);
    };
    fetchTheatre();
  }, [dispatch, targetName]);

  const updateScreen = (index, field, value)=>{
    const updated = [...screens];
    if (field === "movie_name" || field === "price") {
      updated[index].currently_showing[field] = value;
    } else {
      updated[index][field] = value;
    }
    setScreens(updated);
  };

  const updateShowtime = (screenIndex, showtimeIndex, value)=>{
    const updated = [...screens];
    updated[screenIndex].currently_showing.showtimes[showtimeIndex] = value;
    setScreens(updated);
  };

  const addShowtime = (screenIndex)=>{
    const updated = [...screens];
    updated[screenIndex].currently_showing.showtimes.push("")
    setScreens(updated)
  };

  const removeShowTime = (screenIndex)=>{
    const updated = [...screens];
    updated[screenIndex].currently_showing.showtimes.pop("")
    setScreens(updated)
  }

  const removeScreen = (index)=>{
    const updated = [...screens];
    updated.splice(index, 1);
    const reindexed = updated.map((s, i)=>({
      ...s,
      screen_number: i + 1
    }));
    setScreens(reindexed);
  };

  const formatForDatetimeLocal = (isoString) => {
    const dt = new Date(isoString);
    const offset = dt.getTimezoneOffset();
    const localTime = new Date(dt.getTime() - offset * 60000);
    return localTime.toISOString().slice(0, 16);
  };


  const handleSubmit = async (e)=>{
    e.preventDefault();
    const updatedTheatre = {
      _id: theatre._id,
      name: theatre.name,
      location: {
        address: theatre.address,
        city: theatre.city,
        state: theatre.state
      },
      max: theatre.max,
      screens: screens.map((s, i)=>({
        screen_number: i + 1,
        seating_capacity: parseInt(s.seating_capacity),
        currently_showing: {
          movie_name: s.currently_showing.movie_name,
          price: parseFloat(s.currently_showing.price),
          showtimes: s.currently_showing.showtimes.filter(st=>st)
        }
      }))
    };

    try {
      const res = await fetch("http://localhost:3000/theatres/update",{
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theatreDetails: updatedTheatre })
      })
      const data = await res.json()
      if (data.status === "success") {
        const updated = await dispatch(loadTheatres()).unwrap();
        setTheatres(updated.list);
        alert("Theatre updated successfully!");
        navigate(0)
      }
      else
        alert(data.message);
    }
    catch(err){
      console.error(err);
      alert("Something went wrong!");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!theatre) return <div>Theatre not found.</div>;

  return (
    <form onSubmit={handleSubmit}>
      <h2>Update {theatre.name}</h2>
      <input
        value={theatre.address}
        onChange={(e) => setTheatre({ ...theatre, address: e.target.value })}
        placeholder="Address"
        required
      />
      <input
        value={theatre.city}
        onChange={(e) => setTheatre({ ...theatre, city: e.target.value })}
        placeholder="City"
        required
      />
      <input
        value={theatre.state}
        onChange={(e) => setTheatre({ ...theatre, state: e.target.value })}
        placeholder="State"
        required
      />
      <input
        type="number"
        value={theatre.max}
        onChange={(e)=>{
          const newMax = parseInt(e.target.value);
          if (newMax < screens.length) {
            alert(`You can't set max below the current screen count (${screens.length})`);
            return;
          }
          setTheatre({ ...theatre, max: newMax });
        }}
        placeholder="Max Screens"
        required
      />
      {screens.length < theatre.max && (
      <button
          type="button"
          style={{cursor: "pointer", backgroundColor: "rgba(255,255,255,0.2)", border: 'none', color: "white", borderRadius: "0.8rem", padding: "0.7rem"}}
          onClick={()=>{
            const newScreen = {
              screen_number: screens.length + 1,
              seating_capacity: "",
              currently_showing: {
                movie_name: "",
                price: "",
                showtimes: [""]
              }
            };
            setScreens([...screens, newScreen]);
          }}
        >
          + Add Screen
        </button>
      )}

      {screens.map((screen, screenIndex) => (
        <div key={screenIndex} style={{ border: "1px solid #ccc", padding: 10, margin: 10 }}>
          <h4>Screen {screen.screen_number}</h4>
          <input
            type="number"
            placeholder="Seating Capacity"
            value={screen.seating_capacity}
            onChange={(e) => updateScreen(screenIndex, "seating_capacity", e.target.value)}
            required
          />
          <input
            placeholder="Movie Name"
            value={screen.currently_showing.movie_name}
            onChange={(e) => updateScreen(screenIndex, "movie_name", e.target.value)}
            list="dt-movies"
            required
          />
          <datalist id="dt-movies">
            {
              movies.map((movie,index)=>(
                <option key={index} value={movie}>{movie}</option>
              ))
            }
          </datalist>
          <input
            type="number"
            placeholder="Price"
            value={screen.currently_showing.price}
            onChange={(e) => updateScreen(screenIndex, "price", e.target.value)}
            required
          />
          {screen.currently_showing.showtimes.map((st, stIndex) => (
            <input
              key={stIndex}
              type="datetime-local"
              value={st}
              onChange={(e) => updateShowtime(screenIndex, stIndex, e.target.value)}
              required
            />
          ))}
          <button type="button" style={{cursor: "pointer", backgroundColor: "transparent", border: 'none', color: "white"}} onClick={()=>addShowtime(screenIndex)}>
            + Add Showtime
          </button>
          <button style={{cursor: "pointer", backgroundColor: "transparent", border: 'none', color: "white"}} type="button" onClick={()=>removeShowTime(screenIndex)}>
            - Remove Showtime
          </button>
          <button
            type="button"
            onClick={() => removeScreen(screenIndex)}
            style={{marginTop: 10, background: "crimson", color: "white", border: "none", cursor: "pointer"}}
          >
            Remove Screen
          </button>

        </div>
      ))}
      <button type="submit">Update Theatre</button>
    </form>
  );
};

export default UpdateTheatre;
