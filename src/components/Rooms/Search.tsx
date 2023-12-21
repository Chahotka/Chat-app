import React, { useState } from 'react'
import cl from '../../styles/search.module.css'
import Button from '../UI/Button/Button'

const Search: React.FC = () => {
  const [searchText, setSearchText] = useState('')
  const [searchType, setSearchType] = useState('email')
  
  return (
    <div className={cl.searchBg}>
      <div className={cl.search}>
        <h1 className={cl.title}>Add user</h1>
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
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSearchType(e.target.value)}
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
          action={() => console.log('searching...')} 
        />
      </div>
    </div>
  )
}

export default Search