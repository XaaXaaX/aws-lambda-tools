import {
    ALBEvent,
    APIGatewayProxyEvent,
    SNSEvent,
    SQSEvent
} from "aws-lambda";
import { LambdaEvent } from "./LambdaEvent";
import { EventSource } from "./EventSource";

export class EventRecognizer {
    static IsSNSEvent(event: LambdaEvent): event is SNSEvent {
        return (event as SNSEvent)?.Records?.[0]?.EventSource == EventSource.SNS;
    }

    static IsSQSEvent(event: LambdaEvent): event is SQSEvent {
        return (event as SQSEvent)?.Records?.[0]?.eventSource == EventSource.SQS;
    }

    static IsALBEvent(event: LambdaEvent): event is ALBEvent {
        return (event as ALBEvent)?.requestContext?.elb !== undefined;
    }

    static IsApiGatewayEvent(event: LambdaEvent): event is APIGatewayProxyEvent {
        return (event as APIGatewayProxyEvent)?.requestContext?.apiId !== undefined;
    }

    static GetEventSource(event: LambdaEvent): EventSource | undefined {
        if (EventRecognizer.IsApiGatewayEvent(event)) return EventSource.ApiGetway;
        if (EventRecognizer.IsALBEvent(event)) return EventSource.ApplicationLoadBalancer;
        if (EventRecognizer.IsSNSEvent(event)) return EventSource.SNS;
        if (EventRecognizer.IsSQSEvent(event)) return EventSource.SQS;

        return undefined;
    }
}