import { useState, useEffect } from 'react'

const MovieTable = ({movies}) => {
    const [castingList,setCastingList] = useState([])

    useEffect(()=>{
        const doFirst = async () => {
            try{
                const response = await fetch('http://localhost:3000/movies/whereAreCasting');
                const data = await response.json()
                if(data.status === 'success'){
                    setCastingList(data.data)
                }
                else{
                    alert('Failed to Fetch from Server')
                }
            }
            catch(err){
                console.log(err)
                alert('Something went Wrong!')
            }
        }
        doFirst()
    },[])

    return (
        <div className='add-t' style={{marginTop: "10px", borderRadius: "1rem"}}>
            <span className='trend-name'>Movies Overview</span>
            <ul className='trend-desc' style={{listStyle: "number"}}>
                {
                    movies.map((movie,index)=>(
                        <li key={index} style={{margin: "20px"}}>
                            <span className='trend-desc' style={{fontSize: "1.2rem", margin: "13px", color:"white"}}>{movie.movie}</span>
                             - Casting on {movie.count} Theatre(s)
                            <span className='trend-lang'>{" "+castingList[movie.movie]+", \t"}</span>
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}

export default MovieTable