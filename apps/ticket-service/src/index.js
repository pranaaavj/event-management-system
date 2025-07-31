import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { createTicket, bookTicket } from './service.js';

const packageDefinition = protoLoader.loadSync('./src/ticket.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const ticketProto = grpc.loadPackageDefinition(packageDefinition).ticket;

const server = new grpc.Server();
server.addService(ticketProto.TicketService.service, {
  createTicket,
  bookTicket,
});

server.bindAsync(
  '0.0.0.0:50051',
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log('Ticket Service on port 50051');
    server.start();
  }
);
