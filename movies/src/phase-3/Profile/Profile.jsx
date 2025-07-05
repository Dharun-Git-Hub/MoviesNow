import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { profilePics } from '../../assets/assets'

const Profile = () => {
    const location = useLocation()
    const user = location.state.userDetails || {}
    const profilePic = location.state.profilePic
    const [username,setUsername] = useState(user.username)
    const [email, setEmail] = useState(user.email)
    const [mobile, setMobile] = useState(user.mobile)
    const [selected,setSelected] = useState(null)
    const [pic, setPic] = useState(null)
    const navigate = useNavigate()

    useEffect(()=>{
        if(!sessionStorage.getItem('token')){
            alert('Login First to Continue!')
            navigate('/')
        }
    },[])
    
    const handleProfile = async (index) => {
        const imageUrl = profilePics[index]
        const response = await fetch(imageUrl)
        const blob = await response.blob()
        const file = new File([blob], `profile_${index}.png`, { type: blob.type })
        setPic(file)
        setSelected(index)
    }

    const updateProfile = async () => {
        if(username.trim() != '' && email.trim() != '' && pic){
        try{
            const userDetails = new FormData()
            userDetails.append('username',username)
            userDetails.append('email',email)
            userDetails.append('mobile',mobile)
            userDetails.append('image',pic)
            const response = await fetch('http://localhost:3000/users/updateProfile',{
                method: 'POST',
                body: userDetails,
            })
            const data = await response.json()
            console.log(data)
            if(data.status === 'success'){
                alert('Profile Updated Successfully')
                navigate(-1)
            }
            else{
                alert(data.message)
            }
        }
        catch(err){
            console.log(err)
            alert('Something went Wrong!')
        }
    }
    else{
        alert('Please fill-up all the Fields!')
    }
    }
    return (
        <div className='change-dtls' style={{display: "flex",gap: "20px", justifyContent: "center", flexDirection: "column", alignItems: "center"}}>
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
            <input style={{outline: "none", boxShadow: "0 0.2rem 1rem grey"}} placeholder='Username' value={username} onChange={(e)=>setUsername(e.target.value)}/>
            <input style={{outline: "none", boxShadow: "0 0.2rem 1rem grey"}} placeholder='Email' type="email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
            <input style={{outline: "none", boxShadow: "0 0.2rem 1rem grey"}} placeholder='Mobile' type="number" value={mobile} onChange={(e)=>setMobile(e.target.value)}/>
            <div>
                <label style={{display: "flex", flexDirection: "column", justifyContent: "center",  fontSize: "1.2rem", margin: "20px"}}><span className='trend-desc' style={{color: "#333"}}>Select An Image for your Profile</span></label>
                    {
                        profilePics.map((image,index)=>(
                            <img key={index} className={selected === index ? "profile-pics-signup-blur":"profile-pics-signup"} style={{width: "100px", height: "100px"}} src={image} onClick={()=>handleProfile(index)}/>
                        ))
                    }
            </div>
            <button style={{backgroundColor: "#ff2976", border: "none", padding: "0.5rem", color: "white", borderRadius: "0.4rem", cursor: "pointer"}} onClick={updateProfile}>Update Profile</button>
        </div>
    )
}

export default Profile