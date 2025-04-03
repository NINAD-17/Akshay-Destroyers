import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFood } from '../../context/FoodContext';
import { useAuth } from '../../context/AuthContext';
import { FoodType, DonationType } from '../../types';

const FoodDonationForm: React.FC = () => {
  const { addFoodItem } = useFood();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    quantity: 1,
    unit: 'portions',
    expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
    type: FoodType.CookedMeal,
    donationType: DonationType.Free,
    price: 0,
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
    latitude: 0,
    longitude: 0,
    photos: [] as string[]
  });
  
  const [photoUrl, setPhotoUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'price' ? Number(value) : value
    }));
  };
  
  const handleAddPhoto = () => {
    if (photoUrl && photoUrl.trim() !== '') {
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, photoUrl]
      }));
      setPhotoUrl('');
    }
  };
  
  const handleRemovePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      if (!currentUser) {
        throw new Error('You must be logged in to donate food');
      }
      
      const foodItemData = {
        name: formData.name,
        description: formData.description,
        quantity: formData.quantity,
        unit: formData.unit,
        expiryDate: new Date(formData.expiryDate),
        type: formData.type,
        donationType: formData.donationType as DonationType,
        price: formData.donationType === DonationType.Discounted ? formData.price : undefined,
        photos: formData.photos.length > 0 ? formData.photos : undefined,
        donorId: currentUser.id,
        pickupAddress: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
          latitude: formData.latitude || undefined,
          longitude: formData.longitude || undefined
        }
      };
      
      await addFoodItem(foodItemData);
      navigate('/donor-dashboard');
    } catch (err) {
      console.error('Error adding food item:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Donate Food</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Food Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="e.g., Pasta with Sauce"
            />
          </div>
          
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
              Food Type *
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {Object.values(FoodType).map(type => (
                <option key={type} value={type}>
                  {type.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Describe the food, ingredients, special notes..."
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
              Quantity *
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          
          <div>
            <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
              Unit *
            </label>
            <input
              type="text"
              id="unit"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="e.g., portions, kg, lbs"
            />
          </div>
          
          <div>
            <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
              Expiry Date *
            </label>
            <input
              type="date"
              id="expiryDate"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              required
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="donationType" className="block text-sm font-medium text-gray-700 mb-1">
              Donation Type *
            </label>
            <select
              id="donationType"
              name="donationType"
              value={formData.donationType}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value={DonationType.Free}>Free</option>
              <option value={DonationType.Discounted}>Discounted</option>
            </select>
          </div>
          
          {formData.donationType === DonationType.Discounted && (
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Price ($) *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          )}
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">Pickup Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
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
                required
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
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
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
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">Photos</h3>
          <div className="flex space-x-2 mb-2">
            <input
              type="url"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Enter photo URL"
            />
            <button
              type="button"
              onClick={handleAddPhoto}
              className="btn-primary"
            >
              Add Photo
            </button>
          </div>
          
          {formData.photos.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
              {formData.photos.map((photo, index) => (
                <div key={index} className="relative">
                  <img
                    src={photo}
                    alt={`Food ${index + 1}`}
                    className="w-full h-24 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`btn-primary ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Submitting...' : 'Donate Food'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FoodDonationForm; 