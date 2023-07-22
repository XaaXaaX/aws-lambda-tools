import { TracingContext } from "./TracingContext";
import { Parameters, LambdaEvent } from "../Events/LambdaEvent";
import { Context } from "aws-lambda";
import { EventSource } from "../Events/EventSource";
import { Message, Messages } from "../Events/EventMessage";

export interface LambdaContext<TEvent extends LambdaEvent> {
  Event: TEvent;
  Message?: Message | Messages ;
  Tracing?: TracingContext;
  Context?: Context;
  Parameters?: Parameters;
  EventSource?: EventSource
}