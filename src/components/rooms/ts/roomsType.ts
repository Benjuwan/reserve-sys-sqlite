export type roomType = { room: string };

export type roomsType = roomType[];

export type reservedInfoType = {
    isReserved: boolean;
    content: string;
    room: string | undefined;
    person: string | undefined;
};