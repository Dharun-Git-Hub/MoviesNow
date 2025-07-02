import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { loadTheatres } from '../../Slices/TheatreSlice';
import { useDispatch } from 'react-redux';

const Add = () => {
    const location = useLocation()
    const selected = location.state.selected || ''
    const [theatres,setTheatres] = useState([])
    const [spots,setSpots] = useState([])
    const dispatch = useDispatch()

    useEffect(()=>{
        const doFirst = async () => {
            try{
                const response = await dispatch(loadTheatres()).unwrap()
                console.log(response)
                setTheatres(response.list)
            }
            catch(err){
                console.log(err)
            }
        }
        doFirst()
    },[])

    const [movie, setMovie] = useState({
        title: selected,
        language: "",
        description: "",
        duration: "",
        poster_url: "",
        trailer_url: "",
    });

    const handleChange = (e) => {
        setMovie({
            ...movie,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        console.log("Movie Object:", movie);
        try{
            const response = await fetch('http://localhost:3000/addMovie',{
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({movieDetails: movie, theatres: spots})
            })
            const data = await response.json()
            console.log(data)
            if(data.status==='success'){
                alert(data.message)
            }
            else{
                alert(data.message)
                return
            }
        }
        catch(err){
            console.log(err)
            alert('Something Went Wrong!')
            return
        }
    };

    const handleAddName = (theatreName, checked) => {
        setSpots(prev =>
        checked
            ? [...prev, theatreName]
            : prev.filter(name => name !== theatreName)
        );
    };


    return (
        <form className='add-t' onSubmit={handleSubmit} style={{ margin: "auto" }}>
            <h2 className='trend-name'>Add Movie</h2>
            <input type="text" name="title" placeholder="Title" value={movie.title} onChange={handleChange} style={{color: "white", cursor: "not-allowed"}} disabled/>
            <input type="text" name="language" placeholder="Language" value={movie.language} onChange={handleChange} required/>
            <textarea name="description" placeholder="Description" value={movie.description} onChange={handleChange} rows={4} required/>
            <input type="text" name="duration" placeholder="Duration (e.g., 2h 28m)" value={movie.duration} onChange={handleChange} required/>
            <input type="url" name="poster_url" placeholder="Poster URL" value={movie.poster_url} onChange={handleChange} required/>
            <input type="url" name="trailer_url" placeholder="Trailer URL" value={movie.trailer_url} onChange={handleChange} required/>
            <span className='trend-desc' style={{fontSize: "30px",color: "#ddd"}}>Release in (Optional)</span>
            {
                theatres.map((el,index)=>(
                    <>
                        <label className='trend-desc'>{el.name}
                            <input
                                type="checkbox"
                                id={`spots-${index}`}
                                value={el.name}
                                disabled={el.screens.length >= el.max}
                                onChange={(e) => handleAddName(el.name, e.target.checked)}
                            />
                            {el.screens.length >= el.max && (
                                <span style={{ color: "red", fontSize: "12px" }}>
                                    {" "} (Max capacity reached)
                                </span>
                            )}
                        </label>
                        <br/>
                    </>
                ))
            }
            <button type="submit">Submit</button>
        </form>
    );
};

export default Add;
