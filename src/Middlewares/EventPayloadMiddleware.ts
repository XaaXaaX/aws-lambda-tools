import { IMiddleware } from "./IMiddleware";
import { LambdaEvent } from "../Events/LambdaEvent";
import { LambdaContext } from "../Context/LambdaContext";
import { Middleware } from "./Middleware";
import { EventMessage } from "../Events/EventMessage";

export class EventPayloadMiddleware<T extends LambdaContext<LambdaEvent>> extends Middleware<T> implements IMiddleware{
  Invoke = async (Context: T): Promise<T> => {
    Context = {
      ...Context,
      Message: EventMessage.GetMessage(Context.Event),
      ...await this.Next?.Invoke(Context)
    }
    
    return Context;
  }
}