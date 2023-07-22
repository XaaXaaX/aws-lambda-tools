import { IMiddleware } from "./IMiddleware";
import { LambdaEvent } from "../Events/LambdaEvent";
import { LambdaContext } from "../Context/LambdaContext";
import { Middleware } from "./Middleware";
import { LambdaLogger } from "../Logger/LambdaLogger";

export class LoggingMiddleware<T extends LambdaContext<LambdaEvent>> extends Middleware<T> implements IMiddleware{
  Invoke = async (Context: T): Promise<T> => {
    Context = {
      ...Context,
      ...await this.Next?.Invoke(Context),

    };
    
    Context.Tracing = {
      ...Context.Tracing,
      Logger: LambdaLogger.InitLogger(Context.Event)
    }
    
    return Context;
  }
}