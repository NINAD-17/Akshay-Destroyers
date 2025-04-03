import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFood } from '../../context/FoodContext';
import { useAuth } from '../../context/AuthContext';
import { FoodItem } from '../../types';

const FoodClaimForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getFoodItemById, claimFoodItem, loading, error } = useFood();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [foodItem, setFoodItem] = useState<FoodItem | null>(null);
  const [formData, setFormData] = useState({
    deliveryNeeded: false,
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
    notes: ''
  });
  
  const [formError, setFormError] = useState<string | null>(null);
  
  // Load food item details
  useEffect(() => {
    if (id) {
      const item = getFoodItemById(id);
      if (item) {
        setFoodItem(item);
      } else {
        setFormError('Food item not found');
      }
    }
  }, [id, getFoodItemById]);
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    
    try {
      if (!currentUser) {
        throw new Error('You must be logged in to claim food');
      }
      
      if (!id) {
        throw new Error('Food item ID is missing');
      }
      
      // Prepare delivery address if needed
      const deliveryAddress = formData.deliveryNeeded 
        ? {
            street: formData.street,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            country: formData.country
          }
        : undefined;
      
      // Claim the food item
      await claimFoodItem(id, currentUser.id, deliveryAddress);
      
      // Redirect to recipient dashboard
      navigate('/recipient-dashboard');
    } catch (err) {
      console.error('Error claiming food item:', err);
      setFormError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };
  
  if (!foodItem && !formError) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Claim Food</h2>
      
      {(formError || error) && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {formError || error}
        </div>
      )}
      
      {foodItem && (
        <div className="space-y-6">
          <div className="bg-white shadow-sm rounded-lg p-4 mb-6">
            <h3 className="text-xl font-semibold text-gray-800">{foodItem.name}</h3>
            <p className="text-gray-600 mt-2">{foodItem.description}</p>
            
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-500">Quantity:</span>
                <p className="font-medium">{foodItem.quantity} {foodItem.unit}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Expiry Date:</span>
                <p className="font-medium">
                  {new Date(foodItem.expiryDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Type:</span>
                <p className="font-medium">{foodItem.type.replace('_', ' ')}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Donation Type:</span>
                <p className="font-medium">
                  {foodItem.donationType === 'free' 
                    ? 'Free' 
                    : `Discounted: $${foodItem.price}`}
                </p>
              </div>
            </div>
            
            <div className="mt-4">
              <span className="text-sm text-gray-500">Pickup Address:</span>
              <p className="font-medium">
                {foodItem.pickupAddress.street}, {foodItem.pickupAddress.city}, {foodItem.pickupAddress.state} {foodItem.pickupAddress.zipCode}
              </p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg p-4">
            <div className="mb-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="deliveryNeeded"
                  checked={formData.deliveryNeeded}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <span className="ml-2 text-gray-700">I need delivery assistance</span>
              </label>
              <p className="text-sm text-gray-500 mt-1">
                Check this if you need a volunteer to deliver this food to you.
              </p>
            </div>
            
            {formData.deliveryNeeded && (
              <div className="mb-4 space-y-4">
                <h4 className="text-lg font-medium text-gray-800">Delivery Address</h4>
                
                <div>
                  <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
                    Street *
                  </label>
                  <input
                    type="text"
                    id="street"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    required={formData.deliveryNeeded}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required={formData.deliveryNeeded}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required={formData.deliveryNeeded}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                      Zip Code *
                    </label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      required={formData.deliveryNeeded}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
            )}
            
            <div className="mb-4">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Additional Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Any special instructions or notes..."
              />
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={loading}
                className={`btn-primary ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Processing...' : 'Claim Food'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default FoodClaimForm; 