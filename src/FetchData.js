import React, { useState, useEffect } from 'react';
import axios from './api';

const FetchData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/test.php');
        setData(response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); 
  };

  const filteredData = data.filter((item) => {
    const title = item.title && typeof item.title === 'string' ? item.title.toLowerCase() : '';
    const amount = item.amount !== undefined ? item.amount.toString() : '';
    const query = searchQuery.toLowerCase();
    return title.includes(query) || amount.includes(query);
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className='container'>
      <h2 className="text-center my-4">Data</h2>
      <input 
        type="text" 
        placeholder="Search..." 
        value={searchQuery} 
        onChange={handleSearch} 
        className="form-control mb-3"
      />
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Item</th>
            <th scope="col">Amount</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item, index) => (
            <tr key={index}>
              <td>{item.title}</td>
              <td>{item.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <nav>
        <ul className="pagination justify-content-center">
          {[...Array(Math.ceil(filteredData.length / itemsPerPage)).keys()].map((number) => (
            <li key={number} className={`page-item ${currentPage === number + 1 ? 'active' : ''}`}>
              <button onClick={() => paginate(number + 1)} className="page-link">
                {number + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default FetchData;