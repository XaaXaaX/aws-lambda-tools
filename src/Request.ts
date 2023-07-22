import { EventRecognizer } from "./Events/EventRecognizer";
import  { v4 as uuidv4 } from "uuid";

export class Request{
  private static readonly HTTP_REQUEST_ID_HEADER: string = "x-request-id";

  /**
   * Capture request id from various sources
   *
   * API Gateway, Application Load Balancer; captured from request context
   * SNS, SQS, DynamoDB; captured from the payload
   */
  static GetRequestId = (event: any): string => {
    let reqid =  undefined;
    if (event) {
      if (EventRecognizer.IsApiGatewayEvent(event))
        reqid = event?.requestContext?.requestId;
      else if (EventRecognizer.IsALBEvent(event))
          reqid = event?.headers?.[Request.HTTP_REQUEST_ID_HEADER];
      else if (EventRecognizer.IsSNSEvent(event))
        reqid = event?.Records[0]?.Sns?.MessageId;
      else if (EventRecognizer.IsSQSEvent(event))
        reqid = event?.Records?.[0]?.messageId;
    }

    return reqid ?? uuidv4();
  };
}