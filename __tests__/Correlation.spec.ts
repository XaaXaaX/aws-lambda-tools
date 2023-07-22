import { CorrelationId } from "../index";
describe("correlation validation", () => {
  test("correlation shall return sns event correlation if exists", () => {
    const corelId = "7687cca1-4316-1116-9a51-fdda3d3852d7";
    const snsLikeEvent = {
      Records: [
        {
          EventSource: "aws:sns",
          Sns: {
            MessageAttributes:{
              x_correlation_id: {
                Type: "String",
                Value: corelId
              }
            }
          }
        }
      ]
    }

    const actual = CorrelationId.GetCorrelationId(snsLikeEvent);
    expect(actual).toBe(corelId);
  });

  test("correlation shall return sqs event correlation if exists", () => {
    const corelId = "7687cca1-4316-1116-9a51-fdda3d3852d7";
    const sqsLikeEvent = {
      Records: [
        {
          eventSource: "aws:sqs",
          body: "this is a test",
          messageAttributes: {
            'x_correlation_id': {
              dataType: "String",
              stringValue: corelId
            }
          }
        }
      ]
    }
    const actual = CorrelationId.GetCorrelationId(sqsLikeEvent);
    expect(actual).toBe(corelId);
  });

  test("correlation shall return new correlation if header not exists in loadbalancer event", () => {
    const albLikeEvent = {
      requestContext: {
        elb: {
          targetGroupArn: "arn:aws:elasticloadbalancing:us-east-2:123456789012:targetgroup/lambda-279XGJDqGZ5rsrHC2Fjr/49e9d65c45c6791a"
        }
      },
      httpMethod: "POST",
      path: "/go",
      body: "",
      isBase64Encoded: false
    };
    const actual = CorrelationId.GetCorrelationId(albLikeEvent);
    expect(actual).toBeDefined();
  });


  test("correlation shall return loadbalancer event correlation if exists", () => {
    const corelId = "7687cca1-4316-1116-9a51-fdda3d3852d7";
    const albLikeEvent = {
      requestContext: {
        elb: {
          targetGroupArn: "arn:aws:elasticloadbalancing:us-east-2:123456789012:targetgroup/lambda-279XGJDqGZ5rsrHC2Fjr/49e9d65c45c6791a"
        }
      },
      httpMethod: "POST",
      path: "/go",
      headers: {
        "x-correlation-id": corelId
      },
      body: "",
      isBase64Encoded: false
    };
    const actual = CorrelationId.GetCorrelationId(albLikeEvent);
    expect(actual).toBe(corelId);
  });

  test("correlation shall return apigateway event correlation if exists", () => {
    const corelId = "7687cca1-4316-1116-9a51-fdda3d3852d7";
    const albLikeEvent = {
      requestContext:{
        apiId : "shdgqsjgdsjq"
      },
      pathParameters: {
        proxy: "/pat/to/"
      },
      httpMethod: "POST",
      path: "/go",
      headers: {
        "x-correlation-id": corelId
      }
    };
    const actual = CorrelationId.GetCorrelationId(albLikeEvent);
    expect(actual).toBe(corelId);
  });

  test("correlation shall return new correlation if does not exists in event", () => {
    const corelId = "7687cca1-4316-1116-9a51-fdda3d3852d7";
    const snsLikeEvent = {
      Records: [
        {
          Sns: {
            MessageAttributes:{
              xcorrelation_id: {
                Type: "String",
                Value: corelId
              }
            }
          }
        }
      ]
    }

    const actual = CorrelationId.GetCorrelationId(snsLikeEvent);

    expect(actual).not.toBe(corelId);

  })
})