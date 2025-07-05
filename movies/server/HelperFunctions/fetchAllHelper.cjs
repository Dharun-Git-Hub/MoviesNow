const fetchAllClients = (clients,namedClients) => {
    const users = Array.from(clients.values())
    const namelist = users.map((id) => ({
        id, name: namedClients.get(id) || null
    }))
    for(let client of clients.keys())
        client.send(JSON.stringify({type: "users_list", list: namelist}))
}

module.exports = fetchAllClients