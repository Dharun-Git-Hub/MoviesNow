import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { setEmail, setRole } from "../../Slices/UserSlice"
import { setUsername } from "../../Slices/AdminSlice"
import { useNavigate } from "react-router-dom"

const Email = ({setValidate}) => {
    const dispatch = useDispatch()
    const [email,setEmailId] = useState('')
    const [password, setPassword] = useState('')
    const role = useSelector(state=>state.user.role)
    const navigate = useNavigate()

    useEffect(()=>{
        dispatch(setRole('User'))
        dispatch(setUsername(null))
    })
    const handleEmail = async (e) => {
        e.preventDefault()
        if(email.trim() != '' && password.trim() != ''){
            try{
                const response = await fetch('http://localhost:3000/validateEmail',{
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({email: email, password: password})
                })
                const data = await response.json()
                if(data.status === 'success'){
                    const {email,username} = data;
                    dispatch(setEmail(email))
                    dispatch(setUsername(username))
                    setValidate(true)
                }
                else{
                    alert(data.message)
                }
            }
            catch(err){
                console.log(err)
                alert('Something went wrong!')
            }
        }
        else{
            alert('Please Check out all the Fields!')
            return
        }
    }
    return (
        <div className="main-cont">
            <button onClick={()=>navigate('/signup')}>Signup</button>
            <form className="user-login-form" onSubmit={handleEmail}>
                <span>{role} Login</span>
                <input type="email" placeholder="Email" onChange={(e)=>setEmailId(e.target.value)}/>
                <input type="password" placeholder="Password" onChange={(e)=>setPassword(e.target.value)}/>
                <button type="submit">Login</button>
            </form>
        </div>
    )
}

export default Email