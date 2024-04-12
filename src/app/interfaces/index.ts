export interface Error {
  name: string;
  message: string;
  status?: number;
  stack?: string;
}

export interface IPopulate {
  path: string;
  model?: string;
  populate?: IPopulate;
}

export interface JwtPayload {
  id: string;
}
