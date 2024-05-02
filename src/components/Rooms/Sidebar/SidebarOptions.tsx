import React, { useEffect, useState } from 'react'
import cl from '../../../styles/sidebar.module.css'
import SidebarOption from './SidebarOption'
import CreatePopup from '../../UI/CreatePopup/CreatePopup'
import Search from './Search'

interface Props {
  sidebarActive: boolean
  setShowGroup: React.Dispatch<React.SetStateAction<boolean>>
  setShowDirect: React.Dispatch<React.SetStateAction<boolean>>
}

const SidebarOptions: React.FC<Props> = ({ sidebarActive, setShowGroup, setShowDirect }) => {

  return (
    <ul className={cl.options}>
      <SidebarOption text={'add user'} action={() => setShowDirect(true)} />
      <SidebarOption text={'new group'} action={() => setShowGroup(true)} />
      <SidebarOption text={'user settings'} />
      <SidebarOption text={'ne ebu poka'} />
    </ul>
  )
}

export default SidebarOptions