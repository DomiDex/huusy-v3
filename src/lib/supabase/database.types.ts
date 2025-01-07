export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      properties: {
        Row: {
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
          property_type_id: string;
          city_id: string;
          sale_type_id: string;
          agent_id: string;
          created_at: string;
          updated_at: string;
        };
      };
      property_types: {
        Row: {
          id: string;
          title: string;
          path: string;
          og_image_url: string;
          created_at: string;
          updated_at: string;
        };
      };
      cities: {
        Row: {
          id: string;
          title: string;
          path: string;
          meta_title?: string;
          meta_description?: string;
          og_image_url?: string;
          created_at: string;
          updated_at: string;
        };
      };
      sale_types: {
        Row: {
          id: string;
          title: string;
          path: string;
          meta_title?: string;
          meta_description?: string;
          og_image_url?: string;
          created_at: string;
          updated_at: string;
        };
      };
      account_pro: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          agency_name: string;
          phone: string;
          profile_image_url?: string;
          description?: string;
          created_at: string;
          updated_at: string;
        };
      };
      favorites: {
        Row: {
          id: string;
          property_id: string;
          customer_id: string;
          created_at: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
