import React, { useState } from 'react'
import cl from './custom-select.module.css'

interface Props {
  options: string[]
}

const CustomSelect: React.FC<Props> = ({ options }) => {
  const [active, setActive] = useState(false)
  const [activeOption, setActiveOption] = useState(options[0])

  return (
    <div className={cl.selectWrapper}>
      <p className={cl.selectedOption}>by <span>{activeOption}</span></p>
      <div onClick={() => setActive(prev => !prev)} className={active ? [cl.wrapSelect, cl.active].join(' ') : cl.wrapSelect}></div>
      <ul className={active ? [cl.select, cl.active].join(' ') : cl.select}>
        {options.map(option => 
          <li 
            className={cl.selectOption}
            onClick={() => setActiveOption(option)}
          >
            <p className={cl.optionText}>{option}</p>
          </li>
        )}
      </ul>
    </div>
  )
}

export default CustomSelect