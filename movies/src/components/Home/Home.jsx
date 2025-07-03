import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loadMovies } from '../../Slices/MoviesSlice'
import TrendCard from '../TrendCard/TrendCard'
import MovieCard from '../MovieCard/MovieCard'
import { loadTheatres } from '../../Slices/TheatreSlice'
import TheatreCard from '../TheatreCard/TheatreCard'
import { getUserDetails, setRole } from '../../Slices/UserSlice'
import { useNavigate } from 'react-router-dom'
import { validateToken } from '../../Slices/ValidateSlice'
import { clear } from '../../Slices/ClientNotify'

const Home = ({ws}) => {
    const username = useSelector(state => state.user.username)
    const dispatch = useDispatch()
    const [movies, setMovies] = useState([])
    const [theatres, setTheatres] = useState([])
    const [mainIndex, setMainIndex] = useState(0)
    const [profilePic, setProfilePic] = useState(null)
    const [expanded,setExpanded] = useState(false)
    const [userDetails,setUserDetails] = useState({})
    const [unread,setUnread] = useState(0)
    const role = sessionStorage.getItem('role') || useSelector(state => state.user.role)
    const count = useSelector(state=>state.client.count)
    const navigate = useNavigate()

    const trendRefs = useRef([])

    useEffect(()=>{
        setUnread(count)
    },[count])

    useEffect(()=>{
        const doFirst = async () => {
            try{
                const result = await dispatch(validateToken(sessionStorage.getItem('token'))).unwrap()
                if(result === 'Something went Wrong!'){
                    sessionStorage.removeItem('token')
                    alert('Session Timeout Please Login !')
                }
            }
            catch(err){
                console.log(err)
                sessionStorage.removeItem('token')
                alert('Session Timeout Please Login !')
                navigate('/')
            }
        }
        doFirst()
    },[])

    useEffect(()=>{
        if(role === 'Admin'){
            navigate('/dashboard')
        }
    },[role])

    useEffect(()=>{
        if(!sessionStorage.getItem('token')){
            alert('Login First to Continue!')
            navigate('/')
        }
    },[])

    useEffect(()=>{
        const getUserdtls = async () => {
            const response = await dispatch(getUserDetails(sessionStorage.getItem('username'))).unwrap()
            console.log(response)
            if (response && response.details.pic && response.details.pic.data) {
                setUserDetails(response.details)
                const byteArray = new Uint8Array(response.details.pic.data)
                const blob = new Blob([byteArray], { type: 'image/png' })
                const reader = new FileReader()
                reader.onloadend = () => {
                    setProfilePic(reader.result)
                }
                reader.readAsDataURL(blob)
            }
        }
        getUserdtls()
    },[])

    useEffect(() => {
        const getMovies = async () => {
            const response = await dispatch(loadMovies()).unwrap()
            setMovies(response.list)
        }
        getMovies()
    }, [])

    useEffect(() => {
        const getTheatres = async () => {
            const response = await dispatch(loadTheatres()).unwrap()
            setTheatres(response.list)
        }
        getTheatres()
    }, [])

    useEffect(() => {
        if (movies.length === 0) return

        const interval = setInterval(() => {
            setMainIndex(prev => (prev + 1) % movies.length)
        }, 5000)

        return () => clearInterval(interval)
    }, [movies.length])

    useEffect(() => {
        const currentCard = trendRefs.current[mainIndex]
        if (currentCard) {
            const container = document.querySelector('.home-top-cont')
            const cardRect = currentCard.getBoundingClientRect()
            const containerRect = container.getBoundingClientRect()

            const scrollOffset = cardRect.left - containerRect.left - window.innerWidth * 0.02
            container.scrollBy({
                left: scrollOffset,
                behavior: 'smooth'
            })
        }
    }, [mainIndex])

    const handleSignout = () => {
        const prompt = confirm('Are you sure to Signout?')
        if(prompt){
            sessionStorage.removeItem('token')
            sessionStorage.removeItem('username')
            sessionStorage.removeItem('email')
            dispatch(setRole(null))
            navigate('/')
        }
        return;
    }

    return (
        <div className='home-cont'>
                <div className='home-top-nav'>
                    <span>Movies</span>
                    <div>
                        <img
                            src={profilePic}
                            alt="Profile"
                            style={{
                                width: '30px',
                                height: '30px',
                                borderRadius: '50%',
                                marginRight: '10px',
                                cursor: 'pointer'
                            }}
                            onMouseEnter={()=>setExpanded(true)}
                            onMouseLeave={()=>setExpanded(false)}
                        />
                        {unread > 0 && <span className='notify-count'>{unread > 0 && unread}</span>}
                    </div>
                </div>
                {expanded &&
                    <div className='expanded' onMouseEnter={()=>setExpanded(true)} onMouseLeave={()=>setExpanded(false)}>
                        <img
                        src={profilePic}
                        alt="Profile"
                        style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            marginTop: "10px"
                        }}/>
                        <button style={{backgroundColor: "transparent", color: "grey", border: "none", cursor: "pointer"}} onClick={()=>navigate('/editProfile',{state: {userDetails,profilePic: profilePic}})}>Edit</button>
                            <span>{sessionStorage.getItem('username')}</span>
                            <span>Email: {" "}{userDetails.email}</span>
                            <span>Mobile: {" "}{userDetails.mobile}</span>
                            <div className='expanded-div'>
                                <button onClick={handleSignout}>Sign out</button>
                                <button onClick={()=>{dispatch(clear());navigate('/queries');}}>Support <span className='trend-lang'>{unread > 0 && unread}</span></button>
                                <button onClick={()=>navigate('/history')}>History</button>
                            </div>
                    </div>
                }
                <div className='overflow-cont'>
                    <div className='home-top-cont' style={{ overflowX: 'auto', display: 'flex', gap: '1rem' }}>
                    {
                        movies.map((movie, index) => (
                            <TrendCard
                                key={index}
                                movie={movie}
                                isMain={index === mainIndex}
                                ref={el => trendRefs.current[index] = el}
                            />
                        ))
                    }
                    </div>
                </div>
                <div className='home-body-cont'>
                    {
                        [...movies].reverse().map((movie, index) => (
                            <MovieCard key={index} movie={movie} />
                        ))
                    }
                </div>
                <h1 className='theatres-h2'>Theatres</h1>
                <div className='home-body-cont'>
                    {
                        theatres.map((theatre, index) => (
                            <TheatreCard key={index} theatre={theatre} />
                        ))
                    }
                </div>
        </div>
    )
}

export default Home
