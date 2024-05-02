import React from 'react'
import cl from './error-popup.module.css'

interface Props {
  error: string
  showError: boolean
  textStyles?: {}
  wrapStyles?: {}
}

const ErrorPopup: React.FC<Props> = ({ error, showError, textStyles, wrapStyles }) => {
  return (
    <div style={wrapStyles} className={showError ? [cl.errorWrapper, cl.show].join(' ') : cl.errorWrapper}>
      <p style={textStyles} className={cl.errorText}>{ error }</p>
    </div>
  )
}

export default ErrorPopup