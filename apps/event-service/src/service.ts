import { handleUnaryCall } from '@grpc/grpc-js';
import { v4 as uuidv4 } from 'uuid';

type Event = { eventId: string; name: string };
const events: Event[] = [];

export const createEvent: handleUnaryCall<any, any> = (call, callback) => {
  const event: Event = { eventId: uuidv4(), name: call.request.name };
  events.push(event);
  callback(null, { eventId: event.eventId, name: event.name });
};

export const getEvent: handleUnaryCall<any, any> = (call, callback) => {
  const event = events.find((e) => e.eventId === call.request.eventId);
  if (!event) {
    callback(new Error('Event not found'), null);
    return;
  }
  callback(null, { eventId: event.eventId, name: event.name });
};
