import React from 'react'
import cl from '../../../styles/sidebar.module.css'

interface Props {
  text: string
  action?: () => void
}

const SidebarOption: React.FC<Props> = ({ text, action }) => {

  return (
    <li onClick={action} className={cl.option}>
      <p className={cl.optionText}>{ text }</p>
    </li>
  )
}

export default SidebarOption