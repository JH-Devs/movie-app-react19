import React from 'react'
import searchImg from '/search.svg'

const Search = ({ searchTerm, setSearchTerm}) => {
  return (
    <div className="search">
        <div>
            <img src={searchImg} alt="Search" />

            <input type="text"
            placeholder="Hledat film"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)} />
        </div>
    </div>
  )
}

export default Search