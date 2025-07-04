import { useLocation } from 'react-router-dom'
import Screen from './Screen'

const Theatre = () => {
    const location = useLocation()
    const theatre = location.state || {}
    console.log(theatre)
    return (
        <div className='home-cont' style={{position: "fixed"}}>
            <div className='theatre-top-cont'>
                <img src={theatre.poster_url}/>
            </div>
            <div className='video-below-cont'>
                <span className='trend-name'>{theatre.name}</span>
                <span className='trend-lang'>{theatre.location.address}</span>
                <span className='trend-desc'>{theatre.location.city}, {theatre.location.state}</span>
                <span className='trend-name'>Screens</span>
                {
                    theatre.screens.map((screen,index)=>(
                        <span key={index} className='trend-desc'>Number: {screen.screen_number} - Capacity: {screen.seating_capacity}</span>
                    ))
                }
            </div>
            <div className="video-side-cont">
                <div className="video-side-cont">
                    <div className="flow-div" style={{width: "50vw", right: "0", top: "50vh", margin: "0"}}>
                        <span className='trend-name'>Currently Casting</span>
                        {
                            theatre.screens.map((screen,index)=>(
                                <Screen key={index} theatre={theatre} screen={screen}/>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Theatre