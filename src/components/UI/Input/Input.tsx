import React, { useState } from 'react'
import cl from './input.module.css'

interface Props {
  type: 'nick' | 'email' | 'password',
  value: string
  setValue: React.Dispatch<React.SetStateAction<string>>
  style?: string 
}

const Input: React.FC<Props> = ({ type, value, setValue, style }) => {
  const [styles, setStyles] = useState([cl.inputBox])

  return (
    <div className={styles.join(' ')}>
      { !style &&
        <label 
          htmlFor={type}
          className={value ? [cl.label, cl.hide].join(' ') : cl.label}
        >
          Enter your { type }
        </label>
      }
      <input 
        id={type}
        value={value}
        onBlur={() => !style && setStyles([cl.inputBox])}
        onFocus={() => !style && setStyles([cl.inputBox, cl.active])}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
        className={style ? cl.inputFilter : cl.input} 
        type={type}
      />
    </div>
  )
}

export default Input