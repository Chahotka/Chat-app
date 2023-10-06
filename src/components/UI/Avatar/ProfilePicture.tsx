import React, { useState } from 'react'
import cl from './profile-picture.module.css'
import Avatar from 'react-avatar-edit'



const ProfilePicture: React.FC = () => {
  const [image, setImage] = useState()
  const [preview, setPreview] = useState('')

  const onCrop = (image: string) => {
    setPreview(image)
  }

  const onClose = () => {
    setPreview('')
  }

  const onFileLoad = (file: any) => {
    console.log(file)
  }

  
  return (
    <div className={cl.crooper}>
      <Avatar 
        width={350}
        height={300}
        onCrop={onCrop}
        onClose={onClose}
        onFileLoad={(file) => onFileLoad(file)}
      />
      { preview 
        ? <img className={cl.preview} src={preview} />
        : <div className={cl.preview}></div>
      }
    </div>
  )
}

export default ProfilePicture