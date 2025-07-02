import { useDispatch, useSelector } from "react-redux"
import { useState } from "react"
import { setEmail, setUsername } from "../../Slices/UserSlice"
import { setRole } from '../../Slices/UserSlice'
import { useNavigate } from 'react-router-dom'
import { profilePics } from "../../assets/assets"

const SignupEmail = ({setValidate}) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [username, setUser] = useState('')
    const [email,setEmailId] = useState('')
    const [password, setPassword] = useState('')
    const [mobile,setMobile] = useState('')
    const [pic,setPic] = useState(null)
    const [selected,setSelected] = useState(null)
    const role = useSelector(state=>state.user.role)
    const handleEmail = async (e) => {
        e.preventDefault()
        if(email.trim() != '' && password.trim() != '' && username.trim() != '' && pic !== null){
            console.log(pic)
            try{
                const formData = new FormData()
                formData.append('username',username)
                formData.append('password',password)
                formData.append('email',email)
                formData.append('mobile',mobile)
                formData.append('image',pic)
                console.log(formData)
                const response = await fetch('http://localhost:3000/signupEmail',{
                    method: 'POST',
                    body: formData,
                })
                const data = await response.json()
                if(data.status === 'success'){
                    console.log(data)
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
                alert('Something went Wrong')
            }
        }
        else{
            alert('Please Check out all the Fields!')
            return
        }
    }
    const setTheRole = (role) => {
        dispatch(setRole(role));
        navigate('/login')
    }
    const handleMobile = (val) => {
        if(val.length <= 10 && val.length >= 0){
            if(Number(val)<=9999999999){
                setMobile(val)
            }
        }
    }
    const handleProfile = async (index) => {
        const imageUrl = profilePics[index]
        const response = await fetch(imageUrl)
        const blob = await response.blob()
        const file = new File([blob], `profile_${index}.png`, { type: blob.type })
        setPic(file)
        setSelected(index)
    }

    return (
        <div className="main-cont">
            <button onClick={()=>setTheRole('User')}>Login</button>
            <form className="user-login-form" onSubmit={handleEmail}>
                <span>{role} Signup</span>
                <input placeholder="Try a Username" onChange={(e)=>setUser(e.target.value)}/>
                <input type="email" placeholder="Email" onChange={(e)=>setEmailId(e.target.value)}/>
                <input type="password" placeholder="Try a Password" onChange={(e)=>setPassword(e.target.value)}/>
                <input type="text" placeholder="Mobile Number" value={mobile} onChange={(e)=>handleMobile(e.target.value)} required/>
                <div >
                    <label style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", fontSize: "1.2rem", margin: "20px"}}>Select An Image for your Profile</label>
                        {
                            profilePics.map((image,index)=>(
                                <img key={index} className={selected === index ? "profile-pics-signup-blur":"profile-pics-signup"} src={image} onClick={()=>handleProfile(index)}/>
                            ))
                        }
                </div>
                <button type="submit">Signup</button>
            </form>
        </div>
    )
}

export default SignupEmail