import React, { useState } from 'react'
import cl from '../../styles/sidebar.module.css'

interface Props {
  name: string
  setName: React.Dispatch<React.SetStateAction<string>>
}

const Sidebar: React.FC<Props> = ({ name, setName }) => {
  const [active, setActive] = useState(false)

  return (
    <>
    <div className={cl.menu}>
      <div 
        className={ active 
          ? [cl.burger, cl.active].join(' ') 
          : cl.burger
        }
        onClick={() => setActive(prev => !prev)}
      >
        <span className={cl.burgerSpan}></span>
      </div>
      <input 
        value={name} 
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} 
        className={cl.input} 
        type="text"
      />
    </div>
    <div 
      className={ active
        ? [cl.sidebarBg, cl.active].join(' ')
        : cl.sidebarBg
      }
      onClick={() => setActive(false)}
    ></div>
    <div 
      className={ active
        ? [cl.sidebar, cl.active].join(' ')
        : cl.sidebar
      }
    >
    </div>
    </>
  )
}

export default Sidebar