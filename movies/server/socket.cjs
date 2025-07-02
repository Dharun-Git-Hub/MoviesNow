const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose')
const Ticket = require('./Schema/TicketSchema/TicketSchema.cjs')
require('dotenv').config()
const uri = process.env.uri;

mongoose.connect(uri)
.then(()=>console.log('MongoDB Connected'))
.catch((err)=>console.log(err))

const wss = new WebSocket.Server({ port: 8000 });
const rooms = new Map();

function parseRoom(roomString) {
    const parts = roomString.split('_');
    const screen = parseInt(parts[parts.length - 2]);
    const showTime = decodeURIComponent(parts[parts.length - 1]);
    const movie = parts.slice(0, parts.length - 3).join('_');
    const theatre = parts[parts.length - 3];

    return {
        movie,
        theatre,
        screen,
        showTime: new Date(showTime)
    };
}


wss.on('connection', (ws) => {
    ws.id = uuidv4();
    ws.room = null;
    ws.send(JSON.stringify({ type: 'id', id: ws.id }));
    ws.on('message', (message) => {
        const data = JSON.parse(message);
        if (data.type === 'join') {
            ws.room = data.room;
            console.log(ws.id, 'Requested to Join room:', ws.room);
            const { movie, theatre, screen, showTime } = parseRoom(data.room);
            Ticket.find({
                movie,
                theatre,
                screen,
                showTime
            })
            .then(tickets => {
                const bookedSeats = new Set();
                tickets.forEach(ticket => {
                    ticket.seats.forEach(seat => bookedSeats.add(seat));
                });
                if (!rooms.has(ws.room)) {
                    rooms.set(ws.room, {
                        clients: [],
                        lockedSeats: new Map()
                    });
                }
                const roomData = rooms.get(ws.room);
                roomData.clients.push(ws);
                const lockedSeatsPayload = Array.from(roomData.lockedSeats.entries()).map(([seat, by]) => ({
                    seat,
                    by
                }));
                ws.send(JSON.stringify({
                    type: 'init-locked-seats',
                    seats: lockedSeatsPayload,
                    room: ws.room,
                    booked: Array.from(bookedSeats)
                }));
            })
            .catch(err => {
                console.error('DB Error on join:', err);
            });
        }
        if (data.type === 'lock-seat' || data.type === 'unlock-seat') {
            const roomData = rooms.get(ws.room);
            if (!roomData) return;
            if (data.type === 'lock-seat') {
                roomData.lockedSeats.set(data.seat, ws.id);
            } else {
                roomData.lockedSeats.delete(data.seat);
            }
            roomData.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({
                        type: 'lock-seat',
                        seat: data.seat,
                        room: ws.room,
                        by: data.type === 'lock-seat' ? ws.id : null
                    }));
                }
            });
        }
        if (data.type === 'booked') {
            const roomData = rooms.get(ws.room);
            if (!roomData) return;
            data.seats.forEach(seat => {
                roomData.lockedSeats.delete(seat);
            });
            roomData.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({
                        type: 'booked',
                        room: ws.room,
                        seats: data.seats
                    }));
                }
            });
        }
    });

    ws.on('close', () => {
        if (ws.room && rooms.has(ws.room)) {
            const roomData = rooms.get(ws.room);
            roomData.clients = roomData.clients.filter(client => client !== ws);
            for (const [seat, by] of roomData.lockedSeats.entries()) {
                if (by === ws.id) {
                    roomData.lockedSeats.delete(seat);
                    roomData.clients.forEach(client => {
                        if (client.readyState === WebSocket.OPEN) {
                            client.send(JSON.stringify({
                                type: 'lock-seat',
                                seat,
                                room: ws.room,
                                by: null
                            }));
                        }
                    });
                }
            }
        }
    });
});

console.log('WebSocket running @PORT: 8000')