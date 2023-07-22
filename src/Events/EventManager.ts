import {EventRecognizer}  from './EventRecognizer'
import { SNSEvent , SQSEvent} from "aws-lambda";
export class EventManager{
    public static GenerateEvent(event: SQSEvent | SNSEvent):  any {
        let message: string;
        try{
            if(EventRecognizer.IsSNSEvent(event)) message = event.Records[0]?.Sns?.Message;
            else if(EventRecognizer.IsSQSEvent(event)) message = event.Records[0]?.body;
            else return event;
        }
        catch { return event; }

        return this.GenerateEvent(JSON.parse(message));
    }
}