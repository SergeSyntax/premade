import { AxiosError } from "axios";

interface ParsedError {
  message: string;
  field?: string;
}

interface CustomError {
  errors: ParsedError[];
}

export type ServerError = AxiosError<CustomError>;
