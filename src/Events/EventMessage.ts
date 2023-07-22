import { LambdaEvent } from "./LambdaEvent";
import { EventRecognizer } from "./EventRecognizer";

export type Message = JSON;
export type Messages =  Array<JSON>;

const defaultEmptyMeassage = '{}';
export class EventMessage {
  static GetMessage(event: LambdaEvent): Message {
    if (event) {
      if (EventRecognizer.IsApiGatewayEvent(event) ||
          EventRecognizer.IsALBEvent(event)) return JSON.parse(event?.body ?? defaultEmptyMeassage);
      if (EventRecognizer.IsSNSEvent(event)) return JSON.parse(event.Records?.[0]?.Sns?.Message?.length ? event.Records?.[0]?.Sns?.Message : defaultEmptyMeassage);
      if (EventRecognizer.IsSQSEvent(event)) return JSON.parse(event.Records[0]?.body?.length ? event.Records?.[0]?.body : defaultEmptyMeassage);
    }

    return {} as JSON;
  }

  static GetMessages(event: LambdaEvent): Messages {
      if (EventRecognizer.IsApiGatewayEvent(event) ||
          EventRecognizer.IsALBEvent(event)) return [ JSON.parse(event?.body ?? '{}') ];
      if (EventRecognizer.IsSNSEvent(event)) return event?.Records?.map( r => JSON.parse(r?.Sns?.Message));
      if (EventRecognizer.IsSQSEvent(event)) return event?.Records?.map( r => JSON.parse(r?.body));

    return [];
  }
}