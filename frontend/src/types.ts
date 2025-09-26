export interface Order {
  id: string;
  created_at: string;
  order_number: string;
  total_cents: number;
  order_seller_details?: {
    items?: {
      product?: {
        product_type: string;
        single: {
          name: string;
        };
      };
    }[];
  }[];
}

export interface Suggestions {
  [key: string]: string[] | number;
  totalCost: number;
  orderCount: number;
}