export interface RegisterUserRequest {
  identificationType: IdentificationType;
  identificationNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  cellphoneNumber: string;
  password: string;
  confirmPassword: string;
  clientBaseUrl?: string;
}

export enum IdentificationType {
  CedulaCiudadania = 0,
  CedulaExtranjeria = 1,
  TarjetaIdentidad = 2,
  Passport = 3,
  Other = 4,
}
