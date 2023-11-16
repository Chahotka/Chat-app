import React, { useState } from 'react'
import cl from './menu.module.css'

const Menu: React.FC = () => {
  const [active, setActive] = useState(false)

  return (
    <div 
      onClick={() => setActive(prev => !prev)}
      className={ active ?
        [cl.burgerBox, cl.active].join(' ')
        :
        cl.burgerBox
      }
    >
      <span className={cl.burger}></span>
    </div>
  )
}

export default Menu