import React, { useState } from 'react'
import cl from './profile-picture.module.css'
import clAuth from '../../../styles/auth.module.css'
import Avatar from 'react-avatar-edit'
import Button from '../Button/Button'
import { useProfileContext } from '../../../context/ProfileContext'


interface Props {
  setChangePfp: React.Dispatch<React.SetStateAction<boolean>>
}

const ProfilePicture: React.FC<Props> = ({setChangePfp}) => {
  const [image, setImage] = useState('')
  const [preview, setPreview] = useState('')

  const { pfp, setPfp } = useProfileContext()

  const onCrop = (image: string) => {
    setPreview(image)
    setImage(image)
  }

  const onClose = () => {
    setPreview('')
  }

  const onSave = () => {
    setPfp(image)
    setChangePfp(false)
  }


  return (
    <div className={cl.crooper}>
    { preview 
      ? <div className={cl.preview}>
          <img className={cl.image} src={preview} />
        </div>
      : pfp
        ? <div className={cl.preview}>
            <img className={cl.image} src={pfp} />
          </div>
        : <div className={cl.preview}></div>
    }
      <Avatar 
        width={300}
        height={300}
        onCrop={onCrop}
        onClose={onClose}
      />
      {
        preview && <Button text='save' action={onSave}/>
      }
    </div>
  )
}

export default ProfilePicture