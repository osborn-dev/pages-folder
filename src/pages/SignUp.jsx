import { useState } from "react"
import {getAuth, createUserWithEmailAndPassword, updateProfile} from 'firebase/auth'
import {toast} from 'react-toastify'
import {setDoc, doc, serverTimestamp} from 'firebase/firestore'
import {db} from '../firebase.config'
import { Link, useNavigate } from "react-router-dom"
import {ReactComponent as ArrowRightIcon} from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'
import OAuth from "../components/OAuth";

function SignUp() {
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      password: '',
  })

    const {name, email, password} = formData

    const navigate = useNavigate()

  	const onChange = (e) => {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: e.target.value,
      }))
    }

    const onSubmit = async (e) => {
      e.preventDefault()

      try {
        // getting firebase authentication to register/signup a user
        const auth = getAuth()
        // registering the user
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
         )
        //  getting user info
         const user = userCredential.user
        //  getting the current user & updating display name
         updateProfile(auth.currentUser, {
          displayName: name
         })

        //  saving user to firestore cloud & excluding the password
        const formDataCopy = {...formData}
        delete formDataCopy.password
        formDataCopy.timestamp = serverTimestamp()
        //  updating firestore database and adding to collection
        await setDoc(doc(db, 'users', user.uid), formDataCopy)

      //  redirecting to the profile page
        navigate('/')

      } catch (error) {
        toast.error('Something Went Wrong')
      }
    }

    return (
      <>
      <div className="pageContainer">
        <header>
          <p className="pageHeader">Welcome Back!</p>
        </header>
          <form onSubmit={onSubmit}>
          <input type="text" 
            className="nameInput" 
            placeholder="name" 
            id="name" 
            value={name} 
            onChange={onChange} />

            <input type="email" 
            className="emailInput" 
            placeholder="email" 
            id="email" 
            value={email} 
            onChange={onChange} />

          <div className="passwordInputDiv">
            <input type={showPassword ? 'text' : 'password'} className="passwordInput" 
            placeholder="password" 
            id="password" 
            value={password} 
            onChange={onChange} />

            <img src={visibilityIcon} alt="show password" className="showPassword" onClick={() => setShowPassword((prevState) => !prevState)} />
          </div>

          <Link to='/forgot-password' className="forgotPasswordLink">
            Forgot Password
          </Link>

          <div className="signInBar">
            <p className="signInText">
              Sign Up
            </p>
            <button className="signInButton">
              <ArrowRightIcon fill="#ffffff" width='34px' height='34px' />
            </button>
          </div>
          </form>

          <OAuth />

          <Link to='/signin' className="registerLink">
            Sign In Instead
          </Link>
      </div>
      </>
    )
  }
  
  export default SignUp