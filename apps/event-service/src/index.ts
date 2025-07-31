import { Server, ServerCredentials } from '@grpc/grpc-js';
import { EventServiceService } from 'proto/dist/event.js';
import { createEvent, getEvent } from './service';

const server = new Server();
server.addService(EventServiceService, { createEvent, getEvent });

server.bindAsync('0.0.0.0:50052', ServerCredentials.createInsecure(), () => {
  console.log('Event Service on port 50052');
  server.start();
});
