export class Group {
    groupName: string;
    constructor(groupName:string) {
        this.groupName = groupName;
    }
}

export class Channel extends Group {
    channelName: string;
    constructor(groupName:string, channelName:string) {
        super(groupName);
        this.channelName = channelName;
    }
}