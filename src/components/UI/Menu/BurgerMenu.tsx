import React, { useState } from 'react'
import cl from './burger-menu.module.css'

interface Props {
  active: boolean
  setActive: React.Dispatch<React.SetStateAction<boolean>>
}

const BurgerMenu: React.FC<Props> = ({active, setActive}) => {

  return (
    <div 
      className={ active 
        ? [cl.burger, cl.active].join(' ') 
        : cl.burger
      }
      onClick={() => setActive(prev => !prev)}
    >
      <span className={cl.burgerSpan}></span>
    </div>
  )
}

export default BurgerMenu