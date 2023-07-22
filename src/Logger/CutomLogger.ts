import {
    configure,
    getLogger,
    Logger,
    Configuration
  } from "log4js";
  
  export interface ICustomLogger {
    CorrelationId: string | undefined;
  
    Debug(message: string, context?: any): void;
    Info(message: string, context?: any): void;
    Error(message: string, context?: any): void;
    Fatal(message: string, context?: any): void;
    Warn(message: string, context?: any): void;
  }
  
  export abstract class CustomLogger implements ICustomLogger {
    CorrelationId: string | undefined;
    protected readonly logger: Logger;
    protected constructor(config?: Configuration) {
      if(config)
        configure(config);
  
      this.logger = getLogger();
    }
  
    Debug = (message: string, context?: any) => {
        this.logger.debug(`[DEBUG] ${message}` , {...this.EnrichLogContext(context), logLevel: "DEBUG"});
    };
  
    Info = (message: string, context?: any) => {
      this.logger.info(message, this.EnrichLogContext(context));
    };
  
    Error = (message: string, context?: any) => {
      this.logger.error(message, this.EnrichLogContext(context));
    };
  
    Fatal = (message: string, context?: any) => {
      this.logger.fatal(message, this.EnrichLogContext(context));
    };
  
    Warn = (message: string, context?: any) => {
      this.logger.warn(message, this.EnrichLogContext(context));
    };
  
    protected abstract EnrichLogContext(context: any): any
  }
  