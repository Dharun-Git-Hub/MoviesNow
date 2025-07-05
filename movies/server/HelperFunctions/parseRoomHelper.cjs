function parseRoom(roomString){
    const parts = roomString.split('_');
    const screen = parseInt(parts[parts.length-2]);
    console.log(parts[parts.length-1])
    const showTime = decodeURIComponent(parts[parts.length-1]);
    console.log(showTime)
    const movie = parts.slice(0, parts.length-3).join('_');
    const theatre = parts[parts.length-3];
    return {
        movie,
        theatre,
        screen,
        showTime: new Date(showTime)
    };
}

module.exports = parseRoom