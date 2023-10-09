import React, { useState } from 'react'
import cl from './form.module.css'
import Button from '../Button/Button'

const Form: React.FC = () => {
  const [name, setName] = useState('')

  const onSend = (e: React.PointerEvent) => {
    e.preventDefault()
  }

  return (
    <form className={cl.form}>
      <input 
        className={cl.input} 
        value={name}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
        type="text"  
        placeholder='Enter your nickname'
      />
      <Button 
        text='save' 
        action={(e: React.PointerEvent) => onSend(e)}
      />
    </form>
  )
}

export default Form