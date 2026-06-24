import React from 'react';
import '../styles/SearchBar.css';

const SearchBar = ({ value, onChange, placeholder = "Looking for a specific restaurant/food type?" }) => {
    return (
        <div className="search-bar-container">
            <div className="search-bar-wrapper">
                <span className="search-icon">🔍</span>
                <input
                    type="text"
                    className="search-input"
                    placeholder={placeholder}
                    value={value || ''} 
                    onChange={(e) => onChange(e.target.value)}
                />
                
                {value && (
                    <button className="clear-button" onClick={() => onChange('')}>
                        ✕
                    </button>
                )}
                
            </div>
        </div>
    );
};

export default SearchBar;