import { LambdaEvent } from "./Events/LambdaEvent";
import { IMiddleware } from "./Middlewares/IMiddleware";
import { LambdaContext } from "./Context/LambdaContext";
import { Middleware } from "./Middlewares/Middleware";

export class LambdaMiddleware<T extends LambdaContext<LambdaEvent>> {

  Context: T;
  middlewares: Middleware<T>[] =  [];
  middlewaresAfter: Middleware<T>[] = [];

  Action?: Function;
  constructor(context: T) {
    this.Context = context;
  }

  Use(middleware: (new () => IMiddleware)): this {
    const current = new middleware();
    let tempMiddleware = this.middlewares.pop();
    (tempMiddleware) ? (tempMiddleware.Next = current) :
      (tempMiddleware = current);

    this.middlewares.push(tempMiddleware);
    if(current != tempMiddleware)
      this.middlewares.push(current);

    return this;
  }

  UseAfter(middleware: (new () => IMiddleware)): this {
    const current = new middleware();
    let tempMiddleware = this.middlewaresAfter.pop();
    (tempMiddleware) ?
      (tempMiddleware.Next = current) :
      (tempMiddleware = current);

    this.middlewaresAfter.push(tempMiddleware);
    if(current != tempMiddleware)
      this.middlewaresAfter.push(current);

    return this;
  }


  Run(action: Function):  this {
    this.Action = action;
    return this;
  }

  async Invoke(...args: any[]): Promise<T> {
    this.Context = await this.middlewares.shift()?.Invoke(this.Context) as T;
    args.push(this.Context);
    await this.Action?.call(this, ...args);
    await this.middlewaresAfter.shift()?.Invoke(this.Context) as T;

    return this.Context;
  }
}


