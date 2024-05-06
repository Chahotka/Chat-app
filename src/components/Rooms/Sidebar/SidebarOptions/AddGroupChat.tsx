import React, { lazy, useEffect, useRef, useState } from 'react'
import cl from '../../../../styles/add-chat.module.css'
import CustomSelect from '../../../UI/CustomSelect/CustomSelect'
import Button from '../../../UI/Button/Button'
import ErrorPopup from '../../../UI/ErrorPopup/ErrorPopup'
import { useAddUser } from '../../../hooks/useAddUser'
import Loader from '../../../UI/Loader/Loader'
import { useAddGroup } from '../../../hooks/useAddGroup'
import { useAppSelector } from '../../../../app/hooks'
import RoomSelect from './RoomSelect'
import { RoomUser } from '../../../../interfaces/RoomUser'
import { GroupUser } from '../../../../interfaces/GroupUser'
import { useFilter } from '../../../hooks/useFilter'

type Room = (RoomUser | GroupUser)[]

interface Props {
  setActive: React.Dispatch<React.SetStateAction<boolean>>
}

const AddGroupChat: React.FC<Props> = ({ setActive }) => {
  const userState = useAppSelector(state => state.user)

  const [groupName, setGroupName] = useState('')
  const [filterText, setFilterText] = useState<string>('')
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])

  const { filteredRooms } = useFilter(filterText, userState.rooms)
  const { fetching, loading, error, showError } = useAddGroup(userState.id, selectedUsers, groupName, setActive)

  const bg = useRef<HTMLDivElement>(null)
  const bgHandler = (e: React.MouseEvent) => {
    if (e.target !== bg.current) {
      return
    }
    setActive(false)
  }

  return (
    <div ref={bg} onClick={(e) => bgHandler(e)} className={cl.addWrapper}>
      <div className={cl.add}>
        <div onClick={() => setActive(false)} className={cl.cross}></div>
        <p className={cl.addText}>Create Group</p>
        <ErrorPopup wrapStyles={{top: '125px'}} showError={showError} error={error} />
        { !loading &&
          <input 
            type="text" 
            className={cl.filterUsers}
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            maxLength={15}
            placeholder='Group Name'
          />
        }
        { loading
          ?<Loader 
            size={'normal'}
            addStyles={{
              top: '50%',
              transform: 'translateY(-50%)',
              position: 'absolute'
            }}
          />
          :<div className={cl.usersList}>
            <input 
              type="text" 
              className={cl.filterUsers}
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder='Filter users'
            />
            <ul className={cl.select}>
              {filteredRooms.map(room =>
                room.type === 'direct' && 
                <RoomSelect key={room.roomId} setSelected={setSelectedUsers} room={room}/>
              )}
            </ul>
          </div>
          }
        <Button 
          text='create group' 
          styles={{ 
            bottom: '30px',
            width: '170px',
            fontSize: '13px',
            position: 'absolute',
            zIndex: '0'
          }} 
          action={fetching}
        />
      </div>
    </div>
  )
}

export default AddGroupChat