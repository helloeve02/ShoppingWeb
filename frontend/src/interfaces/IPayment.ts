// interfaces/IPayment.ts

// src/interfaces/IPayment.ts

export interface PaymentInterface {
  id?: number;
  PayerName?:string;
  amount: number;
  PaymentDate: Date;
  user_id: number;
  PaymentStatusID: number;
  PaymentStatus:PaymentStatusInterface;
  TransactionsID: number;
  PaymentImage: File | null;
}

export interface TansectionInterface {
  ID?: number;
  Amount?: Float32Array;
  History? : Date;
}
export interface PaymentStatusInterface {
  ID?: number;
  Status?: string;
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

  export interface TableDataInterface {
    ID: number;
    Username: string;
    Amount: number;
    PaymentImage: string; // URL หรือ Path หลักฐานการโอน
  }
  