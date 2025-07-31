import { v4 as uuidv4 } from 'uuid';

const tickets = [];

export const createTicket = (call, callback) => {
  const ticket = {
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

export const bookTicket = (call, callback) => {
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
