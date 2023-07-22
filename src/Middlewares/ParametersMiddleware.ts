import { IMiddleware } from "./IMiddleware";
import { LambdaEvent } from "../Events/LambdaEvent";
import { LambdaContext } from "../Context/LambdaContext";
import { Middleware } from "./Middleware";
import { EventParameters } from "../Events/EventParameters";

export class ParametersMiddleware<T extends LambdaContext<LambdaEvent>> extends Middleware<T> implements IMiddleware{
  Invoke = async (Context: T): Promise<T> => {
    Context = {
      ...Context,
      Parameters: EventParameters.GetParameters(Context.Event),
      ...await this.Next?.Invoke(Context)
    }

    return Context;
  }
}