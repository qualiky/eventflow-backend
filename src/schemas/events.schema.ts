import { z } from "zod";

export const createEventSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1),
  dateTime: z.iso.datetime(),
  location: z.string().min(1).max(300),
  capacity: z.number().int().positive(),
  imageUrl: z.url().optional(),
  category: z.string().max(100).optional(),
});

export const updateEventSchema = createEventSchema.partial();

export const eventQuerySchema = z.object({
  category: z.string().optional(),
  search: z.string().optional(),
  from: z.iso.datetime().optional(),
  to: z.iso.datetime().optional(),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
