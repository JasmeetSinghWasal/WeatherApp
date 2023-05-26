import React from 'react';
import ErrorMessage from '../ErrorMsg/ErrorMessage';
import './searchbar.css';
const SearchBar = (props) => {
    return (
      <div className='search-section'>
        <form onSubmit={props.handleSubmit}>
        <input
          className="search-container"
          type="text"
          placeholder="Enter City"
          value={props.city}
          onChange={props.onChange}
        />
        <div>{props.errorMsg != "" && <ErrorMessage message={props.errorMsg} />}</div>
        {/* <button className="search-button" type="submit">
          Search
        </button> */}
        </form>
        </div>
    );
}

export default SearchBar;
