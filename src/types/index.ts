export enum UserRole {
  Donor = 'donor',
  Recipient = 'recipient',
  Volunteer = 'volunteer',
  Admin = 'admin'
}

export enum FoodStatus {
  Available = 'available',
  Reserved = 'reserved',
  Claimed = 'claimed',
  Delivered = 'delivered',
  Expired = 'expired'
}

export enum DonationType {
  Free = 'free',
  Discounted = 'discounted'
}

export enum FoodType {
  CookedMeal = 'cooked_meal',
  Groceries = 'groceries',
  AnimalFeed = 'animal_feed',
  Produce = 'produce',
  Bakery = 'bakery',
  Dairy = 'dairy',
  Other = 'other'
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  address?: Address;
  createdAt: Date;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unit: string;
  expiryDate: Date;
  donationType: DonationType;
  price?: number;
  type: FoodType;
  photos?: string[];
  status: FoodStatus;
  donorId: string;
  donor?: User;
  recipientId?: string;
  recipient?: User;
  volunteerId?: string;
  volunteer?: User;
  pickupAddress: Address;
  deliveryAddress?: Address;
  createdAt: Date;
  updatedAt: Date;
}

export interface Delivery {
  id: string;
  foodItemId: string;
  foodItem?: FoodItem;
  volunteerId: string;
  volunteer?: User;
  pickupTime?: Date;
  deliveryTime?: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  route?: any; // Route information
  createdAt: Date;
  updatedAt: Date;
} 