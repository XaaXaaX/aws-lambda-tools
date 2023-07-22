import { Request } from "../src/Request";
describe("Request validation", () => {
  test("Request shall return sns event Request if exists", () => {
    const reqId = "7687cca1-4316-1116-9a51-fdda3d3852d7";
    const snsLikeEvent = {
      Records: [
        {
          EventSource: "aws:sns",
          Sns: {
            MessageId: reqId
          }
        }
      ]
    }

    const actual = Request.GetRequestId(snsLikeEvent);
    expect(actual).toBe(reqId);
  });

  test("Request shall return sqs event Request if exists", () => {
    const reqId = "7687cca1-4316-1116-9a51-fdda3d3852d7";
    const sqsLikeEvent = {
      Records: [
        {
          messageId: reqId,
          eventSource: "aws:sqs",
          body: "this is a test"
        }
      ]
    }
    const actual = Request.GetRequestId(sqsLikeEvent);
    expect(actual).toBe(reqId);
  });

  test("Request shall return loadbalancer event Request if exists", () => {
    const reqId = "7687cca1-4316-1116-9a51-fdda3d3852d7";
    const albLikeEvent = {
      requestContext: {
        elb: {
          targetGroupArn: "arn:aws:elasticloadbalancing:us-east-2:123456789012:targetgroup/lambda-279XGJDqGZ5rsrHC2Fjr/49e9d65c45c6791a"
        }
      },
      httpMethod: "POST",
      path: "/go",
      headers: {
        "x-request-id": reqId
      },
      body: "",
      isBase64Encoded: false
    };
    const actual = Request.GetRequestId(albLikeEvent);
    expect(actual).toBe(reqId);
  });

  test("Request shall return apigateway event Request if exists", () => {
    const reqId = "7687cca1-4316-1116-9a51-fdda3d3852d7";
    const albLikeEvent = {
      pathParameters: {
        proxy: "/pat/to/"
      },
      httpMethod: "POST",
      path: "/go",
      headers: {
        "x-request-id": reqId
      },
      requestContext:{
        apiId : "shdgqsjgdsjq",
        requestId: reqId
      }
    };
    const actual = Request.GetRequestId(albLikeEvent);
    expect(actual).toBe(reqId);
  });

  test("Request shall return new Request if does not exists in event", () => {
    const reqId = "7687cca1-4316-1116-9a51-fdda3d3852d7";
    const snsLikeEvent = {
      Records: [
        {
          Sns: {
          }
        }
      ]
    }

    const actual = Request.GetRequestId(snsLikeEvent);

    expect(actual).not.toBe(reqId);

  })
})