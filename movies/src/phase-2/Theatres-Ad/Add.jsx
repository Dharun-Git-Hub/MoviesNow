import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loadTheatres } from "../../Slices/TheatreSlice";

const Addd = ({setTheatres}) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [screens, setScreens] = useState([]);
  const [max,setMax] = useState(1)
  const dispatch = useDispatch()

  const addScreen = () => {
    if (screens.length >= max) {
      alert("Reached the maximum number of screens!");
      return;
    }
    setScreens([
      ...screens,
      {
        screen_number: screens.length + 1,
        seating_capacity: "",
        currently_showing: {
          movie_name: "",
          price: "",
          showtimes: [""]
        }
      }
    ]);
  };

  const updateScreen = (index, field, value) => {
    const updatedScreens = [...screens];
    if (field === "movie_name" || field === "price") {
      updatedScreens[index].currently_showing[field] = value;
    } else {
      updatedScreens[index][field] = value;
    }
    setScreens(updatedScreens);
  };

  const updateShowtime = (screenIndex, showtimeIndex, value) => {
    const updatedScreens = [...screens];
    updatedScreens[screenIndex].currently_showing.showtimes[showtimeIndex] = value;
    setScreens(updatedScreens);
  };

  const addShowtime = (screenIndex) => {
    const updatedScreens = [...screens];
    updatedScreens[screenIndex].currently_showing.showtimes.push("");
    setScreens(updatedScreens);
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    const theatreDetails = {
      name,
      location: {
        address,
        city,
        state
      },
      max,
      screens: screens.map((s, i) => ({
        screen_number: i + 1,
        seating_capacity: parseInt(s.seating_capacity),
        currently_showing: {
          movie_name: s.currently_showing.movie_name,
          price: parseFloat(s.currently_showing.price),
          showtimes: s.currently_showing.showtimes.filter(st => st)
        }
      }))
    };
    console.log(theatreDetails);
    if(theatreDetails.screens.length <= 0){
        alert('Please add atleast a Screen!')
        return
    }
    try{
        const response = await fetch('http://localhost:3000/addTheatre',{
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({theatreDetails:theatreDetails}),
        })
        const data = await response.json()
        console.log(data)
        if(data.status === 'success'){
            const newTheatres = await dispatch(loadTheatres()).unwrap()
            setTheatres(newTheatres.list)
            alert(data.message)
            setScreens([])
            setName('')
            setAddress('')
            setCity('')
            setState('')
        }
        else{
            alert(data.message)
            return
        }
    }
    catch(err){
        console.log(err)
        alert('Something went Wrong!')
    }
  };

  return (
    <form className="add-t" style={{marginTop: "40vh"}} onSubmit={handleSubmit}>
      <h2 className="trend-name">Add a New Theatre</h2>
      <input placeholder="Theatre Name" value={name} onChange={(e) => setName(e.target.value)} required />
      <input placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} required />
      <input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} required />
      <input placeholder="State" value={state} onChange={(e) => setState(e.target.value)} required />
      <label>{" "}Maximum number of screens
        <input
            type="number"
            placeholder="Maximum number of screens"
            value={max}
            onChange={(e) => setMax(parseInt(e.target.value))}
            min={"1"}
            required
          />
      </label>
      
      <h3>Screens</h3>
      <button className="add-screen" style={{backgroundColor: "#4545fa"}} type="button" onClick={addScreen}>+ Add Screen</button>

      {screens.map((screen, screenIndex) => (
        <div key={screenIndex} style={{ border: "1px solid gray", padding: "10px", margin: "10px 0" }}>
          <h4>Screen {screenIndex + 1}</h4>
          <input
            placeholder="Seating Capacity"
            type="number"
            value={screen.seating_capacity}
            onChange={(e) => updateScreen(screenIndex, "seating_capacity", e.target.value)}
            required
          />
          <input
            placeholder="Movie Name"
            value={screen.currently_showing.movie_name}
            onChange={(e) => updateScreen(screenIndex, "movie_name", e.target.value)}
            required
          />
          <input
            placeholder="Price"
            type="number"
            value={screen.currently_showing.price}
            onChange={(e) => updateScreen(screenIndex, "price", e.target.value)}
            required
          />

          <h5>Showtimes</h5>
          {screen.currently_showing.showtimes.map((st, stIndex) => (
            <input
              key={stIndex}
              type="datetime-local"
              value={st}
              onChange={(e) => updateShowtime(screenIndex, stIndex, e.target.value)}
              required
            />
          ))}
          <button type="button" onClick={() => addShowtime(screenIndex)}>+ Add Showtime</button>
        </div>
      ))}

      <br />
      <button type="submit">Submit</button>
    </form>
  );
};

export default Addd;
