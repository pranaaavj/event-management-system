import express from 'express';
import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';

const router = express.Router();

const eventPackageDefinition = protoLoader.loadSync('./src/event.proto');
const eventProto = grpc.loadPackageDefinition(eventPackageDefinition).event;
const eventClient = new eventProto.EventService(
  process.env.EVENT_SERVICE_HOST || 'localhost:50052',
  grpc.credentials.createInsecure()
);

const ticketPackageDefinition = protoLoader.loadSync('./src/ticket.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const ticketProto = grpc.loadPackageDefinition(ticketPackageDefinition).ticket;
const ticketClient = new ticketProto.TicketService(
  process.env.TICKET_SERVICE_HOST || 'localhost:50051',
  grpc.credentials.createInsecure()
);

router.post('/events', (req, res) => {
  eventClient.createEvent({ name: req.body.name }, (err, response) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ eventId: response.eventId, name: response.name });
  });
});

router.get('/events/:eventId', (req, res) => {
  eventClient.getEvent({ eventId: req.params.eventId }, (err, response) => {
    if (err) {
      res.status(404).json({ error: err.message });
      return;
    }
    res.json({ eventId: response.eventId, name: response.name });
  });
});

router.post('/tickets', (req, res) => {
  ticketClient.createTicket(
    { eventId: req.body.eventId, seat: req.body.seat },
    (err, response) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({
        ticketId: response.ticketId,
        eventId: response.eventId,
        seat: response.seat,
        status: response.status,
      });
    }
  );
});

router.patch('/tickets/:ticketId/book', (req, res) => {
  ticketClient.bookTicket(
    { ticketId: req.params.ticketId },
    (err, response) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({
        ticketId: response.ticketId,
        eventId: response.eventId,
        seat: response.seat,
        status: response.status,
      });
    }
  );
});

export { router as routes };
