import { TicketStatus } from "@prisma/client";
import QRCode from "qrcode";
import { prisma } from "../lib/prisma.ts";
import { notFound, forbidden, conflict } from "../lib/errors.ts";
import type { RegisterTicketInput } from "../schemas/tickets.schema.ts";

async function generateQR(ticketId: string): Promise<string> {
  return QRCode.toDataURL(ticketId, { errorCorrectionLevel: "H" });
}

export async function registerForEvent(
  userId: string,
  eventId: string,
  input: RegisterTicketInput,
) {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: { _count: { select: { tickets: { where: { status: "CONFIRMED" } } } } },
  });
  if (!event) throw notFound("Event");
  if (event.status !== "PUBLISHED") throw conflict("Event is not available for registration");

  const existing = await prisma.ticket.findFirst({
    where: { userId, eventId, status: { not: TicketStatus.CANCELLED } },
  });
  if (existing) throw conflict("Already registered for this event");

  if (event._count.tickets >= event.capacity) {
    throw conflict("Event is full");
  }

  const ticket = await prisma.ticket.create({
    data: {
      userId,
      eventId,
      qrCode: crypto.randomUUID(),
      ticketType: input.ticketType,
      status: TicketStatus.CONFIRMED,
    },
  });

  const qrDataUrl = await generateQR(ticket.id);
  return { ...ticket, qrDataUrl };
}

export async function getUserTickets(userId: string) {
  return prisma.ticket.findMany({
    where: { userId },
    include: {
      event: {
        select: {
          id: true,
          title: true,
          dateTime: true,
          location: true,
          imageUrl: true,
          status: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getTicketById(ticketId: string, userId: string) {
  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    include: {
      event: true,
      checkIn: true,
    },
  });
  if (!ticket) throw notFound("Ticket");
  if (ticket.userId !== userId) throw forbidden();

  const qrDataUrl = await generateQR(ticket.id);
  return { ...ticket, qrDataUrl };
}

export async function cancelTicket(ticketId: string, userId: string) {
  const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
  if (!ticket) throw notFound("Ticket");
  if (ticket.userId !== userId) throw forbidden();
  if (ticket.status === TicketStatus.CANCELLED) throw conflict("Ticket already cancelled");

  return prisma.ticket.update({
    where: { id: ticketId },
    data: { status: TicketStatus.CANCELLED },
  });
}
