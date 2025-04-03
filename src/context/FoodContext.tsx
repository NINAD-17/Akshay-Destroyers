import React, { createContext, useContext, useState, useEffect } from 'react';
import { FoodItem, FoodStatus, FoodType, DonationType, Address } from '../types';

interface FoodContextType {
  foodItems: FoodItem[];
  loading: boolean;
  error: string | null;
  addFoodItem: (foodItem: Omit<FoodItem, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => Promise<FoodItem>;
  updateFoodStatus: (id: string, status: FoodStatus) => Promise<FoodItem>;
  claimFoodItem: (id: string, recipientId: string, deliveryAddress?: Address) => Promise<FoodItem>;
  deleteFoodItem: (id: string) => Promise<void>;
  getFoodItemsByDonor: (donorId: string) => FoodItem[];
  getAvailableFoodItems: () => FoodItem[];
  getFoodItemById: (id: string) => FoodItem | undefined;
}

const FoodContext = createContext<FoodContextType | undefined>(undefined);

export const useFood = () => {
  const context = useContext(FoodContext);
  if (!context) {
    throw new Error('useFood must be used within a FoodProvider');
  }
  return context;
};

// Mock data for demonstration
const mockFoodItems: FoodItem[] = [
  {
    id: '1',
    name: 'Pasta with Tomato Sauce',
    description: 'Freshly made pasta with homemade tomato sauce. Serving for 10 people.',
    quantity: 10,
    unit: 'portions',
    expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    donationType: DonationType.Free,
    type: FoodType.CookedMeal,
    photos: ['https://images.unsplash.com/photo-1603729362753-f8162ac6c3df'],
    status: FoodStatus.Available,
    donorId: '1',
    pickupAddress: {
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345',
      country: 'USA',
      latitude: 34.0522,
      longitude: -118.2437
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    name: 'Fresh Vegetables Assortment',
    description: 'Fresh vegetables including carrots, broccoli, and bell peppers.',
    quantity: 5,
    unit: 'kg',
    expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    donationType: DonationType.Free,
    type: FoodType.Produce,
    photos: ['https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c'],
    status: FoodStatus.Available,
    donorId: '2',
    pickupAddress: {
      street: '456 Oak Ave',
      city: 'Somewhere',
      state: 'NY',
      zipCode: '67890',
      country: 'USA',
      latitude: 40.7128,
      longitude: -74.006
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    name: 'Bakery Items',
    description: 'Assorted bakery items including bread, muffins, and pastries.',
    quantity: 20,
    unit: 'pieces',
    expiryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
    donationType: DonationType.Discounted,
    price: 10,
    type: FoodType.Bakery,
    photos: ['https://images.unsplash.com/photo-1608198093002-ad4e005484ec'],
    status: FoodStatus.Available,
    donorId: '3',
    pickupAddress: {
      street: '789 Maple Rd',
      city: 'Elsewhere',
      state: 'TX',
      zipCode: '54321',
      country: 'USA',
      latitude: 29.7604,
      longitude: -95.3698
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const FoodProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [foodItems, setFoodItems] = useState<FoodItem[]>(mockFoodItems);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simulate fetching food items from an API
  useEffect(() => {
    const fetchFoodItems = async () => {
      setLoading(true);
      try {
        // In a real application, this would be an API call
        // For demo purposes, we're using mockFoodItems
        setFoodItems(mockFoodItems);
        setError(null);
      } catch (err) {
        setError('Failed to fetch food items');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFoodItems();
  }, []);

  const addFoodItem = async (foodItemData: Omit<FoodItem, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<FoodItem> => {
    setLoading(true);
    try {
      // In a real application, this would be an API call
      const newFoodItem: FoodItem = {
        ...foodItemData,
        id: Math.random().toString(36).substring(2, 9),
        status: FoodStatus.Available,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      setFoodItems(prev => [...prev, newFoodItem]);
      return newFoodItem;
    } catch (err) {
      setError('Failed to add food item');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateFoodStatus = async (id: string, status: FoodStatus): Promise<FoodItem> => {
    setLoading(true);
    try {
      // In a real application, this would be an API call
      const updatedItems = foodItems.map(item => 
        item.id === id 
          ? { ...item, status, updatedAt: new Date() } 
          : item
      );
      
      setFoodItems(updatedItems);
      const updatedItem = updatedItems.find(item => item.id === id);
      
      if (!updatedItem) {
        throw new Error('Food item not found');
      }
      
      return updatedItem;
    } catch (err) {
      setError('Failed to update food status');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const claimFoodItem = async (id: string, recipientId: string, deliveryAddress?: Address): Promise<FoodItem> => {
    setLoading(true);
    try {
      // In a real application, this would be an API call
      const updatedItems = foodItems.map(item => 
        item.id === id 
          ? { 
              ...item, 
              status: FoodStatus.Claimed, 
              recipientId, 
              deliveryAddress, 
              updatedAt: new Date() 
            } 
          : item
      );
      
      setFoodItems(updatedItems);
      const updatedItem = updatedItems.find(item => item.id === id);
      
      if (!updatedItem) {
        throw new Error('Food item not found');
      }
      
      return updatedItem;
    } catch (err) {
      setError('Failed to claim food item');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteFoodItem = async (id: string): Promise<void> => {
    setLoading(true);
    try {
      // In a real application, this would be an API call
      setFoodItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setError('Failed to delete food item');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getFoodItemsByDonor = (donorId: string) => {
    return foodItems.filter(item => item.donorId === donorId);
  };

  const getAvailableFoodItems = () => {
    return foodItems.filter(item => item.status === FoodStatus.Available);
  };

  const getFoodItemById = (id: string) => {
    return foodItems.find(item => item.id === id);
  };

  return (
    <FoodContext.Provider
      value={{
        foodItems,
        loading,
        error,
        addFoodItem,
        updateFoodStatus,
        claimFoodItem,
        deleteFoodItem,
        getFoodItemsByDonor,
        getAvailableFoodItems,
        getFoodItemById
      }}
    >
      {children}
    </FoodContext.Provider>
  );
}; 