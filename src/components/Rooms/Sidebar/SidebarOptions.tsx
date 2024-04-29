import React, { useEffect, useState } from 'react'
import cl from '../../../styles/sidebar.module.css'
import SidebarOption from './SidebarOption'
import CreatePopup from '../../UI/CreatePopup/CreatePopup'
import Search from './Search'

interface Props {
  sidebarActive: boolean
}

const SidebarOptions: React.FC<Props> = ({ sidebarActive }) => {
  const [addPopup, setAddPopup] = useState(true)
  const [groupPopup, setGroupPopup] = useState(false)

  useEffect(() => {
    if (!sidebarActive) {
      setAddPopup(false)
      setGroupPopup(false)
    }
  }, [sidebarActive])

  return (
    <ul className={cl.options}>
      <SidebarOption text={'add user'} action={() => setAddPopup(true)} />
      <SidebarOption text={'new group'} action={() => setGroupPopup(true)} />
      <SidebarOption text={'user settings'} />
      <SidebarOption text={'ne ebu poka'} />
      {
        addPopup &&
        <Search
          setActive={setAddPopup}
        />
      }
      {
        groupPopup &&
        <CreatePopup 
          setActive={setGroupPopup}
        />
      }
    </ul>
  )
}

export default SidebarOptions