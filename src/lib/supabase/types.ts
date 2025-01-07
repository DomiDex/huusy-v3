export type AccountPro = {
  id: string;
  full_name: string;
  email: string;
  agency_name: string;
  phone: string;
  profile_image_url?: string;
  description?: string;
  account_type: 'pro';
  created_at: string;
  updated_at: string;
};

export type AccountCustomer = {
  id: string;
  username: string;
  email: string;
  profile_image_url?: string;
  account_type: 'customer';
  created_at: string;
  updated_at: string;
};

export interface PropertyType {
  id: string;
  title: string;
  path: string;
  og_image_url: string;
  created_at: string;
  updated_at: string;
}

export type City = {
  id: string;
  title: string;
  path: string;
  meta_title?: string;
  meta_description?: string;
  og_image_url?: string;
  created_at: string;
  updated_at: string;
};

export type SaleType = {
  id: string;
  title: string;
  path: string;
  meta_title?: string;
  meta_description?: string;
  og_image_url?: string;
  created_at: string;
  updated_at: string;
};

export type Property = {
  id: string;
  property_name: string;
  path: string;
  excerpt?: string;
  property_details?: string;
  images: string[];
  bathrooms: number;
  bedrooms: number;
  property_size: number;
  price: number;
  address: string;
  meta_title?: string;
  meta_description?: string;

  // Foreign Keys
  property_type_id: string;
  city_id: string;
  sale_type_id: string;
  agent_id: string;

  // Relations
  property_type?: PropertyType;
  city?: City;
  sale_type?: SaleType;
  agent?: AccountPro;

  created_at: string;
  updated_at: string;
};

export type Favorite = {
  id: string;
  property_id: string;
  customer_id: string;

  // Relations
  property?: Property;
  customer?: AccountCustomer;

  created_at: string;
};

// Database helper types for better type inference
export type Tables = {
  properties: Property;
  property_types: PropertyType;
  cities: City;
  sale_types: SaleType;
  favorites: Favorite;
  account_pro: AccountPro;
  account_customer: AccountCustomer;
};
