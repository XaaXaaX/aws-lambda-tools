import { LambdaLogger } from "../../src/Logger/LambdaLogger";

beforeAll((done) => {
  done();
});

describe("DataDogLogger Validation", () => {
  test("DataDogLogger shall call correlationId if event and correlation is undefined", () => {
    const crlId = "7687cca1-4316-1116-9a51-fdda3d3852d7";
    const event = {
      Records: [
          {
              EventVersion: "1.0",
              EventSubscriptionArn: "arn:aws:sns:eu-west-1:{{{accountId}}}:ExampleTopic",
              Sns: {
                  Type: "Notification",
                  MessageId: "95df01b4-ee98-5cb9-9903-4c221d41eb5e",
                  TopicArn: "arn:aws:sns:eu-west-1:123456789012:ExampleTopic",
                  Subject: "example subject",
                  Message: "{\"date\":\"2020-10-28T11:26:03.4127551+01:00\",\"publicationType\":\"seloger\",\"type\":\"listing\",\"user\":{\"email\":\"omid.eidivandi@groupeseloger.com\",\"civility\":\"Mr\",\"name\":\"Test\",\"phone\":\"0613569432\",\"message\":\"\",\"ip\":\"\"},\"customData\":{\"listingId\":15786655}}",
                  Timestamp: "1970-01-01T00:00:00.000Z",
                  SignatureVersion: "1",
                  Signature: "EXAMPLE",
                  SigningCertUrl: "EXAMPLE",
                  UnsubscribeUrl: "EXAMPLE",
                  MessageAttributes: {
                      x_correlation_id: {
                          Type: "String",
                          Value: crlId
                      }
                  }
              }
          }
      ]
    }

    const logger = LambdaLogger.InitLogger(event);
    expect(logger.CorrelationId).not.toBeUndefined();
  });

  test("DataDogLogger shall init logger", () => {
    const logger = LambdaLogger.InitLogger();

    expect(logger.CorrelationId).not.toBeUndefined();
  });

  test("DataDogLogger shall init with event logger and add correlationId", () => {
    const crlId = "7687cca1-4316-1116-9a51-fdda3d3852d7";
    const event = {
      Records: [
          {
              EventSource: "aws:sns",
              EventVersion: "1.0",
              EventSubscriptionArn: "arn:aws:sns:eu-west-1:{{{accountId}}}:ExampleTopic",
              Sns: {
                  Type: "Notification",
                  MessageId: "95df01b4-ee98-5cb9-9903-4c221d41eb5e",
                  TopicArn: "arn:aws:sns:eu-west-1:123456789012:ExampleTopic",
                  Subject: "example subject",
                  Message: "{\"date\":\"2020-10-28T11:26:03.4127551+01:00\",\"publicationType\":\"seloger\",\"type\":\"listing\",\"user\":{\"email\":\"omid.eidivandi@groupeseloger.com\",\"civility\":\"Mr\",\"name\":\"Test\",\"phone\":\"0613569432\",\"message\":\"\",\"ip\":\"\"},\"customData\":{\"listingId\":15786655}}",
                  Timestamp: "1970-01-01T00:00:00.000Z",
                  SignatureVersion: "1",
                  Signature: "EXAMPLE",
                  SigningCertUrl: "EXAMPLE",
                  UnsubscribeUrl: "EXAMPLE",
                  MessageAttributes: {
                      x_correlation_id: {
                          Type: "String",
                          Value: crlId
                      }
                  }
              }
          }
      ]
    }
    const logger = LambdaLogger.InitLogger(event);

    expect(logger.CorrelationId).not.toBeUndefined();
    expect(logger.CorrelationId).toEqual(crlId);

  });

  test("DataDogLogger shall call base class logger", () => {
    const crlId = "7687cca1-4316-1116-9a51-fdda3d3852d7";
    const event = {
      Records: [
          {
              EventVersion: "1.0",
              EventSubscriptionArn: "arn:aws:sns:eu-west-1:{{{accountId}}}:ExampleTopic",
              Sns: {
                  Type: "Notification",
                  MessageId: "95df01b4-ee98-5cb9-9903-4c221d41eb5e",
                  TopicArn: "arn:aws:sns:eu-west-1:123456789012:ExampleTopic",
                  Subject: "example subject",
                  Message: "{\"date\":\"2020-10-28T11:26:03.4127551+01:00\",\"publicationType\":\"seloger\",\"type\":\"listing\",\"user\":{\"email\":\"omid.eidivandi@groupeseloger.com\",\"civility\":\"Mr\",\"name\":\"Test\",\"phone\":\"0613569432\",\"message\":\"\",\"ip\":\"\"},\"customData\":{\"listingId\":15786655}}",
                  Timestamp: "1970-01-01T00:00:00.000Z",
                  SignatureVersion: "1",
                  Signature: "EXAMPLE",
                  SigningCertUrl: "EXAMPLE",
                  UnsubscribeUrl: "EXAMPLE",
                  MessageAttributes: {
                      x_correlation_id: {
                          Type: "String",
                          Value: crlId
                      }
                  }
              }
          }
      ]
    }

    const logger = LambdaLogger.InitLogger(event);

    logger.Warn("this is a test");
    logger.Info("this is a test");
    logger.Fatal("this is a test");
    logger.Error("this is a test");

  });
})