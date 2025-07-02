import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Entry from './components/Entry/Entry'
import Login from './components/Login/Login'
import Signup from './components/Signup/SIgnup'
import Home from './components/Home/Home'
import Dashboard from './components/Dashboard/Dashboard'
import Movie from './components/Movie/Movie'
import Theatre from './components/Theatre/Theatre'
import Add from './phase-2/Movies-Ad/Add'
import Controls from './phase-2/Movies-Ad/Controls'
import Update from './phase-2/Movies-Ad/Update'
import ControlsT from './phase-2/Theatres-Ad/Controls'
import UpdateT from './phase-2/Theatres-Ad/Update'
import Book from './phase-3/Book/Book'
import Profile from './phase-3/Profile/Profile'
import History from './phase-3/History/History'
import Preview from './phase-3/Book/Preview'
import Queries from './phase-3/Queries/Queries'
import QueriesAd from './phase-3/Queries/Queries-Ad'
import { NotificationProvider } from './Context/NotificationContext'
import NotificationDisplay from './components/NotificationDisplay'

const App = () => {
    return (
        <BrowserRouter>
            <NotificationProvider>
                <Routes>
                    <Route path="/" element={<Entry/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/signup" element={<Signup/>}/>
                    <Route path="/home" element={<Home/>}/>
                    <Route path="/dashboard" element={<Dashboard/>}/>
                    <Route path='/movie' element={<Movie/>}/>
                    <Route path='/theatre' element={<Theatre/>}/>
                    <Route path='/Add-Movie' element={<Add/>}/>
                    <Route path="/Update-Movie" element={<Update/>}/>
                    <Route path="/controls-movie" element={<Controls/>}/>
                    <Route path="/controls-theatre" element={<ControlsT/>}/>
                    <Route path='/Update-Theatre' element={<UpdateT/>}/>
                    <Route path='/booking' element={<Book/>}/>
                    <Route path='/preview' element={<Preview/>}/>
                    <Route path="/editProfile" element={<Profile/>}/>
                    <Route path="/history" element={<History/>}/>
                    <Route path='/queries' element={<Queries/>}/>
                    <Route path='/queriesAd' element={<QueriesAd/>}/>
                    <Route path="*" element={<Entry/>}/>
                </Routes>
                <NotificationDisplay/>
            </NotificationProvider>
        </BrowserRouter>
    )
}

export default App