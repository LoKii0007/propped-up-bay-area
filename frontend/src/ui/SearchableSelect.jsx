import { CALIFORNIA_STATES } from "@/data/staticData";
import { useState, useRef, useEffect } from "react";

export const SearchableSelect = ({ value, onChange, name, required, editing }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredOptions, setFilteredOptions] = useState(CALIFORNIA_STATES);
    const dropdownRef = useRef(null);
  
    // Filter options based on search term
    useEffect(() => {
      const filtered = CALIFORNIA_STATES.filter((option) =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOptions(filtered);
    }, [searchTerm]);
  
    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };
  
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
  
    const handleInputClick = () => {
      setIsOpen(!isOpen);
    };
  
    const handleOptionClick = (option) => {
      onChange({ target: { name, value: option } });
      setSearchTerm("");
      setIsOpen(false);
    };
  
    return (
      <div className="relative w-full" ref={dropdownRef}>
        <div
          className="border border-[#646464] rounded px-3 py-2 w-full cursor-pointer flex items-center justify-between"
          onClick={handleInputClick}
        >
          <input
            type="text"
            className="outline-none w-full bg-transparent"
            placeholder="Select a state"
            value={isOpen ? searchTerm : value || ""}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsOpen(true);
            }}
            required={required}
            disabled={!editing}
            readOnly={!isOpen}
          />
          {editing && 
          <svg
            className={`w-4 h-4 transition-transform ${  isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
          }
        </div>
  
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <div
                  key={index}
                  className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                    option === value ? "bg-gray-50" : ""
                  }`}
                  onClick={() => handleOptionClick(option)}
                >
                  {option}
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-gray-500">No results found</div>
            )}
          </div>
        )}
      </div>
    );
  };