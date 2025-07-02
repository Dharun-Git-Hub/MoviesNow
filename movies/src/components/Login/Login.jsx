import { useState } from "react"
import { useSelector } from "react-redux"
import OTP from "../OTP/OTP"
import Email from "../Email/Email"
import AdminLog from "../Admin/AdminLog"

const Login = () => {
    const [validate,setValidate] = useState(false)
    const [methods,setMethods] = useState('login')
    const role = useSelector(state=>state.user.role)

    return (
        <div>
            {role === "User" ? 
                !validate ? 
                    <Email setValidate={setValidate}/> : <OTP setValidate={setValidate} methods={methods}/>
            :
                !validate ?
                    <AdminLog setValidate={setValidate}/> : <OTP setValidate={setValidate} methods={methods}/>
            }
        </div>
    )
}

export default Login