import React, { useRef, useState } from 'react'
import cl from './create-popup.module.css'
import { useAppSelector } from '../../../app/hooks'
import Button from '../Button/Button'
import Room from './Room'
import { useFetch } from '../../hooks/useFetch'
import { v4 } from 'uuid'

export type AddHandler = (name: string, add: boolean, setSelected: React.Dispatch<React.SetStateAction<boolean>>) => void

interface Props {
  setActive: React.Dispatch<React.SetStateAction<boolean>>
}

const CreatePopup: React.FC<Props> = ({ setActive }) => {
  const user = useAppSelector(state => state.user)

  const [error, setError] = useState('')
  const [isSelected, setIsSelected] = useState(false)
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const bg = useRef<HTMLDivElement>(null)

  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({groupId: v4(), creator: user.id, selectedUsers})
  }

  const bgClickHandler = (e: React.MouseEvent) => {
    if (e.target !== bg.current) {
      return
    }

    setActive(false)
  }
  const addHandler: AddHandler = (name, add, setSelected) => {
    if (add) {
      setSelected(true)
      setSelectedUsers(prev => [...prev, name])
    } else {
      setSelected(false)
      setSelectedUsers(prev => 
        prev.filter(user => user !== name)
      )
    }
  }

  const createGroup = async () => {
    await fetch('http://localhost:5000/create-group', fetchOptions)
  }


  return (
    <div 
      ref={bg}
      className={cl.createWrapper}
      onClick={(e) => bgClickHandler(e)}
    >
      <div className={cl.create}>
        <div onClick={() => setActive(false)} className={cl.close}></div>
        <p className={cl.createText}>New Group</p>
        <ul className={cl.roomsList}>
          {user.rooms.map(room => {
            if (room.type === 'direct' && typeof room.id === 'string')
              return <Room key={room.id} room={room} addHandler={addHandler}/>
          })}
        </ul>
        <Button 
          text={'create group'}
          action={createGroup}
          styles={{
            marginTop: '20px',
            width: '150px',
            height: '30px',
            fontSize: '12px',
            zIndex: '1'
          }}
        />
      </div>
    </div>
  )
}

export default CreatePopup