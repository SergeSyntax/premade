import { Subjects } from './subjects';

export interface TicketedCreatedEvent {
  subject: Subjects.TicketCreated;
  data: {
    id: string;
    title: string;
    price: number;
  };
}
