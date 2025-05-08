export interface ProductInterface {
	ID?: number;
	product_name?: string;
	description?: string;
	price?: number;
	stock?: number;
	brand_id?: number;
	product_status_id?: number;
	category_id?: number; 
	user_id?: number;
	product_images?: { image: string }[];
	promotions?: number[];
	reviews?: Array<{
		rating?: number;
	}>;
}