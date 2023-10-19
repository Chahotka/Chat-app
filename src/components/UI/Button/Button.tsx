import React from 'react'
import cl from './button.module.css'

interface Props {
  text: string
  type?: 'button' | 'submit'
  styles?: {}
  action: React.MouseEventHandler
}

const Button: React.FC<Props> = ({text, type, styles, action}) => {

  return (
      <button 
        type={type ? type : 'button'}
        className={cl.button} 
        onClick={action} 
        style={styles}
      > 
        { text } 
      </button>
  )
}

export default Button