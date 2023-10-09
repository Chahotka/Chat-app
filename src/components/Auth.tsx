import React, { useState } from 'react'
import cl from '../styles/auth.module.css'
import Form from './UI/Form/Form'
import ProfilePicture from './UI/Avatar/ProfilePicture'
import { useProfileContext } from '../context/ProfileContext'
import pen from '../images/pen.svg'


const Auth: React.FC = () => {
  const [changePfp, setChangePfp] = useState(false)
  const { pfp } = useProfileContext()

  return (
    <div className={cl.auth}>
      <h1 className={cl.title}>Create your profile</h1>
      { changePfp
        ? <ProfilePicture setChangePfp={setChangePfp} />
        : <div onClick={() => setChangePfp(true)} className={cl.prof}>
            {pfp && <img className={cl.image} src={pfp} />}
            <img className={cl.pen} src={pen} />
          </div>
      }
      { !changePfp && <Form />}
    </div>
  )
}

export default Auth