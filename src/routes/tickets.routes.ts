import { Router } from "express";
import * as ticketsController from "../controllers/tickets.controller.ts";
import { authenticate } from "../middleware/auth.ts";
import { validate } from "../middleware/validate.ts";
import { registerTicketSchema } from "../schemas/tickets.schema.ts";

// Standalone ticket routes (mounted at /api/tickets)
const router = Router();

router.get("/", authenticate, ticketsController.getMyTickets);
router.get("/:id", authenticate, ticketsController.getById);
router.delete("/:id", authenticate, ticketsController.cancel);

// Also handles POST when nested under /api/events/:eventId/register
// The parent router passes mergeParams so :eventId is available
const nestedRouter = Router({ mergeParams: true });
nestedRouter.post(
  "/",
  authenticate,
  validate(registerTicketSchema),
  ticketsController.register,
);

export { nestedRouter as default };
export { router as ticketsStandaloneRouter };
