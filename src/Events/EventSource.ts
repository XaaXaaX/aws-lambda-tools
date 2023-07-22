export enum EventSource
{
  SQS = "aws:sqs",
  SNS = "aws:sns",
  CloudwatchEvent= "aws.events",
  CloudwatchLog = "awslogs",
  S3 = "aws:s3",
  ApiGetway = "aws:apigatway",
  ApplicationLoadBalancer = "aws:alb"
}