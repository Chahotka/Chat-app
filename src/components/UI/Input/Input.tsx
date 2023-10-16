import React, { useState } from 'react'
import cl from './input.module.css'

interface Props {
  type: 'nick' | 'email'
}

const Input: React.FC<Props> = ({ type }) => {
  const [value, setValue] = useState('')
  const [styles, setStyles] = useState([cl.inputBox])

  return (
    <div className={styles.join(' ')}>
      <label 
        htmlFor="nick"
        className={value ? [cl.label, cl.hide].join(' ') : cl.label}
      >
        Enter your { type }
      </label>
      <input 
        minLength={2}
        maxLength={20}
        id='nick'
        value={value}
        onBlur={() => setStyles([cl.inputBox])}
        onFocus={() => setStyles([cl.inputBox, cl.active])}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
        className={cl.input} 
        type="text"
      />
    </div>
  )
}

export default Input