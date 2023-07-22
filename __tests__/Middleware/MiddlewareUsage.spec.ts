import { SNSEvent } from "aws-lambda";
import { Factory } from "../../src//Factory";
import { LambdaMiddleware } from "../../src//LambdaMiddleware";
import { CorrelationMiddleware } from "../../src//Middlewares/CorrelationMiddleware";
import { RequestTrackingMiddleware } from "../../src//Middlewares/RequestTrackingMiddleware";
import "../../src//Middlewares/LoggingMiddlewareExtensions";
import "../../src//Middlewares/LambdaMiddlewareExtensions";
import { LambdaContext } from "../../src//Context/LambdaContext";
import { LambdaEvent } from "../../src//Events/LambdaEvent";

describe("Lambda Middleware usage Validation", () => {
  const corelId = "7687cca1-4316-1116-9a51-fdda3d3852d7";
  const reqId = "9997cca1-4316-1116-9a51-fdda3d3852d7";

  test("Lambda Middleware accpet type as param in Use Test", () => {
    const snsEvent: SNSEvent= {
      Records: [
        {
          EventSource: "aws:sns",
          Sns: {
            MessageId: reqId,
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

    let middleware = Factory.Create(snsEvent)
                            .Use(CorrelationMiddleware);

    expect(middleware).toBeInstanceOf(LambdaMiddleware);
    expect(middleware.Context).toBeDefined();
  });

  test("Lambda Middleware Generates event in context", () => {
    const snsEvent: SNSEvent= {
      Records: [
        {
          EventSource: "aws:sns",
          Sns: {
            MessageId: reqId,
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

    let middleware = Factory.Create(snsEvent)
                            .Use(CorrelationMiddleware);

    expect(middleware).toBeInstanceOf(LambdaMiddleware);
    expect(middleware.Context).toBeDefined();
    expect(middleware.Context.Event).toEqual(snsEvent);
  });

  test("Lambda Middleware usage with correlation middleware", async () => {
    const snsEvent: SNSEvent= {
      Records: [
        {
          EventSource: "aws:sns",
          Sns: {
            MessageId: reqId,
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

    let mx = Factory.Create(snsEvent)
                  .UseCorrelation()
                  .Use(CorrelationMiddleware);

    expect(mx.Context.Event).toEqual(snsEvent);
    expect(mx.middlewares).toBeDefined();
    expect(mx.middlewares.length).toEqual(2);
    expect(mx.Context.Tracing).toBeUndefined();

    await mx.Invoke();
    expect(mx.Context.Tracing).toBeDefined();
  });

  test("Lambda Middleware usage with both correlation and request trackings middleware", async () => {
    const snsEvent: SNSEvent= {
      Records: [
        {
          EventSource: "aws:sns",
          Sns: {
            MessageId: reqId,
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

    let mx = Factory.Create(snsEvent)
                  .Use(RequestTrackingMiddleware)
                  .UseCorrelation()
                  .Use(CorrelationMiddleware);

    expect(mx.Context.Event).toEqual(snsEvent);
    expect(mx.middlewares).toBeDefined();
    expect(mx.middlewares.length).toEqual(3);
    expect(mx.Context.Tracing).toBeUndefined();

    await mx.Invoke();

    expect(mx.Context.Tracing).toBeDefined();
  });

  test("Lambda Middleware usage with middleware extension methods", async () => {
    const snsEvent: SNSEvent= {
      Records: [
        {
          EventSource: "aws:sns",
          Sns: {
            MessageId: reqId,
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

    let mx = Factory.Create(snsEvent)
                  .UseRequestTracking()
                  .UseCorrelation();

    expect(mx.Context.Event).toEqual(snsEvent);
    expect(mx.middlewares).toBeDefined();
    expect(mx.middlewares.length).toEqual(2);
    expect(mx.Context.Tracing).toBeUndefined();

    await mx.Invoke();
    expect(mx.Context.Tracing).toBeDefined();
  });

  test("Lambda Middleware usage with middleware logger extension methods", async () => {
    const snsEvent: SNSEvent= {
      Records: [
        {
          EventSource: "aws:sns",
          Sns: {
            MessageId: reqId,
            Message: "",
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

    let mx = Factory.Create(snsEvent)
                    .UseLogger()
                    .UseCorrelation()
                    .UseRequestTracking()
                    .UseEventPayloadExtraction();

    expect(mx.Context.Event).toEqual(snsEvent);
    expect(mx.middlewares).toBeDefined();
    expect(mx.middlewares.length).toEqual(4);
    expect(mx.Context.EventSource).toBeDefined();
    expect(mx.Context.Tracing).toBeUndefined();

    await mx.Invoke();

    expect(mx.Context.Tracing).toBeDefined();
    expect(mx.Context.Tracing!.Logger).toBeDefined();
    expect(mx.Context.Tracing!.RequestId).toBeDefined();
    expect(mx.Context.Tracing!.CorrelationId).toBeDefined();
  });

  test("Lambda Middleware usage with middleware run method", async () => {
    const snsEvent: SNSEvent= {
      Records: [
        {
          EventSource: "aws:sns",
          Sns: {
            MessageId: reqId,
            Message: "{\"Name\":\"MyName\"}",
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

    const myTestMethod = async (a: number, b: string, context: LambdaContext<LambdaEvent>): Promise<number> => {
      console.log(context);
      console.log(b);
      
      expect(context).toBeDefined();
      expect(context.Event).toBeDefined();
      expect(context.Tracing).toBeDefined();
      expect(context.Tracing!.Logger).toBeDefined();
      expect(context.Tracing!.CorrelationId).toBeDefined();
      expect(context.Tracing!.RequestId).toBeDefined();

      return a;
    };

    let mx = Factory.Create(snsEvent)
                    .UseLogger()
                    .UseCorrelation()
                    .UseRequestTracking()
                    .UseBatchPayloadExtraction()
                    .Run(myTestMethod);

    expect(mx.Context.Event).toEqual(snsEvent);
    expect(mx.middlewares).toBeDefined();
    expect(mx.middlewares.length).toEqual(4);
    expect(mx.Context.Tracing).toBeUndefined();

    await mx.Invoke(1, "omid");

    expect(mx.Context.Event).toBeDefined();
    expect(mx.Context.Tracing).toBeDefined();
    expect(mx.Context.Tracing!.Logger).toBeDefined();
    expect(mx.Context.Tracing!.RequestId).toBeDefined();
    expect(mx.Context.Tracing!.CorrelationId).toBeDefined();
  });

  test("Lambda Middleware usage works if no middleware associated", async () => {
    const snsEvent: SNSEvent= {
      Records: [
        {
          EventSource: "aws:sns",
          Sns: {
            MessageId: reqId,
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

    await Factory.Create(snsEvent).Invoke();
  });
})