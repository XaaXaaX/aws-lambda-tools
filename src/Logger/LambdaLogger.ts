import { Correlation } from "../Correlation";
import { Configuration, LoggingEvent } from "log4js";
import { CustomLogger, ICustomLogger } from "./CutomLogger";

const customizedConfig: Configuration = {
  appenders: {
    dataDog: {
      type: "console",
      layout: {
        type: "pattern",
        pattern:
          '{"severity": "%p", "message": "%x{message}", "app" : %x{app}, "timestamp": "%d{ISO8601_WITH_TZ_OFFSET}", "environment": "%x{environment}" }',
        tokens: {
          app: function (logEvent: LoggingEvent) {
            return JSON.stringify(logEvent.data[1] || {});
          },
          message: function (logEvent: LoggingEvent) {
            return logEvent.data[0];
          },
          environment: function () {
            return process.env.Environment;
          }
        },
      },
    },
  },
  categories: {
    default: {
      appenders: ["dataDog"],
      level: "DEBUG",
    },
  },
};

export class LambdaLogger extends CustomLogger implements ICustomLogger {
  private static instance: ICustomLogger;
  CorrelationId: string | undefined;
  private constructor() {
    super(customizedConfig);
  }

  static InitLogger<TEvent>(event?: TEvent): ICustomLogger {
    if (!LambdaLogger.instance) {
      LambdaLogger.instance = new LambdaLogger();
    }

    if (event || !LambdaLogger.instance.CorrelationId)
      LambdaLogger.instance.CorrelationId = Correlation.GetCorrelationId(
          event
      );

    return LambdaLogger.instance;
  }

  protected EnrichLogContext(context: any) {
    return {
      ...context,
      CorrelationId: LambdaLogger.instance.CorrelationId,
    };
  }
}
