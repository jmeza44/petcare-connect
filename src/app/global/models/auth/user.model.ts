import { UserAddress } from './user-address.model';

export interface User {
  email: string;
  firstName: string;
  lastName: string;
  callingCode: string;
  phoneNumber: string;
  address: UserAddress;
  role: string;
}
