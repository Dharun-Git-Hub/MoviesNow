import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { adminLogin, setUsername } from '../../Slices/AdminSlice'
import { setEmail, setRole } from '../../Slices/UserSlice'

const AdminLog = ({setValidate}) => {
    const [email,setEmailId] = useState('')
    const [password,setPassword] = useState('')
    const dispatch = useDispatch()
    const role = useSelector(state=>state.user.role)

    useEffect(()=>{
        dispatch(setUsername('Admin'))
        dispatch(setRole('Admin'))
    },[])

    const handleAdmin = async (e) => {
        e.preventDefault()
        try{
            const response = await dispatch(adminLogin({email: email, password: password})).unwrap()
            if(response === "Something went Wrong"){
                alert(response)
                return;
            }
            else{
                console.log(response.email)
                dispatch(setEmail(response.email))
                setValidate(true)
            }
        }
        catch(err){
            alert(err)
            console.log(err)
        }
    }
    return (
        <div className='main-cont'>
            <form className='user-login-form' onSubmit={handleAdmin}>
                <span>{role} Login</span>
                <input placeholder='Email' type='email' onChange={(e)=>setEmailId(e.target.value)}/>
                <input placeholder='Password' type='password' onChange={(e)=>setPassword(e.target.value)}/>
                <button type='submit'>Login</button>
            </form>
        </div>
    )
}

export default AdminLog