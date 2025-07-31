import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { createEvent, getEvent } from './service.js';

const packageDefinition = protoLoader.loadSync('./src/event.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const eventProto = grpc.loadPackageDefinition(packageDefinition).event;

const server = new grpc.Server();
server.addService(eventProto.EventService.service, { createEvent, getEvent });

server.bindAsync(
  '0.0.0.0:50052',
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log('Event Service on port 50052');
    server.start();
  }
);
