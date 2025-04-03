import React from 'react';
import { Link } from 'react-router-dom';
import { FoodItem, DonationType, UserRole } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface FoodCardProps {
  foodItem: FoodItem;
  onClaimClick?: (id: string) => void;
}

const FoodCard: React.FC<FoodCardProps> = ({ foodItem, onClaimClick }) => {
  const { currentUser } = useAuth();
  
  const isExpiringSoon = () => {
    const now = new Date();
    const expiry = new Date(foodItem.expiryDate);
    const hoursRemaining = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursRemaining <= 24;
  };
  
  const formatExpiryDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="card hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        {foodItem.photos && foodItem.photos.length > 0 ? (
          <img 
            src={foodItem.photos[0]} 
            alt={foodItem.name} 
            className="w-full h-48 object-cover rounded-t-lg"
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-t-lg">
            <span className="text-gray-400">No image available</span>
          </div>
        )}
        
        <div className="absolute top-2 right-2 flex space-x-2">
          {foodItem.donationType === DonationType.Free ? (
            <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
              Free
            </span>
          ) : (
            <span className="bg-secondary text-white text-xs px-2 py-1 rounded-full">
              Discounted: ${foodItem.price}
            </span>
          )}
          
          {isExpiringSoon() && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              Expiring Soon
            </span>
          )}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{foodItem.name}</h3>
        <p className="text-gray-600 text-sm mt-1 line-clamp-2">{foodItem.description}</p>
        
        <div className="mt-3 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Quantity:</span> {foodItem.quantity} {foodItem.unit}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Expires:</span> {formatExpiryDate(foodItem.expiryDate)}
            </p>
          </div>
          
          <div className="text-sm text-gray-500">
            {foodItem.pickupAddress.city}, {foodItem.pickupAddress.state}
          </div>
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <Link 
            to={`/food/${foodItem.id}`} 
            className="text-accent hover:underline text-sm"
          >
            View Details
          </Link>
          
          {currentUser?.role === UserRole.Recipient && (
            <button
              onClick={() => onClaimClick && onClaimClick(foodItem.id)}
              className="btn-secondary text-sm py-1 px-3"
            >
              Claim
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodCard; 