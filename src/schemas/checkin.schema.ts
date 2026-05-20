import { z } from "zod";

export const scanQRSchema = z.object({
  qrCode: z.string().min(1, "QR code is required"),
});

export const manualCheckinSchema = z.object({
  email: z.email(),
  eventId: z.string().uuid(),
});

export type ScanQRInput = z.infer<typeof scanQRSchema>;
export type ManualCheckinInput = z.infer<typeof manualCheckinSchema>;
