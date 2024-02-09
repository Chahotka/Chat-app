import React from 'react'
import cl from '../../styles/sidebar.module.css'
import Menu from '../UI/Menu/Menu'

interface Props {
  name: string
  setName: React.Dispatch<React.SetStateAction<string>>
  active: boolean
  setActive: React.Dispatch<React.SetStateAction<boolean>>
}

const Sidebar: React.FC<Props> = ({ name, setName, active, setActive }) => {
  return (
    <>
      <Menu 
        name={name} 
        setName={setName} 
        active={active} 
        setActive={setActive}
      />
      <div 
        className={ active 
          ? [cl.sidebarBg, cl.active].join(' ') 
          : cl.sidebarBg} 
        
        onClick={() => setActive(false)}
      >
      </div>
      <div 
        className={ active
          ? [cl.sidebar, cl.active].join(' ')
          : cl.sidebar
        }
        style={{paddingTop: '60px'}}
      >
      </div>
    </>
  )
}

export default Sidebar