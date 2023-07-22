import { APIGatewayProxyEvent, SNSEvent } from "aws-lambda";
import { Factory } from "../src/Factory";
import { LambdaMiddleware } from "../src/LambdaMiddleware";
import '../src/Middlewares/LambdaMiddlewareExtensions'
import { ApiGatewayProxyEventMock } from "./__mock__/ApiGatewayEventMock";
describe("LambdaFactory Validation", () => {
  const corelId = "7687cca1-4316-1116-9a51-fdda3d3852d7";
  const reqId = "9997cca1-4316-1116-9a51-fdda3d3852d7";
  test("LambdaFactory Create shall return context with event but tracing data", () => {
    const snsEvent: SNSEvent = {
      Records: [
        {
          EventSource: "aws:sns",
          Sns: {
            MessageId: reqId,
            MessageAttributes: {
              x_correlation_id: {
                Type: "String",
                Value: corelId,
              },
            },
          },
        },
      ],
    } as unknown as SNSEvent;

    let middleware = Factory.Create(snsEvent);
    expect(middleware).toBeInstanceOf(LambdaMiddleware);
    expect(middleware.Context).toBeDefined();
    expect(middleware.Context.Event).toEqual(snsEvent);
    expect(middleware.Context.EventSource).toBeDefined();
    expect(middleware.Context.Tracing).toBeUndefined();
    expect(middleware.Context.Message).toBeUndefined();
    expect(middleware.Context.Parameters).toBeUndefined();
  });

  test("LambdaMiddleware Use shall return Message", async () => {
    const snsEvent: SNSEvent = {
      Records: [
        {
          EventSource: "aws:sns",
          EventVersion: "1.0",
          EventSubscriptionArn:
            "arn:aws:sns:eu-west-1:220766614489:mytopic:9e8b3459-64b7-4941-a0b0-e0b42738137d",
          Sns: {
            Type: "Notification",
            MessageId: reqId,
            TopicArn:
              "arn:aws:sns:eu-west-1:220766614489:mytopic",
            Message:
              '{\n "Name": "MyName"}',
            Timestamp: "2021-09-09T11:56:19.099Z",
            SignatureVersion: "1",
            Signature:
              "O+D7YBGPkOZkT1RAU7qX8Ev1iJdp5Ll41gJlV6GI/ycMOiR/ODntfmz0Tk1hDJL0/zBYB70Xh80IxYPVzKDaegXrIWLWvhC1cMgVH6fSH6F4MWHbQO3btKx2j9f1IyWngyDwzbCo9SC9RlRzBNReEGVp6krn8MlkJBDxR2G41Ccn1LEenPT1Wb2eThBZuUqqQuZdli17KivloToylPh4VlzjJcDJ34dduiWa+wfLMkUsw0HzFuOqTejQ1SOBIjSWkMCZKMOdle/XH3THe6fxE1bKAmoWZc+2q0hZWsvyxUAjfngLq0FpwjtFDV+25SnrB283QRD0HpOmAVfqHaBwAQ==",
            SigningCertUrl:
              "https://sns.eu-west-1.amazonaws.com/SimpleNotificationService-010a507c1833636cd94bdb98bd93083a.pem",
            UnsubscribeUrl:
              "https://sns.eu-west-1.amazonaws.com/?Action=Unsubscribe&SubscriptionArn=arn:aws:sns:eu-west-1:220766614489:mytopic:9e8b3459-64b7-4941-a0b0-e0b42738137d",
            MessageAttributes: {
              x_correlation_id: {
                Type: "String",
                Value: corelId,
              },
            },
          },
        },
      ],
    } as unknown as SNSEvent;

    let middleware = Factory.Create(snsEvent)
    middleware.UseEventPayloadExtraction();
    await middleware.Invoke();
    expect(middleware).toBeInstanceOf(LambdaMiddleware);
    expect(middleware.Context).toBeDefined();
    expect(middleware.Context.Message).toBeDefined();
    expect(middleware.Context.Event).toEqual(snsEvent);
    expect(middleware.Context.Tracing).toBeUndefined();
  });

  test("Lambda Middleware Use shall return enriched context based on selected Middlewares", async () => {
    const event: APIGatewayProxyEvent = ApiGatewayProxyEventMock;
    event.body = "{\"Pagination\":{\"Limit\":10,\"PageId\":null,\"Order\":\"Asc\"}}";
    event.headers = {
      authorization: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJSQy0zNjU2NzgiLCJzY29wZSI6W10sImlhdCI6MTYwMjE2NjY2NiwibmJmIjoxNjAyMTY2NjY2LCJleHAiOjE2MjI1NzA2ODUsImF1ZCI6WyJjYWFzIiwibGFhcyJdLCJpc3MiOiJodHRwczovL2Rldi5sb2dpbi5hcGkuZGlnbnAuY29tL3YwLWFscGhhIiwianRpIjoiNTZkNGY4NjUtNGVkZi00ODAzLTllZDktYzFiM2ZmMWZiZmM1In0.oVBfKET_hhPaiaLAhN9BKJq4nvZ5FzzweKKzJvST6Fo"
    };
    event.pathParameters = { ["ClassifiedId"]: "123456789" };

    const middleware = Factory.Create(event);
    middleware
      .UseCorrelation()
      .UseRequestTracking()
      .UseEventParametersExtraction()
      .UseEventPayloadExtraction();
    
    await middleware.Invoke();
    expect(middleware).toBeInstanceOf(LambdaMiddleware);
    expect(middleware.Context).toBeDefined();
    expect(middleware.Context.Message).toBeDefined();
    expect(middleware.Context.Parameters).toBeDefined();
    expect(middleware.Context.Event).toEqual(event);
    expect(middleware.Context.Tracing).toBeDefined();
  });

});
