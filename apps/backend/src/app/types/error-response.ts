export interface IErrorSource {
  message: string;
  path: string;
}

export interface IErrorResponse {
  statusCode: number;
  message: string;
  errorSources: IErrorSource[];
}
