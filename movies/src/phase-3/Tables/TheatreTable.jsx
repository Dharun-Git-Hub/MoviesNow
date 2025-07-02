import { useState, useEffect } from 'react'

const TheatreTable = ({theatres,showsList}) => {
    return (
        <div className='add-t' style={{marginTop: "10px", borderRadius: "1rem"}}>
            <span className='trend-name'>Theatres Overview</span>
            <ul className='trend-desc' style={{listStyle: "number"}}>
                {
                    theatres.map((theatre, index)=>(
                        <li key={index} style={{margin: "20px"}}>
                            <span style={{fontSize: "1.2rem", margin: "13px", color:"white"}}>{theatre.theatre}</span>
                            - Currently Casting {theatre.casting} Movies
                            <span style={{marginLeft:"20px"}}>
                                {
                                    showsList[theatre.theatre].map((el,index)=>(
                                        <span className='trend-lang' key={index}>{el},</span>
                                    ))
                                }
                            </span>
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}

export default TheatreTable