import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Screen = ({screen,theatre}) => {
    const [detailing,setDetailing] = useState(false)
    const username = sessionStorage.getItem('username') || null
    console.log(screen)
    console.log(theatre)
    const navigate = useNavigate()
    const orderTicket = () => {
        const ticket = {
            username: username,
            theatre: theatre.name,
            movie: screen.currently_showing.movie_name,
            screen: screen.screen_number,
            capacity: screen.seating_capacity,
            price: screen.currently_showing.price,
            showtimes: screen.currently_showing.showtimes,
        }
        navigate('/booking',{state: ticket})
    }
    return (
        <>
            <div onMouseOver={()=>setDetailing(true)} onMouseLeave={()=>setDetailing(false)} className="theatre-right-card" style={{margin: "0px",display: "flex", flexDirection:"row", justifyContent: "space-between", fontFamily: "Times New Roman"}}>{screen.currently_showing.movie_name}
                <span className='trend-desc' style={{margin: "0", color: "grey"}}>Casting at Screen {screen.screen_number}</span>
            </div>
            { detailing &&
                <div onMouseOver={()=>setDetailing(true)} onMouseLeave={()=>setDetailing(false)} className='theatre-right-card2' style={{transform: "translateY(-40px)", display: "flex", justifyContent: "space-between"}}>
                    <span className='trend-desc' style={{fontSize: "1.2rem", margin: "0"}}>Rs. {screen.currently_showing.price} /Ticket</span>
                    <button className='book-now' onClick={orderTicket}>Book Now</button>
                </div>
            }
        </>
    )
}

export default Screen