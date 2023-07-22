# aws lambda tools

The repository provide some middlewares and tools for some popular needs in serverless development.

## Traditional usage

when implementing serverless designs on aws the traditional implementation of a handler is as bellow

``` typescript

const treatEvent = async ( event: SQSEvent) => {
  const eventSource =  event.Records[0];
  const eventPayload =  JSON.Parse(evetSource.body) as MyType
  const correlationId = evetSource.messageAttributes["x_correlation_id"];
  // Some treatment
}

export const handler = treatEvet;
```

This implementation is tightly coupled to SQS and to change the source of trigger side of changing the IAC we need as well change the code of handler.

using this repo you can change the trogger source without changing your handler code and as well brings some ractices to avoid boilerplat code.

## Refactor Using mmiddlewares

### Example 1

``` typescript
const treatEvent = async ( event: LambdaEvent) => {

  const handlerInput = await Factory.Create(event)
                                    .UseCorrelation()
                                    .UseRequestTracking()
                                    .UseEventPayloadExtraction()
                                    .UseLogger()
                                    .Run(this.SetLogger)
                                    .Invoke();

  const eventPayload =  handlerInput.Message;
  const correlationId = handlerInput.Tracing.CorrelationId;
  const requestId = handlerInput.Tracing.RequestId;
  ...
  
  // Some treatment
}

export const handler = treatEvet;

```

### Example 2


``` typescript
const treatEvent = async ( event: LambdaEvent) => {

  const handlerInput = await Factory.Create(event)
                                    .UseCorrelation()
                                    .UseRequestTracking()
                                    .UseBatchPayloadExtraction()
                                    .UseLogger()
                                    .Run(this.SetLogger)
                                    .Invoke();

  const eventPayload =  handlerInput.Message;
  const correlationId = handlerInput.Tracing.CorrelationId;
  const requestId = handlerInput.Tracing.RequestId;
  
  eventPayload.foreach( _ => { ... })
  ...
  
  // Some treatment
}

export const handler = treatEvet;

```
