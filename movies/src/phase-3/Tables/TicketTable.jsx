import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { getMovieRevenue, getTheatreRevenue } from '../../Slices/TicketSlice'

const TicketTable = () => {
    const dispatch = useDispatch()
    const [movies,setMovies] = useState([])
    const [theatres,setTheatres] = useState([])
    const [total,setTotal] = useState(0)

    useEffect(()=>{
        const doFirst = async () => {
            const movies = await dispatch(getMovieRevenue()).unwrap()
            const theatres = await dispatch(getTheatreRevenue()).unwrap()
            console.log('Theatres',theatres)
            setMovies(movies.movieRevenue)
            setTheatres(theatres.theatreRevenue)
        }
        doFirst()
    },[])

    useEffect(()=>{
        const result = theatres.reduce((acc,c)=>acc += c.revenue,0)
        setTotal(result)
    },[theatres])
    return (
        <div className='add-t' style={{ position: "absolute", top: "40vh", width: "100vw", minHeight: "60vh"}}>
            <span className='trend-name' style={{marginTop: "20px"}}>Tickets Overview</span>
            <div style={{display: "flex", flexDirection: "row"}}>
                <table className='ticket-table'>
                    <thead>
                        <th>Movie</th>
                        <th>Seats Booked</th>
                        <th>Revenue</th>
                    </thead>
                    <tbody>
                        {
                            movies.map((movie,index)=>(
                                <tr key={index}>
                                    <td>{movie._id}</td>
                                    <td>{movie.seats}</td>
                                    <td style={{color: "limegreen"}}>{movie.revenue}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>

                <table className='ticket-table'>
                    <thead>
                        <th>Theatre</th>
                        <th>Seats Booked</th>
                        <th>Revenue</th>
                        <th>Percent %</th>
                    </thead>
                    <tbody>
                        {
                            theatres.map((theatre,index)=>(
                                <tr key={index}>
                                    <td>{theatre._id}</td>
                                    <td>{theatre.seats}</td>
                                    <td style={{color: "limegreen"}}>{theatre.revenue}</td>
                                    <td style={{color: "yellow"}}>{((theatre.revenue/total)*100).toFixed(2)}%</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
            <span className='trend-name'>Total Revenue: <span style={{color: "rgb(230, 200, 240)"}}>{total}</span></span>
        </div>
    )
}

export default TicketTable