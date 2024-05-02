import React, { useRef, useState } from 'react'
import cl from '../../../../styles/add-chat.module.css'
import CustomSelect from '../../../UI/CustomSelect/CustomSelect'
import Button from '../../../UI/Button/Button'
import ErrorPopup from '../../../UI/ErrorPopup/ErrorPopup'
import { useAddUser } from '../../../hooks/useAddUser'
import Loader from '../../../UI/Loader/Loader'

interface Props {
  setActive: React.Dispatch<React.SetStateAction<boolean>>
}

const AddDirectChat: React.FC<Props> = ({ setActive }) => {
  const selectOptions = ['email', 'id']

  const [searchBy, setSearchBy] = useState(selectOptions[0])
  const [searchText, setSearchText] = useState('')

  const bg = useRef<HTMLDivElement>(null)
  const { fetching, loading, error, showError } = useAddUser(searchText, searchBy)

  const bgHandler = (e: React.MouseEvent) => {
    if (e.target !== bg.current) {
      return
    }
    setActive(false)
  }

  return (
    <div ref={bg} onClick={(e) => bgHandler(e)} className={cl.addWrapper}>
      <div className={cl.add}>
        <div onClick={() => setActive(false)} className={cl.cross}></div>
        <p className={cl.addText}>Add user</p>
        <ErrorPopup wrapStyles={{top: '100px'}} showError={showError} error={error} />
        { loading
          ? <Loader 
              size={'normal'} 
              addStyles={{
                top: '50%',
                position: 'absolute',
                transform: 'translateY(-50%)'
              }}
            />
          :<div className={cl.searchBox}>
            <input 
              type="text" 
              className={cl.searchBar} 
              value={searchText} 
              onChange={(e) => setSearchText(e.target.value)} 
            />
            <CustomSelect 
              selected={searchBy} 
              setSelected={setSearchBy}
              options={selectOptions}
            />
          </div>
        }
        <Button 
          text='add user' 
          styles={{ 
            bottom: '30px',
            width: '170px',
            fontSize: '13px',
            position: 'absolute',
            zIndex: '0'
          }} 
          action={fetching}
        />
      </div>
    </div>
  )
}

export default AddDirectChat