import { Guid } from './guid';

export class Message {

    time: number = 0;
    messageID = new Guid().Guid();
    source: string;
    correlationId: string;
    topicName: string;
    payload: any;

    constructor(sourceID: string) {
        this.time = Date.now();
        this.source = 'CS/'  + sourceID;
    }
}
