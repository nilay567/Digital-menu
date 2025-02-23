import React, { useEffect, useState } from "react";
import "./Search.css";
import { useNavigate, useParams } from "react-router-dom";

const Search = () => {
  const [term, setTerm] = useState("");
  const navigate = useNavigate();
  const { searchTerm } = useParams();

  const search = async () => {
    term ? navigate('/search/' + term) : navigate('/');
  };

  useEffect(() => {
    setTerm(searchTerm ?? '');
  }, [searchTerm]);

  return (
    <div className="searchContainer">
      <input
        type="text"
        placeholder="Search Food "
        onChange={e => setTerm(e.target.value)}
        onKeyUp={e => e.key === 'Enter' && search()}
        value={term}
      />
      <button onClick={search}>Search</button>
    </div>
  )
};

export default Search;
