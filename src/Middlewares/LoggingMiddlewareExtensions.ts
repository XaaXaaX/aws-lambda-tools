import { LambdaEvent } from "../Events/LambdaEvent";
import { LambdaContext } from "../Context/LambdaContext";
import { LambdaMiddleware } from "../LambdaMiddleware";
import { LoggingMiddleware } from "./LoggingMiddleware";

declare module "../LambdaMiddleware" {
  interface LambdaMiddleware<T extends LambdaContext<LambdaEvent>> {
    UseLogger(): LambdaMiddleware<T>;
  }
}

LambdaMiddleware.prototype.UseLogger = function(): LambdaMiddleware<LambdaContext<LambdaEvent>> {
  this.Use(LoggingMiddleware);
  return this;
}

export {};