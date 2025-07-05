import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setEmail, setRole, setUsername } from "../../Slices/UserSlice";
import { useNavigate } from "react-router-dom";
import { validateToken } from "../../Slices/ValidateSlice";

const OTP = ({setValidate,methods}) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [otp,setOTP] = useState('');
    const email = useSelector(state=>state.user.email)
    const role = useSelector(state=>state.user.role)
    const handleOTPSubmit = async(e) => {
        e.preventDefault()
        if(otp.trim() != ''){
            try{
                const response = await fetch('http://localhost:3000/users/verifyOTP',{
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({otp: otp, email: email, methods: methods})
                })
                const data = await response.json()
                console.log(data)
                if(data.status === 'success'){
                    if(methods === 'login'){
                        if(data.username.trim() != ''){
                            const validated = await dispatch(validateToken(data.token)).unwrap()
                            console.log(validated)
                            if(validated === 'Something went Wrong!'){
                                setUsername('')
                                setRole('')
                                setEmail('')
                                alert('Session Ended! Login to Continue');
                                navigate('/')
                            }
                            else{
                                setValidate(false)
                                dispatch(setUsername(validated.details.username))
                                dispatch(setRole(role))
                                sessionStorage.setItem('role',role)
                                sessionStorage.setItem('username',validated.details.username)
                                navigate(role === 'Admin' ? '/dashboard' : '/home')
                            }   
                        }
                    }
                    else{
                        const validated = await dispatch(validateToken(data.token)).unwrap()
                            console.log(validated)
                            if(validated === 'Something went Wrong!'){
                                setUsername('')
                                setRole('')
                                setEmail('')
                                alert('Session Ended! Login to Continue');
                                navigate('/')
                            }
                            else{
                                setValidate(false)
                                dispatch(setUsername(validated.details.username))
                                dispatch(setRole(role))
                                sessionStorage.setItem('role',role)
                                sessionStorage.setItem('username',validated.details.username)
                                navigate(role === 'Admin' ? '/dashboard' : '/home')
                            }
                    }
                }
                else{
                    if(data.status === 'pending'){
                        alert(data.message);
                        setOTP('');
                    }
                    else{
                        alert(data.message)
                    }
                }
            }
            catch(err){
                console.log(err)
                alert('Something went wrong!')
            }
        }
        else{
            alert('Please Enter the OTP First!')
        }
    }
    return (
        <div className="main-cont">
            <form className="user-login-form" onSubmit={handleOTPSubmit}>
                <span>OTP Validation</span>
                <input type="number" placeholder="OTP" onChange={(e)=>setOTP(e.target.value)}/>
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}

export default OTP