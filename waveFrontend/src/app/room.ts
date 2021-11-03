export interface Room {
    songThreshold: number;
    queue: string[];
    RoomID: string;
    genresAllowed: string[];
    host: string;
    userList: string[];
    allowExplicit: boolean;
    roomname: string;
}
