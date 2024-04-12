export type User = {
  id?: number | string;
  email: string;
  username: string;
  firstname: string;
  lastname: string;
  password: string;
  createdAt?: string;
  updatedAt?: string;
};

export type stringInfo = {
  lowerCase: string;
  upperCase: string;
  characters: string[];
  length: number;
  extraInfo: Object | undefined;
};

export type ServiceError = {
  message: string;
  errorCode: string;
  statusCode: number;
};

export type AppError = {
  name?: string;
  stack?: string;
  message?: string;
  status?: number;
  options?: any;
};

export type Password = string | Buffer | NodeJS.TypedArray | DataView;
