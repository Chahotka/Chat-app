import React, { useEffect } from 'react'
import cl from '../../styles/sidebar.module.css'
import Menu from '../UI/Menu/Menu'
import { useEscape } from '../hooks/useEscape'

interface Props {
  name: string
  setName: React.Dispatch<React.SetStateAction<string>>
}

const Sidebar: React.FC<Props> = ({ name, setName }) => {
  const {sidebarActive, setSidebarActive, onEscape} = useEscape()

  useEffect(() => {
    window.addEventListener('keydown', onEscape)

    return () => window.removeEventListener('keydown', onEscape)
  }, [sidebarActive])
  
  return (
    <>
      <Menu 
        name={name} 
        setName={setName} 
        active={sidebarActive} 
        setActive={setSidebarActive}
      />
      <div 
        className={ sidebarActive ? 
          [cl.sidebarBg, cl.active].join(' ') 
          : 
          cl.sidebarBg} onClick={() => setSidebarActive(false)
        }
      >
      </div>
      <div 
        className={ sidebarActive
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