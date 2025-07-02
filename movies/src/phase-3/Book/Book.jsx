import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Book = () => {
    const location = useLocation();
    const ticket = location.state || {};
    console.log(ticket)
    const { theatre, movie, screen, capacity = 0 } = ticket;
    const [selectedTime, setSelectedTime] = useState(null);
    const [bookedSeats, setBookedSeats] = useState(new Set());
    const room = `${movie}_${theatre}_${screen}_${selectedTime}`;
    const ws = useRef(null);
    const myId = useRef(null);
    const [lockedSeats, setLockedSeats] = useState(new Map());
    const navigate = useNavigate()
    const seatsPerGroup = capacity / 2;
    const seatsPerRow = 10;
    const rowsPerGroup = Math.ceil(seatsPerGroup / seatsPerRow);

    useEffect(()=>{
        if(!sessionStorage.getItem('token')){
            alert('Login First to Continue!')
            navigate('/')
        }
    },[])

    useEffect(() => {
        if (!selectedTime) return;

        const room = `${movie}_${theatre}_${screen}_${selectedTime}`;
        ws.current = new WebSocket('ws://localhost:8000');

        ws.current.onopen = () => {
            ws.current.send(JSON.stringify({ type: 'join', room }));
        };

        ws.current.onmessage = (msg) => {
            const data = JSON.parse(msg.data);

            if (data.type === 'id') {
                myId.current = data.id;
            }

            if (data.type === 'init-locked-seats' && data.room === room) {
                const updated = new Map();
                data.seats.forEach(({ seat, by }) => {
                    updated.set(seat, by);
                });
                setLockedSeats(updated);
                setBookedSeats(new Set(data.booked)); 
            }

            if (data.type === 'lock-seat' && data.room === room) {
                setLockedSeats(prev => {
                    const updated = new Map(prev);
                    if (data.by) {
                        updated.set(data.seat, data.by);
                    } else {
                        updated.delete(data.seat);
                    }
                    return updated;
                });
            }

            if (data.type === 'booked' && data.room === room) {
                setBookedSeats(prev => new Set([...prev, ...data.seats]));
                setLockedSeats(prev => {
                    const updated = new Map(prev);
                    data.seats.forEach(seat => updated.delete(seat));
                    return updated;
                });
            }
        };


        return () => {
            ws.current.close();
        };
    }, [room]);

    const handleSeatClick = (seatNumber) => {
        const lockedBy = lockedSeats.get(seatNumber);

        if (lockedBy && lockedBy !== myId.current) return;

        const isLockedByMe = lockedBy === myId.current;
        const action = isLockedByMe ? 'unlock-seat' : 'lock-seat';

        ws.current.send(JSON.stringify({
            type: action,
            seat: seatNumber,
            room,
        }));
    };

    const generateSeatGroups = () => {
        let seatNumber = 1;
        const groups = [];

        for (let g = 0; g < 2; g++) {
            const rows = [];
            for (let r = 0; r < rowsPerGroup; r++) {
                const row = [];
                for (let s = 0; s < seatsPerRow; s++) {
                    if (seatNumber > capacity) break;
                    const currentSeat = seatNumber;

                    const isLocked = lockedSeats.has(currentSeat);
                    const isMine = lockedSeats.get(currentSeat) === myId.current;
                    const isBooked = bookedSeats.has(currentSeat);

                    row.push(
                        <div
                            key={currentSeat}
                            className={`seat ${isLocked ? (isMine ? 'locked-mine' : 'locked') : isBooked?'booked':''}`}
                            onClick={() => !isBooked && handleSeatClick(currentSeat)} 
                        >
                            {currentSeat}
                        </div>
                    );
                    seatNumber++;
                }
                if (row.length > 0) {
                    rows.push(<div key={`row-${g}-${r}`} className="seat-row">{row}</div>);
                }
            }
            groups.push(<div key={`group-${g}`} className="seat-group">{rows}</div>);
        }
        return groups;
    };

    const bookTickets = async () => {
        const mySeats = Array.from(lockedSeats.entries())
            .filter(([seat, by]) => by === myId.current)
            .map(([seat]) => seat);

        if (mySeats.length <= 0) {
            alert('Please select at least one seat!')
            return;
        }

        if (ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify({
                type: 'booked',
                room,
                seats: mySeats
            }));
        }

        const details = {
            ...ticket,
            showTime: selectedTime,
            seats: mySeats,
            totalPrice: mySeats.length * ticket.price,
        };
        navigate('/preview',{state: details})
    };

    return (
        <div className="seat-container">
            {!selectedTime?<span className='trend-name'>Available Screen Timings at {theatre} ({movie})</span>
            :<span className='trend-name'>Screen No. {screen} - {movie}</span>}
            <div style={{display: "flex", flexDirection:"row", gap: "30px"}}>
                {
                    ticket.showtimes.map((time) => (
                        <label style={{cursor: "pointer", backgroundColor: "rgba(255,255,255,0.3)", padding: "0.7rem", borderRadius: "0.7rem"}} key={time}>
                            <input
                                type="radio"
                                name="showtime"
                                value={time}
                                onChange={() => setSelectedTime(time)}
                            />
                            {new Date(time).toLocaleDateString()} - {new Date(time).toLocaleTimeString()}
                        </label>
                    ))
                }
            </div>
            <div className='group-cont'>{selectedTime && generateSeatGroups()}</div>
            <hr style={{color: "black"}}/>
            <span style={{position: "absolute", bottom: "2px", left: "48vw", fontSize: "1.8rem"}}>Screen Area</span>
            {selectedTime && <button className='book-button' onClick={bookTickets}>Book Tickets</button>}
        </div>
    );
};

export default Book;