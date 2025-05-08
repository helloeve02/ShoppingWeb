export interface AddressInterface {

    ID?: number;
    Name?: string;
    Address?: string;  
    SubDistrict?: string; 
    District?: string;
    Province?: string;
    PostalCode?: string;
    PhoneNumber?: string;
    TypeID?: number;
    AddressTypeID?: number;
    UserID?: number;
    AddressType?:TypeInterface;
    User?:UsersInterface;
  }

  export interface TypeInterface {
    // Type: ReactNode;

    ID?: number;
  
    Type?: string;
  
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