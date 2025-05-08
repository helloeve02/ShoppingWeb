import { OrderInterface } from "./IOrder";

export interface ReturnInterface {
  ID?: number;
  Description?: string;
  ProvingImage?: string;
  ReturnTypeID?: number;
  ReturnReasonID?: number;
  ReturnStatusID?: number;
  OrderID?: number;
  Order?: OrderInterface;
  ReturnStatus?: ReturnStatusInterface;
  ReturnType?: ReturnTypeInterface;
  ReturnReason?: ReturnReasonInterface;
  UserID?: number;
}

export interface ReturnTypeInterface {
  ID?: number;
  Name?: string;
}

export interface ReturnReasonInterface {
  ID?: number;
  Name?: string;
}

export interface ReturnStatusInterface {
  ID?: number;
  Name?: string;
}
