import { IMiddleware } from "./IMiddleware";
import { LambdaEvent } from "../Events/LambdaEvent";
import { LambdaContext } from "../Context/LambdaContext";
import { Middleware } from "./Middleware";
import { EventMessage } from "../Events/EventMessage";

export class BatchEventPayloadMiddleware<T extends LambdaContext<LambdaEvent>> extends Middleware<T> implements IMiddleware{
  Invoke = async (Context: T): Promise<T> => {
    Context = {
      ...Context,
      Message: EventMessage.GetMessages(Context.Event),
      ...await this.Next?.Invoke(Context)
    }
    
    return Context;
  }
}