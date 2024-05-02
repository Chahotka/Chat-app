import React, { useState } from 'react'
import cl from './custom-select.module.css'

interface Props {
  selected: string
  setSelected: React.Dispatch<React.SetStateAction<string>>
  options: string[]
}

const CustomSelect: React.FC<Props> = ({selected, setSelected, options }) => {
  const [active, setActive] = useState(false)

  return (
    <div className={cl.selectWrapper}>
      <div className={cl.selectedOption}>
        <span>by</span> 
        <p>{ selected }</p>
      </div>
      <div onClick={() => setActive(prev => !prev)} className={active ? [cl.wrapSelect, cl.active].join(' ') : cl.wrapSelect}></div>
      <ul className={active ? [cl.select, cl.active].join(' ') : cl.select}>
        {options.map(option => 
          <li 
            key={option}
            className={cl.selectOption}
            onClick={() => {
              setActive(false)
              setSelected(option)
            }}
          >
            <p className={cl.optionText}>{option}</p>
          </li>
        )}
      </ul>
    </div>
  )
}

export default CustomSelect