import {
  ALBEvent,
  APIGatewayProxyEvent,
  S3Event,
  SNSEvent,
  SQSEvent
} from "aws-lambda";


export type LambdaHttpEvent = ALBEvent | APIGatewayProxyEvent;
export type LambdaAsyncEvent = SNSEvent | S3Event;
export type LambdaSyncEvent = SQSEvent;

export type LambdaEvent = LambdaHttpEvent | LambdaSyncEvent | LambdaAsyncEvent;
export type Parameters = { [name: string]: string } | undefined | null;
