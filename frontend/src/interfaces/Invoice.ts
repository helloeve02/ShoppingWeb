export interface InvoiceInterface {
  ID?: number;
  FullName?: string;
  Email?: string;
  TaxID?: string;
  InvoiceTypeID?: number;
  InvoiceType?: InvoiceTypeInterface;
  OrderID?: number;
  UserID?: number;
}

export interface InvoiceTypeInterface {
  ID?: number;
  Name?: string;
}
