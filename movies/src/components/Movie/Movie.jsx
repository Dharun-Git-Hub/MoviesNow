import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { getCastingTheatres } from '../../Slices/Theatres'
import RenderTheatres from './RenderTheatre'

const Movie = () => {
    const location = useLocation()
    const movie = location.state || {}
    const [theatres,setTheatres] = useState([])
    const dispatch = useDispatch()
    useEffect(()=>{
        const doFirst = async() => {
            const list = await dispatch(getCastingTheatres(movie)).unwrap()
            console.log(list)
            setTheatres(list.list)
        }
        doFirst()
    },[])
    return (
        <div className='home-cont' style={{position: "fixed"}}>
            <div className='home-top-video'>
                <video width="100%" height="100%" autoPlay="1" border="0" loop="1">
                    <source src={movie.trailer_url}/>
                </video>
            </div>  
            <div className='home-side-cont'>
                <div className='video-below-cont'>
                    <span className='trend-name'>{movie.title}</span>
                    <span className='trend-desc'>
                        <b>Description:</b><br/>{movie.description}
                    </span>
                    <span className='trend-lang'>Language: {movie.language}</span>
                    <span className='trend-desc'>Duration: {movie.duration}</span>
                </div>
                <div className="video-side-cont">
                    <img src={movie.poster_url}/>
                    <div className='flow-div'>
                        {
                            theatres.map((theatre,index)=>(
                                    <RenderTheatres key={index} theatre={theatre}/>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Movie