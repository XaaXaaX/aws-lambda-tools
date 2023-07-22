import { LambdaEvent, Parameters } from "./LambdaEvent";
import { EventRecognizer } from "./EventRecognizer";

export class EventParameters {
    static GetParameters(event: LambdaEvent): Parameters {
        if (event) {
            if (EventRecognizer.IsApiGatewayEvent(event)) return event.pathParameters as Parameters;
            if (EventRecognizer.IsALBEvent(event)) return event.queryStringParameters as Parameters;
            
        }
        return null;
    }
}