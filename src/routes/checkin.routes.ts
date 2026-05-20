import { Router } from "express";
import * as checkinController from "../controllers/checkin.controller.ts";
import { authenticate, requireRole } from "../middleware/auth.ts";
import { validate } from "../middleware/validate.ts";
import { scanQRSchema, manualCheckinSchema } from "../schemas/checkin.schema.ts";

const router = Router();

router.post(
  "/scan",
  authenticate,
  requireRole("ORGANISER", "ADMIN"),
  validate(scanQRSchema),
  checkinController.scanQR,
);
router.post(
  "/manual",
  authenticate,
  requireRole("ORGANISER", "ADMIN"),
  validate(manualCheckinSchema),
  checkinController.manualCheckIn,
);
router.get(
  "/events/:eventId",
  authenticate,
  requireRole("ORGANISER", "ADMIN"),
  checkinController.getStats,
);

export default router;
