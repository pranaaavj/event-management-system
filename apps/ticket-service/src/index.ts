import { Server, ServerCredentials } from '@grpc/grpc-js';
import { TicketServiceService } from 'proto/dist/ticket.js';
import { createTicket, bookTicket } from './service';

const server = new Server();
server.addService(TicketServiceService, { createTicket, bookTicket });

server.bindAsync('0.0.0.0:50051', ServerCredentials.createInsecure(), () => {
  console.log('Ticket Service on port 50051');
  server.start();
});
