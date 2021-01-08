import { NextFunction, Request, Response } from "express";

export default interface Middleware {
  (req: Request, res: Response, next: NextFunction): any;
}
