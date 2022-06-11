import { Request, Response } from "express";

export interface ICustomContext {
  req: Request;
  res: Response;
}
