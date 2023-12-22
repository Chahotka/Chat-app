import React, { useRef, useState } from 'react'
import cl from '../../styles/search.module.css'
import Button from '../UI/Button/Button'
import SearchProps from './SearchProps'
import { useAddUser } from '../hooks/useAddUser'
import Loader from '../UI/Loader/Loader'

interface Props {
  setActive: React.Dispatch<React.SetStateAction<boolean>>
}

const Search: React.FC<Props> = ({setActive}) => {
  const bg = useRef<HTMLDivElement>(null)
  const [searchText, setSearchText] = useState('')
  const [searchBy, setSearchBy] = useState('email')
  const { fetching, loading, error } = useAddUser(searchText, searchBy)

  const onSearch = async () => {
    await fetching()
  }

  const bgClickHandler = (e: React.MouseEvent) => {
    if (e.target !== bg.current) {
      return
    }

    setSearchText('')
    setActive(false)
  }
  
  return (
    <div 
      ref={bg}
      className={cl.searchBg}
      onClick={(e: React.MouseEvent) => bgClickHandler(e)}
    >
      <div className={cl.search}>
        <div 
          className={cl.close}
          onClick={() => setActive(false)}
        ></div>
        <h1 className={cl.title}>Add user</h1>
        <p className={cl.error}>{ error }</p>
        <SearchProps searchText={searchText} setSearchText={setSearchText} setSearchBy={setSearchBy}/>
        {loading ?
          <Loader 
            size='normal' 
            pos='center' 
            addStyles={{marginTop: '20px'}}
          />
        :
          <Button 
            text='add' 
            styles={{
              marginTop: '40px',
              height: '30px',
              width: '200px',
              fontSize: '10px',
              zIndex: '1'
            }}
            action={onSearch} 
          />
        }
      </div>
    </div>
  )
}

export default Search