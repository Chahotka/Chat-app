import React, { useState } from 'react'
import cl from '../UI/Avatar/avatar.module.css'
import Avatar from 'react-avatar-edit'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { changeAvatar } from '../../features/user/UserSlice'
import Button from '../UI/Button/Button'

interface Props {
  setChangeAvatar: React.Dispatch<React.SetStateAction<boolean>>
}

const AvatarEditor: React.FC<Props> = ({setChangeAvatar}) => {
  const [preview, setPreview] = useState('')

  const avatar = useAppSelector(state => state.user.avatar)
  const dispatch = useAppDispatch()

  const onCrop = (image: string) => {
    setPreview(image)
  }

  const onClose = () => {
    setPreview('')
    setChangeAvatar(false)
  }

  const onSave = () => {
    dispatch(changeAvatar(preview))
    setChangeAvatar(false)
  }

  return (
    <>
      <div className={cl.avatarContainer}>
        { preview && <img className={cl.avatar} src={preview}/> }
      </div>
      <Avatar 
        width={300}
        height={300}
        onCrop={onCrop}
        onClose={onClose}
        labelStyle={{color: '#fff', width: '100%', display: 'block'}}
      />
      <Button text='save' action={onSave} styles={{justifySelf: 'center'}}/>
    </>
  )
}

export default AvatarEditor