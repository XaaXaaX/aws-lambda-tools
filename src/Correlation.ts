import { EventRecognizer } from "./Events/EventRecognizer";
import { v4 as uuidv4 } from "uuid";
import { Nullable } from "./Types";

export class Correlation {
  private static readonly HTTP_CORRELATION_ID_HEADER: string = "x-correlation-id";

  /**
   * Capture CorrelationID from various sources
   *
   * API Gateway, Application Load Balancer; captured from Headers
   * SNS, SQS, DynamoDB; captured from the payload
   */
  static GetCorrelationId = (event: any): string | undefined => {
    let cid: Nullable<string> = undefined;
    if (event) {
      if (EventRecognizer.IsApiGatewayEvent(event)) 
        cid = event?.headers?.[Correlation.HTTP_CORRELATION_ID_HEADER];
      else if (EventRecognizer.IsALBEvent(event)) 
          cid = event?.headers?.[Correlation.HTTP_CORRELATION_ID_HEADER];
      else if (EventRecognizer.IsSNSEvent(event))
        cid = event.Records?.[0]?.Sns?.MessageAttributes?.x_correlation_id?.Value;
      else if (EventRecognizer.IsSQSEvent(event))
        cid = event.Records?.[0]?.messageAttributes?.x_correlation_id?.stringValue;
    }

    return cid ?? uuidv4();
  };
}
