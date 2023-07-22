import { APIGatewayProxyEvent } from "aws-lambda";
const validAuthToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJSQy0zNjU2NzgiLCJzY29wZSI6W10sImlhdCI6MTYwMjE2NjY2NiwibmJmIjoxNjAyMTY2NjY2LCJleHAiOjE2MjI1NzAwNzEsImF1ZCI6WyJjYWFzIiwibGFhcyJdLCJpc3MiOiJodHRwczovL2Rldi5sb2dpbi5hcGkuZGlnbnAuY29tL3YwLWFscGhhIiwianRpIjoiNTZkNGY4NjUtNGVkZi00ODAzLTllZDktYzFiM2ZmMWZiZmM1In0.Wk8te12lOYZKbeUljP8XV-sC30kFudHm8uieypDwflE";
export const ApiGatewayProxyEventMock: APIGatewayProxyEvent = {
  body: "",
  headers: {
    authorization: validAuthToken,
  },
  multiValueHeaders: {},
  multiValueQueryStringParameters: null,
  httpMethod: "GET",
  isBase64Encoded: false,
  path: "",
  pathParameters: {},
  queryStringParameters: { },
  stageVariables: {},
  resource: "",
  requestContext: {
    accountId: "123456789012",
    resourceId: "us4z18",
    stage: "test",
    requestId: "41b45ea3-70b5-11e6-b7bd-69b5aaebc7d9",
    authorizer: {
      jwt: {
        claims: {
          sub: 'RC-365678',
          aud: "[go]",
          exp: "1644755555",
          iat: "1644753755",
          iss: "https://dev.login.api.example.com/v0",
          jti: "0e5bada2-085d-4f54-aee2-e5f22f15b0f4",
          nbf: "1644753755",
          scope: "myapp:entity:get"
      },
      }
    },
    protocol: "http",
    identity: {
      principalOrgId: "123",
      accessKey: "",
      apiKeyId: "",
      cognitoIdentityPoolId: "",
      clientCert: {
        clientCertPem: "",
        issuerDN: "",
        serialNumber: "",
        subjectDN: "",
        validity: {
          notAfter: "",
          notBefore: ""
        }
      },
      accountId: "",
      cognitoIdentityId: "",
      caller: "",
      apiKey: "",
      sourceIp: "192.168.100.1",
      cognitoAuthenticationType: "",
      cognitoAuthenticationProvider: "",
      userArn: "",
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.82 Safari/537.36 OPR/39.0.2256.48",
      user: "",
    },
    path: "",
    requestTimeEpoch: 0,
    resourcePath: "/{proxy+}",
    httpMethod: "GET",
    apiId: "wt6mne2s9k",
  },
};