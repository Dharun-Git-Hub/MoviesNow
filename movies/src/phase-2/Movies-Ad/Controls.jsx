import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { loadMovies } from '../../Slices/MoviesSlice'
import { useNavigate } from 'react-router-dom'

const Controls = () => {
    const dispatch = useDispatch()
    const [movies,setMovies] = useState([])

    useEffect(()=>{
        const doFirst = async () => {
            const moviesList = await dispatch(loadMovies()).unwrap()
            setMovies(moviesList.list)
        }
        doFirst()
    },[])

    const AddMovie = () => {
        const [movie,setMovie] = useState('')
        const navigate = useNavigate()

        const handleAdd = (e) => {
            e.preventDefault()
            if(movie.trim() != ''){
                console.log(movies)
                const exist = movies.find((el)=>el.title === movie)
                if(exist){
                    alert(`Movie: ${movie} already Found!`)
                    return
                }
                else{
                    navigate('/Add-Movie', {state: {selected: movie}})
                }
            }
            else{
                alert('Fill up the Field to Add')
                return
            }
        }
        return (
            <form onSubmit={handleAdd}>
                <input placeholder='Movie Name' onChange={(e)=>setMovie(e.target.value)}/>
                <button style={{backgroundColor: "#4545fa", color: "#fff"}} type="submit">Add</button>
            </form>
        )
    }

    const RemoveMovie = () => {
        const [movie,setMovie] = useState('')

        const handleRemove = async (e) => {
            e.preventDefault()
            console.log(movie)
            if(movie.trim() != ''){
                console.log(movies)
                const exist = movies.find((el)=>el.title === movie)
                if(!exist){
                    alert(`Movie ${movie} not Found!`)
                    return
                }
                else{
                    const opt = confirm('Are you sure to Delete Movie: ',movie,' ?')
                    if(opt){
                        try{
                            const response = await fetch('http://localhost:3000/removeMovie',{
                                method: 'POST',
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({movieDetails: movie})
                            })
                            const data = await response.json()
                            console.log(data)
                            if(data.status === 'success'){
                                setMovie('')
                                alert("Movie Deleted Successfully")
                            }
                            else{
                                alert(data.message)
                            }
                        }
                        catch(err){
                            console.log(err)
                            alert('Something went wrong!')
                        }
                    }
                }
            }
        }
        return (
            <>
            <datalist id="dt-list-movies">
                {
                    movies.map((movie,index)=>(
                        <option key={index} value={movie.title}>{movie.title}</option>
                    ))
                }
            </datalist>
                <form onSubmit={handleRemove}>
                    <input list='dt-list-movies' placeholder='Movie Name' onChange={(e)=>setMovie(e.target.value)}/>
                    <button style={{backgroundColor: "orangered", color: "white"}} type="submit">Remove</button>
                </form>
            </>
            
        )
    }

    const UpdateMovie = () => {
        const [movie,setMovie] = useState('')
        const navigate = useNavigate()
        const handleUpdate = (e) => {
            e.preventDefault()
            if(movie.trim() != ''){
                console.log(movies)
                const exist = movies.find((el)=>el.title === movie)
                if(!exist){
                    alert(`Movie: ${movie} Not Found!`)
                    return
                }
                else{
                    console.log(movies.find(m=>m.title === movie))
                    navigate('/Update-Movie', {state: movies.find(m=>m.title === movie)})
                }
            }
            else{
                alert('Fill up the Field to Add')
                return
            }
        }
        return (
            <div>
                <datalist id="dt-list-movies">
                    {
                        movies.map((movie,index)=>(
                            <option key={index} value={movie.title}>{movie.title}</option>
                        ))
                    }
                </datalist>
                <form onSubmit={handleUpdate}>
                    <input list='dt-list-movies' placeholder='Movie Name' onChange={(e)=>setMovie(e.target.value)}/>
                    <button style={{backgroundColor: "limegreen", color: "white"}} type="submit">Update</button>
                </form>
            </div>
        )
    }

    return (
        <div className='add-t' style={{padding: "2rem", height: "100vh", borderRadius: "0.8rem"}}>
            <h1 className='trend-name'>Movies Management</h1>
            <AddMovie/>
            <RemoveMovie/>
            <UpdateMovie/>
        </div>
    )
}

export default Controls