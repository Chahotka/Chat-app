import React, { useState } from 'react'
import cl from '../../styles/sidebar.module.css'
import Menu from '../UI/Menu/Menu'
import AddRoom from './AddRoom'

interface Props {
  name: string
  setName: React.Dispatch<React.SetStateAction<string>>
}

const Sidebar: React.FC<Props> = ({ name, setName }) => {
  const [active, setActive] = useState(false)

  return (
    <>
      <Menu 
        name={name} 
        setName={setName} 
        active={active} 
        setActive={setActive}
      />
      <div className={ active? [cl.sidebarBg, cl.active].join(' ') : cl.sidebarBg} onClick={() => setActive(false)}>
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