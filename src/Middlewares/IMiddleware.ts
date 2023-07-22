
export type Next = (...params: any[]) => any | Promise<any>;

export interface IMiddleware {
  Next?: IMiddleware;
  Invoke(Context: any): Promise<any>;
}
