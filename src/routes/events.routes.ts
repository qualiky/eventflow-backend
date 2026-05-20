import { Router } from "express";
import * as eventsController from "../controllers/events.controller.ts";
import { authenticate, requireRole } from "../middleware/auth.ts";
import { validate } from "../middleware/validate.ts";
import { createEventSchema, updateEventSchema, eventQuerySchema } from "../schemas/events.schema.ts";
import ticketsRouter from "./tickets.routes.ts";

const router = Router();

// Public
router.get("/", validate(eventQuerySchema, "query"), eventsController.list);
router.get("/:id", eventsController.getById);

// Organiser only
router.post(
  "/",
  authenticate,
  requireRole("ORGANISER", "ADMIN"),
  validate(createEventSchema),
  eventsController.create,
);
router.put(
  "/:id",
  authenticate,
  requireRole("ORGANISER", "ADMIN"),
  validate(updateEventSchema),
  eventsController.update,
);
router.delete(
  "/:id",
  authenticate,
  requireRole("ORGANISER", "ADMIN"),
  eventsController.cancel,
);
router.get(
  "/:id/attendees",
  authenticate,
  requireRole("ORGANISER", "ADMIN"),
  eventsController.getAttendees,
);

// Nested: POST /events/:eventId/register
router.use("/:eventId/register", ticketsRouter);

export default router;
