import React, { useState } from 'react'
import cl from './menu.module.css'

interface Props {
  name: string
  setName: React.Dispatch<React.SetStateAction<string>>
  active: boolean
  setActive: React.Dispatch<React.SetStateAction<boolean>>
}

const Menu: React.FC<Props> = ({name, setName, active, setActive}) => {

  return (
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
  )
}

export default Menu