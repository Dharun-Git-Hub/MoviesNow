import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const RenderTheatres = ({theatre}) => {
    const [detailing,setDetailing] = useState(false)
    const username = sessionStorage.getItem('username') || null;
    const navigate = useNavigate()
    
    useEffect(()=>{
        console.log(theatre)
    },[])

    const orderTicket = () => {
        const ticket = {
            username: username,
            theatre: theatre.theatre,
            movie: theatre.movie,
            screen: theatre.screen_number,
            capacity: theatre.capacity,
            price: theatre.price,
            showtimes: theatre.showtimes,
        }
        navigate('/booking',{state: ticket})
    }
    
    return (
        <>
        <div className="theatre-right-card" onMouseOver={()=>setDetailing(true)} onMouseLeave={()=>setDetailing(false)}  style={{display: "flex",justifyContent: "space-between"}}>
            <span>{theatre.theatre}</span>
            <span>Screen: {theatre.screen_number}</span>
        </div>
        { detailing && 
            <div onMouseOver={()=>setDetailing(true)} onMouseLeave={()=>setDetailing(false)} className='theatre-right-card2' style={{transform: "translateY(-60px)", display: "flex", justifyContent: "space-between"}}>
                <span className='trend-desc' style={{fontSize: "1.2rem", margin: "0"}}>
                    Cost: {theatre.price} /Ticket
                </span>
                <button className='book-now' onClick={orderTicket}>Book Now</button>
            </div>
        }
        </>
    )
}

export default RenderTheatres