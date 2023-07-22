import { LambdaEvent } from "../Events/LambdaEvent";
import { LambdaContext } from "../Context/LambdaContext";
import { IMiddleware } from "./IMiddleware";

export abstract class Middleware<T extends LambdaContext<LambdaEvent>> implements IMiddleware {

  Next?: Middleware<T>;

  constructor(next?: Middleware<T>){
    this.Next = next;
  }

  abstract Invoke(Context: T): Promise<T>;
}
