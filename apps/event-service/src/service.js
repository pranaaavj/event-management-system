import { v4 as uuidv4 } from 'uuid';

const events = [];

export const createEvent = (call, callback) => {
  const event = { eventId: uuidv4(), name: call.request.name };
  events.push(event);
  callback(null, { eventId: event.eventId, name: event.name });
};

export const getEvent = (call, callback) => {
  const event = events.find((e) => e.eventId === call.request.eventId);
  if (!event) {
    callback(new Error('Event not found'), null);
    return;
  }
  callback(null, { eventId: event.eventId, name: event.name });
};
