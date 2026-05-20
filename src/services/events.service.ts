import { EventStatus, type Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.ts";
import { notFound, forbidden } from "../lib/errors.ts";
import type { CreateEventInput, UpdateEventInput } from "../schemas/events.schema.ts";

export async function listEvents(query: {
  category?: string;
  search?: string;
  from?: string;
  to?: string;
}) {
  const where: Prisma.EventWhereInput = {
    status: EventStatus.PUBLISHED,
    ...(query.category && { category: query.category }),
    ...(query.search && {
      OR: [
        { title: { contains: query.search, mode: "insensitive" } },
        { description: { contains: query.search, mode: "insensitive" } },
        { location: { contains: query.search, mode: "insensitive" } },
      ],
    }),
    ...(query.from || query.to
      ? {
          dateTime: {
            ...(query.from && { gte: new Date(query.from) }),
            ...(query.to && { lte: new Date(query.to) }),
          },
        }
      : {}),
  };

  return prisma.event.findMany({
    where,
    orderBy: { dateTime: "asc" },
    include: {
      organiser: { select: { id: true, name: true } },
      _count: { select: { tickets: { where: { status: "CONFIRMED" } } } },
    },
  });
}

export async function getEventById(id: string) {
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      organiser: { select: { id: true, name: true } },
      _count: { select: { tickets: { where: { status: "CONFIRMED" } } } },
    },
  });
  if (!event) throw notFound("Event");
  return event;
}

export async function createEvent(input: CreateEventInput, organiserId: string) {
  return prisma.event.create({
    data: { ...input, dateTime: new Date(input.dateTime), organiserId },
    include: { organiser: { select: { id: true, name: true } } },
  });
}

export async function updateEvent(
  id: string,
  input: UpdateEventInput,
  requesterId: string,
) {
  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) throw notFound("Event");
  if (event.organiserId !== requesterId) throw forbidden();

  return prisma.event.update({
    where: { id },
    data: {
      ...input,
      ...(input.dateTime && { dateTime: new Date(input.dateTime) }),
    },
    include: { organiser: { select: { id: true, name: true } } },
  });
}

export async function cancelEvent(id: string, requesterId: string) {
  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) throw notFound("Event");
  if (event.organiserId !== requesterId) throw forbidden();

  return prisma.event.update({
    where: { id },
    data: { status: EventStatus.CANCELLED },
  });
}

export async function getAttendees(id: string, requesterId: string) {
  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) throw notFound("Event");
  if (event.organiserId !== requesterId) throw forbidden();

  return prisma.ticket.findMany({
    where: { eventId: id, status: "CONFIRMED" },
    include: { user: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: "asc" },
  });
}
