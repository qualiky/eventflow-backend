import type { Request, Response } from "express";
import * as ticketsService from "../services/tickets.service.ts";
import type { RegisterTicketInput } from "../schemas/tickets.schema.ts";

export async function register(req: Request, res: Response) {
  const ticket = await ticketsService.registerForEvent(
    req.user!.id,
    String(req.params["eventId"]),
    req.body as RegisterTicketInput,
  );
  res.status(201).json(ticket);
}

export async function getMyTickets(req: Request, res: Response) {
  const tickets = await ticketsService.getUserTickets(req.user!.id);
  res.json(tickets);
}

export async function getById(req: Request, res: Response) {
  const ticket = await ticketsService.getTicketById(String(req.params["id"]), req.user!.id);
  res.json(ticket);
}

export async function cancel(req: Request, res: Response) {
  const ticket = await ticketsService.cancelTicket(String(req.params["id"]), req.user!.id);
  res.json(ticket);
}
