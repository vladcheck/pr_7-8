import type { Response } from "express";
import { StatusCodes, ReasonPhrases } from "http-status-codes";

export const getOk = (res: Response, send?: any) =>
  res.status(StatusCodes.OK).send(send ?? ReasonPhrases.OK);
export const getNotFound = (res: Response, send?: any) =>
  res.status(StatusCodes.NOT_FOUND).send(send ?? ReasonPhrases.NOT_FOUND);
export const getBadRequest = (res: Response, send?: any) =>
  res.status(StatusCodes.BAD_REQUEST).send(send ?? ReasonPhrases.BAD_REQUEST);
export const getCreated = (res: Response, send?: any) =>
  res.status(StatusCodes.CREATED).send(send ?? ReasonPhrases.CREATED);
