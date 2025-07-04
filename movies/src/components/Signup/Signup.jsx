import { useState } from "react"
import { useDispatch } from "react-redux"
import SignupEmail from "../Email/SignupEmail"
import OTP from "../OTP/OTP"

const Signup = () => {
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