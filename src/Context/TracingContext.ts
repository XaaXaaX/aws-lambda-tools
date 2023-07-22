import { ICustomLogger } from "../Logger/CutomLogger";

export interface TracingContext {
  CorrelationId?: string;
  RequestId?: string;
  Logger?: ICustomLogger;
}