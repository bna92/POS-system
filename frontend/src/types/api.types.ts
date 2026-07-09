export interface ApiMessage {
  message: string;
}

export interface ApiValidationError {
  message: string;
  errors?: { field: string; message: string }[];
}
