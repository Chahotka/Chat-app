import React, { useState } from 'react'
import cl from './input.module.css'

interface Props {
  type: 'nick' | 'email' | 'password',
  value: string
  setValue: React.Dispatch<React.SetStateAction<string>>
}

const Input: React.FC<Props> = ({ type, value, setValue }) => {
  const [styles, setStyles] = useState([cl.inputBox])

  return (
    <div className={styles.join(' ')}>
      <label 
        htmlFor={type}
        className={value ? [cl.label, cl.hide].join(' ') : cl.label}
      >
        Enter your { type }
      </label>
      <input 
        id={type}
        value={value}
        onBlur={() => setStyles([cl.inputBox])}
        onFocus={() => setStyles([cl.inputBox, cl.active])}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
        className={cl.input} 
        type={type}
      />
    </div>
  )
}

export default Input