import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import SignupEmail from "../Email/SignupEmail"
import OTP from "../OTP/OTP"

const Signup = () => {
    const dispatch = useDispatch()
    const [validate,setValidate] = useState(false)
    const [methods,setMethods] = useState('signup')

    return (
        <div>
            { !validate ? 
            <SignupEmail setValidate={setValidate}/>
            :
            <OTP setValidate={setValidate} methods={methods}/>
            }
        </div>
    )
}

export default Signup