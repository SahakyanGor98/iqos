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
          image: string[];
          price: number;
          category: 'gadget' | 'sticks' | 'water';
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
          image: string[];
          price: number;
          category: 'gadget' | 'sticks' | 'water';
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
          image?: string[];
          price?: number;
          category?: 'gadget' | 'sticks' | 'water';
          in_stock?: boolean;
          badges?: Json;
          attributes?: Json;
          brand?: string | null;
        };
      };
      orders: {
        Row: {
          id: number;
          created_at: string;
          user_name: string;
          user_email: string;
          user_phone: string;
          user_message: string | null;
          total_amount: number;
          status: string | null;
          order_type: 'purchase' | 'trade_in';
          discount: number;
          items: Json;
          metadata: Json;
        };
        Insert: {
          id?: number;
          created_at?: string;
          user_name: string;
          user_email: string;
          user_phone: string;
          user_message?: string | null;
          total_amount: number;
          status?: string | null;
          order_type?: 'purchase' | 'trade_in';
          discount?: number;
          items?: Json;
          metadata?: Json;
        };
        Update: {
          id?: number;
          created_at?: string;
          user_name?: string;
          user_email?: string;
          user_phone?: string;
          user_message?: string | null;
          total_amount?: number;
          status?: string | null;
          order_type?: 'purchase' | 'trade_in';
          discount?: number;
          items?: Json;
          metadata?: Json;
        };
      };
      order_items: {
        Row: {
          id: number;
          created_at: string;
          order_id: number;
          product_id: number;
          quantity: number;
          price_at_time: number;
        };
        Insert: {
          id?: number;
          created_at?: string;
          order_id: number;
          product_id: number;
          quantity: number;
          price_at_time: number;
        };
        Update: {
          id?: number;
          created_at?: string;
          order_id?: number;
          product_id?: number;
          quantity?: number;
          price_at_time?: number;
        };
      };
      contact_messages: {
        Row: {
          id: number;
          created_at: string;
          name: string;
          email: string;
          phone: string;
          message: string;
          status: string | null;
        };
        Insert: {
          id?: number;
          created_at?: string;
          name: string;
          email: string;
          phone: string;
          message: string;
          status?: string | null;
        };
        Update: {
          id?: number;
          created_at?: string;
          name?: string;
          email?: string;
          phone?: string;
          message?: string;
          status?: string | null;
        };
      };
    };
  };
}

export type ProductRow = Database['public']['Tables']['products']['Row'];
export type OrderRow = Database['public']['Tables']['orders']['Row'];
export type OrderItemRow = Database['public']['Tables']['order_items']['Row'];
export type ContactMessageRow = Database['public']['Tables']['contact_messages']['Row'];
