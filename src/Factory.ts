import { LambdaEvent } from "./Events/LambdaEvent";
import { LambdaContext } from "./Context/LambdaContext";
import { ContextGenerator } from "./Context/ContextGenerator";
import { LambdaMiddleware } from "./LambdaMiddleware";
import { Context } from "aws-lambda";

export class Factory {
  static Create<T extends LambdaEvent>(event: T, context?: Context)
    : LambdaMiddleware<LambdaContext<T>> {
      return new LambdaMiddleware(ContextGenerator.Generate(event, context));
  }
}
