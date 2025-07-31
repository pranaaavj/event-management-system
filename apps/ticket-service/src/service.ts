import { handleUnaryCall } from '@grpc/grpc-js';
import { v4 as uuidv4 } from 'uuid';

type Ticket = {
  ticketId: string;
  eventId: string;
  seat: string;
  status: string;
};
const tickets: Ticket[] = [];

export const createTicket: handleUnaryCall<any, any> = (call, callback) => {
  const ticket: Ticket = {
    ticketId: uuidv4(),
    eventId: call.request.eventId,
    seat: call.request.seat,
    status: 'AVAILABLE',
  };
  tickets.push(ticket);
  callback(null, {
    ticketId: ticket.ticketId,
    eventId: ticket.eventId,
    seat: ticket.seat,
    status: ticket.status,
  });
};

export const bookTicket: handleUnaryCall<any, any> = (call, callback) => {
  const ticket = tickets.find((t) => t.ticketId === call.request.ticketId);
  if (!ticket) {
    callback(new Error('Ticket not found'), null);
    return;
  }
  if (ticket.status === 'BOOKED') {
    callback(new Error('Ticket already booked'), null);
    return;
  }
  ticket.status = 'BOOKED';
  callback(null, {
    ticketId: ticket.ticketId,
    eventId: ticket.eventId,
    seat: ticket.seat,
    status: ticket.status,
  });
};
