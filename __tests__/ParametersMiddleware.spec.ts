import { APIGatewayProxyEvent } from "aws-lambda";
import { Factory } from "../src/Factory";
import { LambdaMiddleware } from "../src/LambdaMiddleware";
import { ApiGatewayProxyEventMock  } from "./__mock__/ApiGatewayEventMock";
import '../src/Middlewares/LambdaMiddlewareExtensions'

describe("LambdaFactory Validation", () => {
  test("Lambda ParametersMiddleware Use shall return Parameters", async () => {
    const event: APIGatewayProxyEvent = ApiGatewayProxyEventMock;
    event.body = "{\"Pagination\":{\"Limit\":10,\"PageId\":null,\"Order\":\"Asc\"}}";
    event.headers = {
      authorization: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJSQy0zNjU2NzgiLCJzY29wZSI6W10sImlhdCI6MTYwMjE2NjY2NiwibmJmIjoxNjAyMTY2NjY2LCJleHAiOjE2MjI1NzA2ODUsImF1ZCI6WyJjYWFzIiwibGFhcyJdLCJpc3MiOiJodHRwczovL2Rldi5sb2dpbi5hcGkuZGlnbnAuY29tL3YwLWFscGhhIiwianRpIjoiNTZkNGY4NjUtNGVkZi00ODAzLTllZDktYzFiM2ZmMWZiZmM1In0.oVBfKET_hhPaiaLAhN9BKJq4nvZ5FzzweKKzJvST6Fo"
    };
    event.pathParameters = { ["ClassifiedId"]: "123456789" };

    let middleware = Factory.Create(event);
    middleware.UseEventParametersExtraction()
    await middleware.Invoke();

    expect(middleware).toBeInstanceOf(LambdaMiddleware);
    expect(middleware.Context).toBeDefined();
    expect(middleware.Context.Parameters).toBeDefined();
    expect(middleware.Context.Event).toEqual(event);
  });
});
