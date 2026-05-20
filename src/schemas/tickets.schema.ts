import { z } from "zod";
import { TicketType } from "@prisma/client";

export const registerTicketSchema = z.object({
  ticketType: z.nativeEnum(TicketType).optional().default(TicketType.FREE),
});

export type RegisterTicketInput = z.infer<typeof registerTicketSchema>;
