import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFood } from '../../context/FoodContext';
import { FoodType, FoodStatus } from '../../types';
import FoodCard from '../common/FoodCard';

const FoodBrowser: React.FC = () => {
  const { foodItems, loading, error } = useFood();
  const navigate = useNavigate();
  
  const [filters, setFilters] = useState({
    type: '',
    search: '',
    sortBy: 'expiryDate', // expiryDate, distance, name
    sortOrder: 'asc' as 'asc' | 'desc'
  });
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSortToggle = () => {
    setFilters(prev => ({
      ...prev,
      sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc'
    }));
  };
  
  const handleClaimClick = (id: string) => {
    navigate(`/food/${id}/claim`);
  };
  
  // Filter and sort food items
  const filteredItems = foodItems
    .filter(item => item.status === FoodStatus.Available)
    .filter(item => 
      filters.type ? item.type === filters.type : true
    )
    .filter(item => 
      filters.search 
        ? item.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          item.description.toLowerCase().includes(filters.search.toLowerCase())
        : true
    )
    .sort((a, b) => {
      if (filters.sortBy === 'expiryDate') {
        return filters.sortOrder === 'asc' 
          ? new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()
          : new Date(b.expiryDate).getTime() - new Date(a.expiryDate).getTime();
      } else if (filters.sortBy === 'name') {
        return filters.sortOrder === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      return 0;
    });
  
  return (
    <div className="max-w-7xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Food Donations</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <div className="bg-white shadow-sm rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              id="search"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search by name or description"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
              Food Type
            </label>
            <select
              id="type"
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">All Types</option>
              {Object.values(FoodType).map(type => (
                <option key={type} value={type}>
                  {type.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <select
              id="sortBy"
              name="sortBy"
              value={filters.sortBy}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="expiryDate">Expiry Date</option>
              <option value="name">Name</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700 mb-1">
              Sort Order
            </label>
            <button
              type="button"
              onClick={handleSortToggle}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-left flex justify-between items-center"
            >
              <span>{filters.sortOrder === 'asc' ? 'Ascending' : 'Descending'}</span>
              <span>{filters.sortOrder === 'asc' ? '↑' : '↓'}</span>
            </button>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white shadow-sm rounded-lg p-8 text-center">
          <h3 className="text-xl font-medium text-gray-700 mb-2">No Food Items Available</h3>
          <p className="text-gray-500">
            {filters.type || filters.search 
              ? 'Try adjusting your filters to see more results.' 
              : 'Check back later for new donations.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(foodItem => (
            <FoodCard 
              key={foodItem.id} 
              foodItem={foodItem} 
              onClaimClick={handleClaimClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FoodBrowser; 