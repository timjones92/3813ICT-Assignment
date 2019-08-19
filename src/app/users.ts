import { Group, Channel } from './groups';

export class User {
    username: string;
    email: string;
    role: string;
    groups: Group[];
    channels: Channel[];
    constructor(username:string, email:string, role:string, groups: Group[], channels: Channel[]) {
        this.username = username;
        this.email = email;
        this.role = role;
        this.groups = groups;
        this.channels = channels;
    }
}