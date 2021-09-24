import { Subjects, Publisher, ExpirationCompleteEvent } from '@sergway/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
