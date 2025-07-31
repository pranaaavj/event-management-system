import express from 'express';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';

const router = express.Router();

const eventPackageDefinition = protoLoader.loadSync(
  '../../packages/proto/src/event.proto',
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  }
);
const eventProto = grpc.loadPackageDefinition(eventPackageDefinition)
  .event as any;
const eventClient = new eventProto.EventService(
  'localhost:50052',
  grpc.credentials.createInsecure()
);

const ticketPackageDefinition = protoLoader.loadSync(
  '../../packages/proto/src/ticket.proto',
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  }
);
const ticketProto = grpc.loadPackageDefinition(ticketPackageDefinition)
  .ticket as any;
const ticketClient = new ticketProto.TicketService(
  'localhost:50051',
  grpc.credentials.createInsecure()
);

router.post('/events', (req, res) => {
  eventClient.createEvent(
    { name: req.body.name },
    (err: any, response: any) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ eventId: response.eventId, name: response.name });
    }
  );
});

router.get('/events/:eventId', (req, res) => {
  eventClient.getEvent(
    { eventId: req.params.eventId },
    (err: any, response: any) => {
      if (err) {
        res.status(404).json({ error: err.message });
        return;
      }
      res.json({ eventId: response.eventId, name: response.name });
    }
  );
});

router.post('/tickets', (req, res) => {
  ticketClient.createTicket(
    { eventId: req.body.eventId, seat: req.body.seat },
    (err: any, response: any) => {
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
    (err: any, response: any) => {
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
