import React from 'react'
import cl from '../styles/rooms.module.css'

const Rooms: React.FC = () => {
  const arr = [1,1,1,1,1,1,1,1,1,1]

  return (
    <div className={cl.rooms}>
      <ul className={cl.list}>
        { arr.map(item => {
          return (
            <li className={cl.item} key={Math.random()}>
              <div className={cl.avat}></div>
              <div className={cl.info}>
                <div className={cl.contact}>
                  <p className={cl.name}>Room name</p>
                  <p className={cl.time}>14:25</p>
                </div>
                <p className={cl.message}>Last message</p>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default Rooms