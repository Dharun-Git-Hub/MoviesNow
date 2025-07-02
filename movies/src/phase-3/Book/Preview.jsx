import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { bookMyTicket } from '../../Slices/BookSlice';

const Preview = () => {
    const location = useLocation()
    const details = location.state || {}
    const dispatch = useDispatch()
    const navigate = useNavigate()
    console.log(details)

    const handleBooking = async () => {
        const response = await dispatch(bookMyTicket(details)).unwrap()
        if (response.status === "Ticket booked Successfully!") {
            alert(response.status);
            navigate(-2);
        } else {
            alert("Booking failed! Refresh and try again.");
        }
    }

    return (
        <div className='prev-cont'>
            <span className='trend-name'>Ticket Confirmation</span>
            <div className='prev-ticket'>
                <div style={{display: "flex", flexDirection: "column"}}>
                    <span><span className='trend-desc' style={{color: "black", fontSize: "1.1rem", marginRight: "30px"}}>Name: </span> {details.username}</span>
                    <span><span className='trend-desc' style={{color: "black", fontSize: "1.1rem", marginRight: "30px"}}>Theatre: </span> {details.theatre}</span>
                    <span><span className='trend-desc' style={{color: "black", fontSize: "1.1rem", marginRight: "30px"}}>Movie: </span> {details.movie}</span>
                    <span><span className='trend-desc' style={{color: "black", fontSize: "1.1rem", marginRight: "30px"}}>Screen: </span> {details.screen}</span>
                    <span><span className='trend-desc' style={{color: "black", fontSize: "1.1rem", marginRight: "30px"}}>Time: </span> {new Date(details.showTime).toLocaleTimeString()}</span>
                </div>
                <div style={{width: "2px", height: "80%", backgroundColor: "grey"}}></div>
                <div style={{display: "flex", flexDirection: "column"}}>
                    <span><span className='trend-desc' style={{color: "black", fontSize: "1.1rem", marginRight: "30px"}}>Date: </span> {new Date(details.showTime).toLocaleDateString()}</span>
                    <span><span className='trend-desc' style={{color: "black", fontSize: "1.1rem", marginRight: "30px"}}>Seat No(s): </span><span className='trend-lang' style={{color: "blue"}}>{details.seats.map((seat,index)=>(<p key={index}>{seat},</p>))}</span></span>
                    <span><span className='trend-desc' style={{color: "black", fontSize: "1.1rem", marginRight: "30px"}}>No. of Seats: </span> {details.seats.length}</span>
                    <span><span className='trend-desc' style={{color: "black", fontSize: "1.1rem", marginRight: "30px"}}>Price Details: </span>{details.seats.length} x {details.price} = {details.totalPrice}</span>
                    <hr/><hr/>
                    <span><span className='trend-desc' style={{color: "black", fontSize: "1.1rem", marginRight: "30px"}}>Total Amount Payable: </span><span style={{color: "green", fontSize: "1.3rem"}}><b>{details.totalPrice}</b></span></span>
                </div>
                
            </div>
            <button className='book-butt' onClick={handleBooking}>Confirm</button>
        </div>
    )
}

export default Preview