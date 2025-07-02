import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setRole } from '../../Slices/UserSlice'
import {assets} from '../../assets/assets'
import '../../styles/styles.css'
import { validateToken } from '../../Slices/ValidateSlice'

const Entry = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const role = useSelector(state=>state.user.role)
    const setTheRole = (role) => {
        dispatch(setRole(role));
        navigate('/login')
    }
    useEffect(()=>{
        if(sessionStorage.getItem('token')){
            const validated = dispatch(validateToken(sessionStorage.getItem('token'))).unwrap()
            if(validated !== 'Something went Wrong!'){
                navigate(role === 'Admin' ? '/dashboard' : '/home')
            }
        }
        else{
            sessionStorage.removeItem('username')
            sessionStorage.removeItem('role')
        }
    },[])
    return (
        <div className='main-cont'>
            <span>Who You Are?</span>
            <div className='flip-card'>
                <div className='flip-card-inner'>
                    <div className='flip-card-front'>
                        <img className='img1' src={assets.adminImg}/>
                    </div>
                    <div className='flip-card-back' onClick={()=>setTheRole('Admin')}>
                        Admin
                    </div>
                </div>
            </div>
            <div className='flip-card'>
                <div className='flip-card-inner'>
                    <div className='flip-card-front'>
                        <img className='img2' src={assets.userImg}/>
                    </div>
                    <div className='flip-card-back' onClick={()=>setTheRole('User')}>
                        User
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Entry