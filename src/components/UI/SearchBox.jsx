import { useState } from 'react';
import { Form } from 'react-router-dom';

const SearchBox = ({ onSearch, searchValue }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim() !== "") {
            onSearch(searchTerm);
            setSearchTerm('');
        }
    };


    return (
        <div className="relative w-full max-w-md"> {/* Ensure it's contained and responsive */}
            <Form onSubmit={handleSearchSubmit}>
                <input
                    type="text"
                    name='search'
                    placeholder="Search"
                    value={searchValue}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-8 py-2 pl-2 pr-8 border border-base-300 bg-base-100 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                />
                <button
                    type='submit'
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-transparent text-base-content focus:outline-none"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 4a7 7 0 100 14 7 7 0 000-14zM18.364 18.364l-3.192-3.192"
                        />
                    </svg>
                </button>
            </Form>
        </div>
    );
};

export default SearchBox;
