import { useState, useEffect, useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { MoviesControl, TheatresControl } from '../../phase-3/Control/ControlPanel'
import { noOfTheatres } from '../../Slices/DashSlice'
import MovieTable from '../../phase-3/Tables/MovieTable'
import TheatreTable from '../../phase-3/Tables/TheatreTable'
import TicketTable from '../../phase-3/Tables/TicketTable'
import { getResolved, setPending } from '../../Slices/ResolveSlice'
import { NotificationContext } from '../../Context/NotificationContext'

const Dashboard = () => {
    const role = useSelector(state=>state.user.role)
    const dispatch = useDispatch()
    console.log('Role: ',role)
    const navigate = useNavigate()
    const [theatresCount,setTheatresCount] = useState(0)
    const [moviesCount, setMoviesCount] = useState(0)
    const [ticketsCount, setTicketsCount] = useState(0)
    const [castingList, setCastingList] = useState([])
    const [showTheatres, setShowTheatres] = useState(false)
    const [showMovies,setShowMovies] = useState(false)
    const [showTickets,setShowTickets] = useState(false)
    const [theatreCasting,setTheatreCasting] = useState([])
    const [showsList,setShowsList] = useState([])
    const [unread,setUnread] = useState(0)
    const [data,setData] = useState([])
    const [solved,setSolved] = useState([])
    const count = useSelector(state=>state.resolve.pending)
    const resolved = useSelector(state=>state.resolve.resolved)
    const {msg} = useContext(NotificationContext)

    useEffect(()=>{
        setUnread(count)
    },[count])

    useEffect(()=>{
        const getQueries = async () => {
            try{
                const response = await fetch('http://localhost:3000/getQueries')
                const data = await response.json()
                console.log(data)
                setSolved(data.list.filter((el)=>el.resolved === true))
                setData(data.list.filter((el)=>el.resolved === false))
            }
            catch(err){
                console.log(err)
                alert('Something went Wrong!')
            }
        }
        getQueries()
    },[msg])

    useEffect(()=>{
        console.log(data.length)
        dispatch(setPending(data.length))
        dispatch(getResolved(solved.length))
    },[data,solved])

    useEffect(()=>{
        if(!sessionStorage.getItem('token')){
            alert('Login First to Continue!')
            navigate('/')
        }
    },[])

    useEffect(()=>{
        const doFirst = async () => {
            const response = await dispatch(noOfTheatres()).unwrap()
            console.log(response)
            setTheatresCount(response.data.theatresCount)
            setMoviesCount(response.data.moviesCount)
            setTicketsCount(response.data.ticketsCount)
            setCastingList(response.data.castingCount)
            setTheatreCasting(response.data.theatreCasting)
            setShowsList(response.data.showsList)
        }
        doFirst()
    },[])
    return (
        <div style={{backgroundColor: "#1a1a2e"}}>
            <div className='dash-topbar'>
                <span>Dashboard</span>
                <button className='positioning' onClick={()=>navigate('/queriesHistory')}>History</button>
            </div>
            <div className='dash-body'>
                <div className='flip-card-dash'>
                    <div className='flip-card-dash-inner'>
                        <div className='flip-card-dash-front'>
                            <span className='trend-name'>Theatres</span>                     
                        </div>
                        <div className='flip-card-dash-back' onClick={()=>{setShowTheatres(true); setShowMovies(false); setShowTickets(false);}}>
                            <span className='trend-name'>{theatresCount}</span>
                        </div>
                    </div>
                </div>
                <div className='flip-card-dash'>
                    <div className='flip-card-dash-inner'>
                        <div className='flip-card-dash-front'>
                            <span className='trend-name'>Movies</span>
                        </div>
                        <div className='flip-card-dash-back' onClick={()=>{setShowMovies(true); setShowTheatres(false); setShowTickets(false);}}>
                            <span className='trend-name'>{moviesCount}</span>
                        </div>
                    </div>
                </div>
                <div className='flip-card-dash'>
                    <div className='flip-card-dash-inner'>
                        <div className='flip-card-dash-front'>
                            <span className='trend-name'>Tickets</span>
                        </div>
                        <div className='flip-card-dash-back' onClick={()=>{setShowTickets(true); setShowMovies(false); setShowTheatres(false);}}>
                            {ticketsCount}
                        </div>
                    </div>
                </div>
                <div className='flip-card-dash'>
                    <div className='flip-card-dash-inner'>
                        <div className='flip-card-dash-front'>
                            <span className='trend-name'>Queries</span>
                            {unread > 0 && <span className='notify-count-dash'>{unread}</span>}
                        </div>
                        <div className='flip-card-dash-back'
                            style={{flexDirection: "column"}}
                            onClick={()=>{
                                setShowTickets(true);
                                setShowMovies(false);
                                setShowTheatres(false);
                                navigate('/queriesAd');
                        }}>
                            <span>Pending: {unread > 0 && unread || 0}</span>
                            <span>Resolved: {resolved}</span>
                        </div>
                    </div>
                </div>
            </div>
            {showMovies && <><MoviesControl/><MovieTable movies={castingList}/></>}
            {showTheatres && <><TheatresControl/><TheatreTable theatres={theatreCasting} showsList={showsList}/></>}
            {showTickets && <TicketTable/>}
            {
            !showTheatres && !showMovies && !showTickets && 
                <div style={{width: "100vw", height: "70vh", backgroundColor: "black", position: "absolute", top: "40vh"}}>
                    <span className='trend-name' style={{position: "absolute", top: "30vh", left: "40vw"}}>Welcome, Admin!</span>
                </div>
            }
        </div>
    )
}

export default Dashboard