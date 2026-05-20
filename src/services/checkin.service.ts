import { prisma } from "../lib/prisma.ts";
import { notFound, conflict } from "../lib/errors.ts";
import type { ScanQRInput, ManualCheckinInput } from "../schemas/checkin.schema.ts";

export async function scanQR(input: ScanQRInput, performedBy: string) {
  // qrCode field stores the ticketId UUID — look up by id
  const ticket = await prisma.ticket.findUnique({
    where: { id: input.qrCode },
    include: { user: { select: { id: true, name: true, email: true } } },
  });
  if (!ticket) throw notFound("Ticket");
  if (ticket.status === "CANCELLED") throw conflict("Ticket is cancelled");

  const existing = await prisma.checkIn.findUnique({ where: { ticketId: ticket.id } });
  if (existing) throw conflict("Already checked in");

  const checkIn = await prisma.checkIn.create({
    data: { ticketId: ticket.id, checkedInBy: performedBy },
  });

  return { checkIn, attendee: ticket.user };
}

export async function manualCheckIn(input: ManualCheckinInput, performedBy: string) {
  const ticket = await prisma.ticket.findFirst({
    where: {
      eventId: input.eventId,
      status: "CONFIRMED",
      user: { email: input.email },
    },
    include: { user: { select: { id: true, name: true, email: true } } },
  });
  if (!ticket) throw notFound("Registration for this email");

  const existing = await prisma.checkIn.findUnique({ where: { ticketId: ticket.id } });
  if (existing) throw conflict("Already checked in");

  const checkIn = await prisma.checkIn.create({
    data: { ticketId: ticket.id, checkedInBy: performedBy },
  });

  return { checkIn, attendee: ticket.user };
}

export async function getCheckinStats(eventId: string) {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: { id: true, title: true, capacity: true },
  });
  if (!event) throw notFound("Event");

  const [registered, checkedIn] = await Promise.all([
    prisma.ticket.count({ where: { eventId, status: "CONFIRMED" } }),
    prisma.checkIn.count({ where: { ticket: { eventId } } }),
  ]);

  const recent = await prisma.checkIn.findMany({
    where: { ticket: { eventId } },
    include: { ticket: { include: { user: { select: { name: true, email: true } } } } },
    orderBy: { checkedInAt: "desc" },
    take: 20,
  });

  return {
    event,
    registered,
    checkedIn,
    remaining: registered - checkedIn,
    checkInRate: registered > 0 ? Math.round((checkedIn / registered) * 100) : 0,
    recent,
  };
}
