import { OrderInterface } from "./IOrder";
import { UsersInterface } from "./IUser";

export interface ReviewInterface {
    ID?: number;
    UpdatedAt?: Date;
    rating?: number;
    content?: string;
    image?: string;
    product_images?: { image?: string }[];
    UserID?: number;
    orderitems_id?: number;
    OrderStatusID?: number;
    ProductID?: number;
    Order?: OrderInterface;
    Product?: ProductInterface;
    User?: UsersInterface;
    favorites_count?: number;
    Favorites?: FavoritesInterface;
    Quantity?: number;
    TotalPrice?: number;
    OrderItems?: OrderitemInterface;
    product_id?: number;
  }	

  export interface FavoritesInterface{
    ID?: number;
    count?: number;
    Review?: ReviewInterface;
    User?: UsersInterface;
  }

  export interface OrderitemInterface {
    ID?: number;
    Quantity?: number;
    Price?: number;
    TotalPrice?: number;
    OrderID?: number;
    ProductID?: number;
    UserID?: number;
    Product?: ProductInterface;
    User?: UsersInterface;
    Order?:OrderInterface;
    content?: string;
    rating?: number;
}

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
  User?: UsersInterface;
}  