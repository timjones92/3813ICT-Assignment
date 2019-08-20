export class Group {
    groupName: string;
    constructor(groupName:string) {
        this.groupName = groupName;
    }
}

export class Channel extends Group {
    channelID: number;
    channelName: string;
    constructor(groupName:string, channelID:number, channelName:string) {
        super(groupName);
        this.channelID = channelID;
        this.channelName = channelName;
    }
}