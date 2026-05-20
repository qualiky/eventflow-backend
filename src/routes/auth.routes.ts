import { Router } from "express";
import * as authController from "../controllers/auth.controller.ts";
import { authenticate } from "../middleware/auth.ts";
import { validate } from "../middleware/validate.ts";
import { registerSchema, loginSchema } from "../schemas/auth.schema.ts";

const router = Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post("/logout", authenticate, authController.logout);
router.get("/me", authenticate, authController.getMe);
router.patch("/me", authenticate, authController.updateProfile);

export default router;
