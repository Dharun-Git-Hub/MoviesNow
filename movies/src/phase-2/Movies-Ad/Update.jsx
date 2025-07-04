import { useState } from 'react'
import { useLocation } from 'react-router-dom'

const Update = () => {
    const location = useLocation()
    const selected = location.state || {}
    const [movie, setMovie] = useState({
        _id: selected._id,
        title: selected.title,
        language: selected.language,
        description: selected.description,
        duration: selected.duration,
        poster_url: selected.poster_url,
        trailer_url: selected.trailer_url,
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
            const response = await fetch('http://localhost:3000/updateMovie',{
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({movieDetails: movie})
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
    return (
        <form className='add-t' onSubmit={handleSubmit} style={{ margin: "auto", backgroundImage: `url(${movie.poster_url})`, backgroundSize: "cover", minHeight: "100vh", backgroundPosition: "center", position: "fixed", width: "100vw"}}>
            <h2 className='trend-name'>Update Movie</h2>
            <label style={{fontFamily: "cursive", color: "white", fontSize: "1.5rem"}}>Title</label><input type="text" style={{cursor: "not-allowed",color: "#fff"}} name="title" placeholder="Title" value={movie.title} onChange={handleChange} disabled/>
            <label style={{fontFamily: "cursive", color: "white", fontSize: "1.5rem"}}>Language</label><input type="text" name="language" placeholder="Language" value={movie.language} onChange={handleChange} required/>
            <label style={{fontFamily: "cursive", color: "white", fontSize: "1.5rem"}}>Description</label><textarea name="description" placeholder="Description" value={movie.description} onChange={handleChange} rows={4} required/>
            <label style={{fontFamily: "cursive", color: "white", fontSize: "1.5rem"}}>Duration</label><input type="text" name="duration" placeholder="Duration (e.g., 2h 28m)" value={movie.duration} onChange={handleChange} required/>
            <label style={{fontFamily: "cursive", color: "white", fontSize: "1.5rem"}}>Poster URL</label><input type="url" name="poster_url" placeholder="Poster URL" value={movie.poster_url} onChange={handleChange} required/>
            <label style={{fontFamily: "cursive", color: "white", fontSize: "1.5rem"}}>Trailre URL</label><input type="url" name="trailer_url" placeholder="Trailer URL" value={movie.trailer_url} onChange={handleChange} required/>
            <button type="submit">Submit</button>
        </form>
    )
}

export default Update