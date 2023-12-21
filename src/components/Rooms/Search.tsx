import React, { useRef, useState } from 'react'
import cl from '../../styles/search.module.css'
import Button from '../UI/Button/Button'
import { useFetch } from '../hooks/useFetch'

interface Props {
  setActive: React.Dispatch<React.SetStateAction<boolean>>
}

const Search: React.FC<Props> = ({setActive}) => {
  const bg = useRef<HTMLDivElement>(null)
  const [error, setError] = useState('')
  const [searchText, setSearchText] = useState('')
  const [searchBy, setSearchBy] = useState('email')
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({searchText, searchBy})
  }
  const { fetching, loading } = useFetch(async () => {
    console.log('searching...')
    setError('')

    if (searchText.length < 4) {
      setError(`User ${searchBy} too short`)
      return
    }

    const response = await fetch('http://localhost:5000/search-user', fetchOptions)
    const data = await response.json()

    console.log(data)
  }, setError)

  const onSearch = async () => {
    console.log(`Searching user ${searchText}by ${searchBy}`)
    await fetching()
    console.log('done')
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
        <div className={cl.inputBox}>
          <input 
            type="text" 
            value={searchText}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchText(e.target.value)}
            className={cl.input}
          />
          <div className={cl.searchOptions}>
            <label className={cl.selectLabel} htmlFor="search-by">by</label>
            <select 
              name="searh" 
              id="search-by"
              className={cl.select} 
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSearchBy(e.target.value)}
            >
              <option className={cl.option} value="email">Email</option>
              <option className={cl.option} value="id">ID</option>
            </select>
          </div>
        </div>
        <Button 
          text='search' 
          styles={{
            marginTop: '40px',
            height: '30px',
            width: '200px',
            fontSize: '10px',
            zIndex: '1'
          }}
          action={onSearch} 
        />
      </div>
    </div>
  )
}

export default Search