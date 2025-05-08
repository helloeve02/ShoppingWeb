import { InvoiceInterface } from "./Invoice";
import { ReturnInterface } from "./Return";

export interface CartitemInterface {
    ID?: number;
    Price?: number;
    Quantity?: number;
    // TotalPrice?: number;
    ProductID?: number;
    Product?: ProductInterface;
    UserID?: number;
    User?: UsersInterface;
    product_images?: { image: string }[];

}
export interface UsersInterface {

    ID?: number;

    Username?: string;

    FirstName?: string;

    LastName?: string;

    Email?: string;

    Phone?: string;

    Age?: number;

    BirthDay?: string;

    GenderID?: number;

    Password?: string;

    Role?: string;

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
    // product_images?: string[];
    product_images?:ProductImageInterface[];
}

export interface ProductImageInterface {
    ID?: number;
    image?: string;
    product_id?: number;
}

export interface OrderInterface {
    ID?: number;
    OrderDate?: Date;
    TotalPrice?: number;
    OrderstatusID?: number;
    UserID?: number;
    PaymentID?: number;
    Orderstatus?: OrderstatusInterface;
    Return?: ReturnInterface;
    User?: UsersInterface
    Invoice?: InvoiceInterface[];
    ShippingID?: number;
    WalletsID?: number;
    Wallets?:WalletsInterface;
}

export interface WalletsInterface {
    ID? : number;
    Balance? : number;
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
    // User?: UsersInterface;
    Order?:OrderInterface;
}

export interface OrderstatusInterface {
    ID?: number;
    Status?: number;
}

export interface PaymentInterface {
    ID?: number;
    Amount?: number;
    PaymentDate?: Date;
    UserID?: number;
    OrderID?: number;
    PaymentStatusID?: number;                        
	TransactionsID?: number;  
	PaymentMethod?: string;
	PaymentImage?: File ;
}

export interface ProductInterface {
    ID?: number;
    ProductName?: string;
    Description?: string;
    Price?: number;
    StockQuantity?: number;
    UserID?: number;
}

export interface ShippingInterface {
    ID?: number;
    Fee?: number;
    ShippingDate?: Date;
    ShippingName?:string;
    ShippingstatusID?: number;
    ShippingStatus?: ShippingstatusInterface;
}

export interface ShippingstatusInterface {
    ID?: number;
    Status?: number;
}

export interface AddressInterface {
    Name?: string;	
	Address?: string;	
	SubDistrict?: string;		
	District?: string;			    
	Province?: string;		
	PostalCode?: string;		
	PhoneNumber?: string;     
	AddressTypeID?: string	;
    AddressType?: AddressTypeInterface;
	UserID?: number;
	User?: UsersInterface;
}

export interface AddressTypeInterface {
    Type?: string;
}