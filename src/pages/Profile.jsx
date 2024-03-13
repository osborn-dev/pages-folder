import { getAuth, updateProfile } from 'firebase/auth'
import { updateDoc, doc } from 'firebase/firestore'
import { toast } from 'react-toastify'
import { useState } from 'react'
import { db } from '../firebase.config'
import { useNavigate } from 'react-router-dom'


function Profiles() {
    const auth = getAuth()
    const navigate = useNavigate()

    // getting user's name and email from GETAUTH
    const [formData, setFormData] = useState({
      name: auth.currentUser.displayName,
      email: auth.currentUser.email
    })
    const { name, email } = formData

    const [changeDetails, setChangeDetails] = useState(false)

    // signing out and navigating to the HOME PAGE
    const onLogout = () => {
      auth.signOut()
      navigate('/')
    }
    // checks to see if the user's current name isnt = to the name that's being changed and the it updates it.
    const onsubmit = async () => {
      try {
        if (auth.currentUser.displayName !== name) {
          // Updating display name in Fire-Base
          await updateProfile(auth.currentUser, {
            displayName: name
          })
          // Updating display name in Fire-Store
          // Takes in DB from the config file...... Updating document in Fire-Store
          const userRef = doc(db, 'users', auth.currentUser.uid)
          await updateDoc(userRef, {
            name,
          })
        }
      } catch (error) {
        toast.error('Could Not Update Profile Details')
      }
    }
    // fuctinon for editing the profile
    // spreading previous state and targeting what's being changed
    const onChange = (e) => {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: e.target.value,
      }))
    }

   
    return <div className='profile'>
    <header className="profileHeader">
      <p className="pageHeader">My Profile</p>
      <button 
       type='button'
       className="logOut"
       onClick={onLogout}>
        Logout
      </button>
    </header>
    <main>
      <div className="profileDetailsHeader">
        <p className="profileDetailsText">Personal Details</p>
        {/* if the change-details is true this function fires */}
        <p className="changePersonalDetails" onClick={() => {
          changeDetails && onsubmit()
          // setting SETCHANGE-DETAILS to what it's opposite is
          setChangeDetails((prevState) => !prevState)
        }}>
          {/* text is dependent on the CHANGE-DETAILS STATE */}
          {changeDetails ? 'Done' : 'Change'}
        </p>
      </div>
      <div className="profileCard">
        <form>
          {/* css class is dependent on the CHANGE-DETAILS state */}
          <input
              type='text'
              id='name'
              className={!changeDetails ? 'profileName' : 'profileNameActive'}
              disabled={!changeDetails}
              value={name}
              onChange={onChange}
            />
            <input
              type='text'
              id='email'
              className={!changeDetails ? 'profileEmail' : 'profileEmailActive'}
              disabled={!changeDetails}
              value={email}
              onChange={onChange}
            />
        </form>
      </div>
    </main>
    </div>
  }
  
  export default Profiles