import { LambdaEvent } from "../Events/LambdaEvent";
import { LambdaContext } from "../Context/LambdaContext";
import { LambdaMiddleware } from "../LambdaMiddleware";
import { CorrelationMiddleware } from "./CorrelationMiddleware";
import { RequestTrackingMiddleware } from "./RequestTrackingMiddleware";
import { EventPayloadMiddleware } from "./EventPayloadMiddleware";
import { ParametersMiddleware } from "./ParametersMiddleware";
import { BatchEventPayloadMiddleware } from "./BatchEventPayloadMiddleware";

declare module "../LambdaMiddleware" {
  interface LambdaMiddleware<T extends LambdaContext<LambdaEvent>> {
    UseCorrelation(): LambdaMiddleware<T>;
    UseRequestTracking(): LambdaMiddleware<T>;
    UseEventPayloadExtraction(): LambdaMiddleware<T>;
    UseEventParametersExtraction(): LambdaMiddleware<T>;
    UseBatchPayloadExtraction(): LambdaMiddleware<T>;
  }
}

LambdaMiddleware.prototype.UseCorrelation = function(): LambdaMiddleware<LambdaContext<LambdaEvent>> {
  this.Use(CorrelationMiddleware);
  return this;
}

LambdaMiddleware.prototype.UseRequestTracking = function(): LambdaMiddleware<LambdaContext<LambdaEvent>> {
  this.Use(RequestTrackingMiddleware);
  return this;
}

LambdaMiddleware.prototype.UseEventPayloadExtraction = function(): LambdaMiddleware<LambdaContext<LambdaEvent>> {
  this.Use(EventPayloadMiddleware);
  return this;
}

LambdaMiddleware.prototype.UseBatchPayloadExtraction = function(): LambdaMiddleware<LambdaContext<LambdaEvent>> {
  this.Use(BatchEventPayloadMiddleware);
  return this;
}

LambdaMiddleware.prototype.UseEventParametersExtraction = function(): LambdaMiddleware<LambdaContext<LambdaEvent>> {
  this.Use(ParametersMiddleware);
  return this;
}


export {};