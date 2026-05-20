import { Router } from "express";
import authRoutes from "./auth.routes.ts";
import eventsRoutes from "./events.routes.ts";
import { ticketsStandaloneRouter } from "./tickets.routes.ts";
import checkinRoutes from "./checkin.routes.ts";

const router = Router();

router.use("/auth", authRoutes);
router.use("/events", eventsRoutes);
router.use("/tickets", ticketsStandaloneRouter);
router.use("/checkin", checkinRoutes);

export default router;
