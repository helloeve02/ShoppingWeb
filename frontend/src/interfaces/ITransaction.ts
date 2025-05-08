export interface TransectionInterface {
    ID?: number;
    Amount?: number;
    History? : Date;
    UserID?: number;
    // Wallet: WalletsInterface;
    PaymentID?:number;
    PaymentStatus?: string;
}
export interface PaymentStatusInterface {
    ID?: number;
    Status?: string;
  }
export interface PaymentInterface {
    id?: number;
    PayerName?:string;
    Amount: number;
    PaymentDate: Date;  // Change this to Date
    UserID: number;
    // OrderID: number;
    PaymentStatusID: number;
    PaymentStatus:PaymentStatusInterface;
    // TransactionsID: number;
    // Transaction: TansectionInterface;
    // PaymentMethod: string;
    PaymentImage: File | null;
  }
  export interface WalletsInterface {
    ID? : number;
    Balance? : number;
}