import React from 'react'
import cl from '../../styles/search.module.css'

interface Props {
  searchText: string
  setSearchText: React.Dispatch<React.SetStateAction<string>>
  setSearchBy: React.Dispatch<React.SetStateAction<string>>
}

const SearchProps: React.FC<Props> = ({ searchText, setSearchText, setSearchBy}) => {

  return (
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
  )
}

export default SearchProps