import type { Request, Response } from "express";
import * as checkinService from "../services/checkin.service.ts";
import type { ScanQRInput, ManualCheckinInput } from "../schemas/checkin.schema.ts";

export async function scanQR(req: Request, res: Response) {
  const result = await checkinService.scanQR(req.body as ScanQRInput, req.user!.id);
  res.json(result);
}

export async function manualCheckIn(req: Request, res: Response) {
  const result = await checkinService.manualCheckIn(req.body as ManualCheckinInput, req.user!.id);
  res.json(result);
}

export async function getStats(req: Request, res: Response) {
  const stats = await checkinService.getCheckinStats(String(req.params["eventId"]));
  res.json(stats);
}
