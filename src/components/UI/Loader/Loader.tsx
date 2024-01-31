import React, { useState, useEffect } from 'react'
import cl from './loader.module.css'

interface Props {
  size: 'large' | 'normal'
  pos?: 'center'
  addStyles?: {}
}

const Loader: React.FC<Props> = ({size, pos, addStyles}) => {
  const styles = [cl.circle]

  if (size === 'large') {
    styles.push(cl.large)
  }


  return (
    <div
      className={pos && cl.center}
      style={addStyles}
    >
      <div className={styles.join(' ')}></div>
    </div>
  )
}

export default Loader