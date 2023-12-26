import React, { useState } from 'react'
import cl from '../../styles/add-room.module.css'
import Button from '../UI/Button/Button'
import Search from './Search'
  

const AddRoom: React.FC = () => {
  const [active, setActive] = useState(false)

  return (
    <div className={cl.add}>
      <Button 
        styles={{
          marginTop: '10px',
          height: '30px',
          width: '130px',
          fontSize: '12px',
          zIndex: '1',
        }}
        text='Add Rooms' action={() => setActive(prev => !prev) } 
      />
      { active && <Search setActive={setActive}/>}
    </div>
  )
}

export default AddRoom