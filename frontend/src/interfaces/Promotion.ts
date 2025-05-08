export interface PromotionInterface {
    ID?: number;
    promotion_name: string;
    description?: string;
    discount_type: boolean;
    discount_value: number;
    usage_limit: number;
    start_date: string;
    end_date: string;
    products?: {
      product_id: number;
      discount_value: number;
    }[];
    users?: {
      user_id: number;
    }[];
    promotion_status_id: number;
}
