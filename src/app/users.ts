export class User {
    username: string;
    password: string;
    email: string;
    role: string;
    avatar: string;
    
    constructor(username:string, password:string, email:string, role:string, avatar:string) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.role = role;
        this.avatar = avatar;
    }
}