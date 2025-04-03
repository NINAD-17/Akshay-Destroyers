import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useFood } from '../../context/FoodContext';
import { FoodItem, FoodStatus } from '../../types';

const VolunteerDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { foodItems, loading, error, updateFoodStatus } = useFood();
  
  const [pendingDeliveries, setPendingDeliveries] = useState<FoodItem[]>([]);
  const [myDeliveries, setMyDeliveries] = useState<FoodItem[]>([]);
  const [activeTab, setActiveTab] = useState<'available' | 'my-deliveries'>('available');
  
  useEffect(() => {
    if (foodItems.length > 0 && currentUser) {
      // Find items that need delivery (claimed but no volunteer assigned)
      const pending = foodItems.filter(item => 
        item.status === FoodStatus.Claimed && 
        item.deliveryAddress && 
        !item.volunteerId
      );
      
      // Find items that this volunteer is delivering
      const mine = foodItems.filter(item => 
        item.volunteerId === currentUser.id
      );
      
      setPendingDeliveries(pending);
      setMyDeliveries(mine);
    }
  }, [foodItems, currentUser]);
  
  const handleAcceptDelivery = async (id: string) => {
    if (!currentUser) return;
    
    try {
      // In a real application, we'd have a separate function for volunteers to accept deliveries
      // For simplicity, we're just updating the food status and setting the volunteerId
      const updatedFood = await updateFoodStatus(id, FoodStatus.Reserved);
      
      // Update our local state
      setPendingDeliveries(prev => prev.filter(item => item.id !== id));
      setMyDeliveries(prev => [...prev, { ...updatedFood, volunteerId: currentUser.id }]);
    } catch (err) {
      console.error('Failed to accept delivery:', err);
    }
  };
  
  const handleCompleteDelivery = async (id: string) => {
    try {
      await updateFoodStatus(id, FoodStatus.Delivered);
      
      // Update our local state
      setMyDeliveries(prev => prev.map(item => 
        item.id === id ? { ...item, status: FoodStatus.Delivered } : item
      ));
    } catch (err) {
      console.error('Failed to complete delivery:', err);
    }
  };
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };
  
  const getAddressString = (item: FoodItem) => {
    const address = item.deliveryAddress || item.pickupAddress;
    return `${address.street}, ${address.city}, ${address.state} ${address.zipCode}`;
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Volunteer Dashboard</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('available')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'available'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Available Deliveries ({pendingDeliveries.length})
            </button>
            <button
              onClick={() => setActiveTab('my-deliveries')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'my-deliveries'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Deliveries ({myDeliveries.length})
            </button>
          </nav>
        </div>
      </div>
      
      {activeTab === 'available' && (
        <>
          {pendingDeliveries.length === 0 ? (
            <div className="bg-white shadow-sm rounded-lg p-8 text-center">
              <h3 className="text-xl font-medium text-gray-700 mb-2">No Deliveries Available</h3>
              <p className="text-gray-500">
                Check back later for new delivery opportunities.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {pendingDeliveries.map(item => (
                <div key={item.id} className="bg-white shadow-sm rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                      <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                      
                      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
                        <div>
                          <span className="text-sm text-gray-500">Quantity:</span>
                          <p className="font-medium">{item.quantity} {item.unit}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Expiry Date:</span>
                          <p className="font-medium">{formatDate(item.expiryDate)}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Pickup Address:</span>
                          <p className="font-medium">
                            {item.pickupAddress.street}, {item.pickupAddress.city}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Delivery Address:</span>
                          <p className="font-medium">
                            {item.deliveryAddress?.street}, {item.deliveryAddress?.city}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleAcceptDelivery(item.id)}
                      className="btn-primary"
                    >
                      Accept Delivery
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
      
      {activeTab === 'my-deliveries' && (
        <>
          {myDeliveries.length === 0 ? (
            <div className="bg-white shadow-sm rounded-lg p-8 text-center">
              <h3 className="text-xl font-medium text-gray-700 mb-2">No Active Deliveries</h3>
              <p className="text-gray-500">
                You haven't accepted any deliveries yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {myDeliveries.map(item => (
                <div key={item.id} className="bg-white shadow-sm rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center mb-2">
                        <h3 className="text-lg font-semibold text-gray-800 mr-3">{item.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          item.status === FoodStatus.Reserved 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {item.status === FoodStatus.Reserved ? 'In Progress' : 'Delivered'}
                        </span>
                      </div>
                      
                      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
                        <div>
                          <span className="text-sm text-gray-500">Pickup Address:</span>
                          <p className="font-medium">{getAddressString(item)}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Delivery Address:</span>
                          <p className="font-medium">
                            {item.deliveryAddress 
                              ? `${item.deliveryAddress.street}, ${item.deliveryAddress.city}` 
                              : 'No delivery needed'}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {item.status === FoodStatus.Reserved && (
                      <button
                        onClick={() => handleCompleteDelivery(item.id)}
                        className="btn-primary"
                      >
                        Mark as Delivered
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default VolunteerDashboard; 