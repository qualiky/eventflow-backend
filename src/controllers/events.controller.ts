import type { Request, Response } from "express";
import * as eventsService from "../services/events.service.ts";
import type { CreateEventInput, UpdateEventInput } from "../schemas/events.schema.ts";

export async function list(req: Request, res: Response) {
  const events = await eventsService.listEvents(req.query as Record<string, string>);
  res.json(events);
}

export async function getById(req: Request, res: Response) {
  const event = await eventsService.getEventById(String(req.params["id"]));
  res.json(event);
}

export async function create(req: Request, res: Response) {
  const event = await eventsService.createEvent(req.body as CreateEventInput, req.user!.id);
  res.status(201).json(event);
}

export async function update(req: Request, res: Response) {
  const event = await eventsService.updateEvent(
    String(req.params["id"]),
    req.body as UpdateEventInput,
    req.user!.id,
  );
  res.json(event);
}

export async function cancel(req: Request, res: Response) {
  const event = await eventsService.cancelEvent(String(req.params["id"]), req.user!.id);
  res.json(event);
}

export async function getAttendees(req: Request, res: Response) {
  const attendees = await eventsService.getAttendees(String(req.params["id"]), req.user!.id);
  res.json(attendees);
}
