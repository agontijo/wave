export interface Room {
    previous: any[];
    songThreshold: number;
    queue: string[];
    RoomID: string;
    genresAllowed: string[];
    host: string;
    userList: string[];
    allowExplicit: boolean;
    roomname: string;
    waitingRoom: any[];
    bannedList: any[];
    popularSort: boolean;
}
