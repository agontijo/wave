export interface Room {
    songThreshold: number;
    previous: string[];
    queue: string[];
    RoomID: string;
    genresAllowed: string[];
    host: string;
    userList: string[];
    allowExplicit: boolean;
    roomname: string;
}
