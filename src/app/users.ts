export class User {
    username: string;
    password: string;
    email: string;
    role: string;
    avatar: any;
    
    constructor(username:string, password:string, email:string, role:string, avatar:any) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.role = role;
        this.avatar = avatar;
    }
}