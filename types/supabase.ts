export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: number;
          created_at?: string;
          slug: string;
          title: string;
          description: string | null;
          image: string;
          price: number;
          category: 'gadget' | 'sticks';
          in_stock: boolean;
          badges: Json;
          attributes: Json;
          brand: string | null;
        };
        Insert: {
          id?: number;
          created_at?: string;
          slug: string;
          title: string;
          description?: string | null;
          image: string;
          price: number;
          category: 'gadget' | 'sticks';
          in_stock: boolean;
          badges: Json;
          attributes: Json;
          brand?: string | null;
        };
        Update: {
          id?: number;
          created_at?: string;
          slug?: string;
          title?: string;
          description?: string | null;
          image?: string;
          price?: number;
          category?: 'gadget' | 'sticks';
          in_stock?: boolean;
          badges?: Json;
          attributes?: Json;
          brand?: string | null;
        };
      };
    };
  };
}

export type ProductRow = Database['public']['Tables']['products']['Row'];
