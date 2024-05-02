import React from 'react'
import cl from '../../styles/sidebar.module.css'
import BurgerMenu from '../UI/Menu/BurgerMenu'
import SidebarMenu from './Sidebar/SidebarMenu'
import Search from './Sidebar/Search'

interface Props {
  name: string
  setName: React.Dispatch<React.SetStateAction<string>>
  active: boolean
  setActive: React.Dispatch<React.SetStateAction<boolean>>
  setShowGroup: React.Dispatch<React.SetStateAction<boolean>>
  setShowDirect: React.Dispatch<React.SetStateAction<boolean>>
}

const Sidebar: React.FC<Props> = ({ name, setName, active, setActive, setShowGroup, setShowDirect }) => {
  return (
    <div className={cl.sidebar}>
      <div
        onClick={() => setActive(false)}
        className={active ? [cl.sidebarBg, cl.active].join(' ') : cl.sidebarBg}
      />
      <BurgerMenu active={active} setActive={setActive} />
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className={cl.filterInput}
      />
      <SidebarMenu 
        active={active}
        setActive={setActive} 
        setShowGroup={setShowGroup}
        setShowDirect={setShowDirect}
      />
    </div>
  )
}
export default Sidebar