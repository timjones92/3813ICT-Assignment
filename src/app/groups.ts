export class Group {
    groupID: number;
    groupName: string;
    constructor(groupID: number, groupName:string) {
        this.groupID = groupID;
        this.groupName = groupName;
    }
}

export class Channel extends Group {
    channelID: number;
    channelName: string;
    constructor(groupID: number, groupName:string, channelID:number, channelName:string) {
        super(groupID, groupName);
        this.channelID = channelID;
        this.channelName = channelName;
    }
}