import { useState, useEffect } from 'react'

const History = () => {
    const [tickets,setTickets] = useState([])
    useEffect(()=>{
        const doFirst = async () => {
            try{
                const response = await fetch('http://localhost:3000/history',{
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({username: `${sessionStorage.getItem('username')}`})
                })
                const data = await response.json()
                console.log(data)
                if(data.status === 'success'){
                    setTickets(data.tickets)
                }
                else{
                    alert(data.message)
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
        <div className='history-cont'>
            <span className='trend-name'>History</span>
            <div className='history-div'>
                {
                    tickets.length === 0 && <span style={{position: "absolute", top: "50vh", left: "40vw", fontSize: "2rem"}} className='trend-desc'>Book a Ticket, Hurry up!</span>
                }
                <table className='ticket-table' style={{width: "100%"}}>
                    <thead>
                        <th>Movie</th>
                        <th>Screen</th>
                        <th>Theatre</th>
                        <th>Seats</th>
                        <th>Base</th>
                        <th>Paid</th>
                        <th>Date</th>
                        <th>Showtime</th>
                    </thead>
                    <tbody>
                        {
                            tickets.map((ticket,index)=>(
                                <tr key={index}>
                                    <td>{ticket.movie}</td>
                                    <td>{ticket.screen}</td>
                                    <td>{ticket.theatre}</td>
                                    <td>{ticket.no}</td>
                                    <td>{ticket.ticketPrice}</td>
                                    <td style={{color: 'greenyellow'}}>{ticket.payable}</td>
                                    <td>{new Date(ticket.showTime).toLocaleDateString()}</td>
                                    <td>{new Date(ticket.showTime).toLocaleTimeString()}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default History