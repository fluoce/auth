import { Request } from 'express';

export interface AuthRequestInterface extends Request {
  authRt?: string;
}
