export interface ParsedError {
  message: string;
  field?: string;
}

export interface ErrorHandlerResponse {
  errors: ParsedError[];
}
