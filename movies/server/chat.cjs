const WebSocket = require('ws')
const { v4: uuid } = require('uuid')
const fetchAllClients = require('./HelperFunctions/fetchAllHelper.cjs')
const PORT = 8001

const clients = new Map() 
const namedClients = new Map()

const wss = new WebSocket.Server({port:PORT})

wss.on('connection',(ws)=>{
    const userId = uuid();
    ws.send(JSON.stringify({type: "your_id", id: userId}))
    clients.set(ws, userId);
    fetchAllClients(clients,namedClients)
    ws.on('message',(message)=>{
        let data;
        try{
            data = JSON.parse(message);
        }
        catch(err){
            console.log(err)
            ws.send(JSON.stringify({type: "Type-Error", message: "Please give JSON Data"}))
            return;
        }
        const msg = data.message;
        if(data.type === 'public'){
            const fromId = clients.get(ws);
            const fromName = namedClients.get(fromId) || null;
            for(let [client, id] of clients.entries()){
                if(id !== fromId)
                    client.send(JSON.stringify({type: "public_message", from: fromId, fromName, message: msg}))
            }
        }
        else if(data.type === 'private'){
            const toId = data.toId;
            const fromId = clients.get(ws);
            const fromName = namedClients.get(fromId) || null;
            for(let [client,id] of clients.entries()){
                if(id === toId)
                    client.send(JSON.stringify({type: "private_message", from: fromId, fromName, message: msg, unread: 1}))
            }
        }
        else if(data.type === 'private_image'){
            const toId = data.toId;
            const fromId = clients.get(ws);
            const fromName = namedClients.get(fromId) || null;
            for(let [client,id] of clients.entries()){
                if(id === toId)
                    client.send(JSON.stringify({
                        type: "private_image",
                        from: fromId,
                        fromName,
                        image: data.image
                    }))
            }
        }
        else if(data.type === 'exit'){
            const userId = data.id;
            for(let [client,id] of clients.entries()){
                if(id === userId){
                    clients.delete(client)
                    for(let [clientId,name] of namedClients.entries()){
                        if(clientId === userId){
                            namedClients.delete(clientId)
                        }
                    }
                }
            }
            console.log('User with ID',userId,' Left!')
            fetchAllClients(clients,namedClients)
        }
        else if(data.type === 'My_Name'){
            const name = data.name;
            const userId = clients.get(ws);
            for(let [id,named] of namedClients.entries()){
                if(named === name){
                    namedClients.delete(id)
                    for(let [conn,clientId] of clients){
                        if(clientId === id){
                            clients.delete(conn)
                        }
                    }
                }
            }
            namedClients.set(userId, name);
            console.log(namedClients);
            fetchAllClients(clients,namedClients);
        }
        else
            console.log(`Unknown Message Type: ${data.type}`)
    })
    ws.on('close',()=>{
        const userId = clients.get(ws);
        clients.delete(ws)
        namedClients.delete(userId)
        fetchAllClients(clients,namedClients)
    })
})

console.log(`WebSocket server Running on ws://localhost:${PORT}`);

module.exports = {clients,namedClients}