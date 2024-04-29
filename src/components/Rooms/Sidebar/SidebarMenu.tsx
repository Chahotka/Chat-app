import React from 'react'
import cl from '../../../styles/sidebar.module.css'
import SidebarOptions from './SidebarOptions'

interface Props {
  active: boolean
  setActive: React.Dispatch<React.SetStateAction<boolean>>
}

const SidebarMenu: React.FC<Props> = ({ active, setActive}) => {

  return (
    <div className={active ? [cl.sidebarMenu, cl.active].join(' ') : cl.sidebarMenu}>
      <SidebarOptions sidebarActive={active}/>
    </div>
  )
}

export default SidebarMenu