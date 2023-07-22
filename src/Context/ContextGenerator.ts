import { Context } from "aws-lambda";
import { EventRecognizer } from "../Events/EventRecognizer";
import { LambdaEvent } from "../Events/LambdaEvent";
import { LambdaContext } from "./LambdaContext";

export class ContextGenerator {
  static Generate<TEvent extends LambdaEvent>(
    event: TEvent,
    context?: Context
  ): LambdaContext<TEvent> {
    const ctx: LambdaContext<TEvent> = { 
      Event: event, 
      Context: context,
      EventSource : EventRecognizer.GetEventSource(event)
    };
    return ctx;
  }
}
