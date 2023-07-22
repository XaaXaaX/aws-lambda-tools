import { LambdaMiddleware } from "../../src//LambdaMiddleware"
import { LambdaContext } from "../../src//Context/LambdaContext"
import { LambdaEvent } from "../../src//Events/LambdaEvent"
import { SNSEvent } from "aws-lambda";
import { CorrelationMiddleware } from "../../src//Middlewares/CorrelationMiddleware";
import "../../src//Middlewares/LambdaMiddlewareExtensions";
import { EventPayloadMiddleware } from "../../src//Middlewares/EventPayloadMiddleware";
describe("LambdaMiddleware Validation", () => {
  const corelId = "7687cca1-4316-1116-9a51-fdda3d3852d7";
  const reqId = "9997cca1-4316-1116-9a51-fdda3d3852d7";
  const snsEvent: SNSEvent= {
    Records: [
        {
          EventSource: "aws:sns",
          EventVersion: "1.0",
          EventSubscriptionArn: "arn:aws:sns:eu-west-1:220766614489:mytopic:9e8b3459-64b7-4941-a0b0-e0b42738137d",
          Sns: {
            Type: "Notification",
            MessageId: reqId,
            TopicArn: "arn:aws:sns:eu-west-1:220766614489:mytoic",
            Message: "{\n \"Name\": \"MyName\"}",
            Timestamp: "2021-09-09T11:56:19.099Z",
            SignatureVersion: "1",
            Signature: "O+D7YBGPkOZkT1RAU7qX8Ev1iJdp5Ll41gJlV6GI/ycMOiR/ODntfmz0Tk1hDJL0/zBYB70Xh80IxYPVzKDaegXrIWLWvhC1cMgVH6fSH6F4MWHbQO3btKx2j9f1IyWngyDwzbCo9SC9RlRzBNReEGVp6krn8MlkJBDxR2G41Ccn1LEenPT1Wb2eThBZuUqqQuZdli17KivloToylPh4VlzjJcDJ34dduiWa+wfLMkUsw0HzFuOqTejQ1SOBIjSWkMCZKMOdle/XH3THe6fxE1bKAmoWZc+2q0hZWsvyxUAjfngLq0FpwjtFDV+25SnrB283QRD0HpOmAVfqHaBwAQ==",
            SigningCertUrl: "https://sns.eu-west-1.amazonaws.com/SimpleNotificationService-010a507c1833636cd94bdb98bd93083a.pem",
            UnsubscribeUrl: "https://sns.eu-west-1.amazonaws.com/?Action=Unsubscribe&SubscriptionArn=arn:aws:sns:eu-west-1:220766614489:mytopic:9e8b3459-64b7-4941-a0b0-e0b42738137d",
            MessageAttributes:{
              x_correlation_id: {
                Type: "String",
                Value: corelId
              }
            }
          }
        }
    ]
} as unknown as SNSEvent;

  let context:LambdaContext<LambdaEvent> = {
    Event: snsEvent,
    Tracing: {
      CorrelationId: corelId,
      RequestId: reqId
    }
  }
  test("LambdaMiddleware init shall be valid", () => {
    const lambdaMiddleware = new LambdaMiddleware(context);
    expect(lambdaMiddleware).toBeDefined();
    expect(lambdaMiddleware.Context).toEqual(context);
    expect(lambdaMiddleware.Context.Tracing).toBeDefined();
    expect(lambdaMiddleware.Context.Tracing!.CorrelationId).toEqual(corelId);
    expect(lambdaMiddleware.Context.Tracing!.RequestId).toEqual(reqId);
    expect(lambdaMiddleware.middlewares).toBeDefined();
    expect(lambdaMiddleware.middlewares.length).toBe(0);
  });

  test("LambdaMiddleware Use shall return LambdaMiddleware", () => {
    const lambdaMiddleware = new LambdaMiddleware(context);
    let useReturn = lambdaMiddleware.UseCorrelation();

    expect(useReturn).toBeDefined();
    expect(useReturn).toBeInstanceOf(LambdaMiddleware);
  });

  test("LambdaMiddleware Use shall return LambdaMiddleware", () => {
    const lambdaMiddleware = new LambdaMiddleware(context);
    let useReturn = lambdaMiddleware.Use(CorrelationMiddleware);

    expect(useReturn).toBeDefined();
    expect(useReturn).toBeInstanceOf(LambdaMiddleware);
  });

  test("LambdaMiddleware Use shall return Message", async () => {
    const lambdaMiddleware = new LambdaMiddleware(context);
    let useReturn = lambdaMiddleware.Use(EventPayloadMiddleware);
    await lambdaMiddleware.Invoke();
    expect(useReturn).toBeDefined();
    expect(useReturn).toBeInstanceOf(LambdaMiddleware);
  });
})