import { IMiddleware } from "./IMiddleware";
import { Correlation } from "../Correlation";
import { LambdaEvent } from "../Events/LambdaEvent";
import { LambdaContext } from "../Context/LambdaContext";
import { Middleware } from "./Middleware";

export class CorrelationMiddleware<T extends LambdaContext<LambdaEvent>> extends Middleware<T> implements IMiddleware{
  Invoke = async (Context: T): Promise<T> => {
    Context = {
      ...Context,
      ...await this.Next?.Invoke(Context),
    };

    Context.Tracing = {
      ...Context.Tracing,
      CorrelationId: Correlation.GetCorrelationId(Context.Event)
    };

    return Context;
  }
}