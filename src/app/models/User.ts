export default interface User {
    id?: string;
    userName: string;
    isLandLord: boolean;
    appointments?: [{bookedDates: [string], roomID: string, roomName: string, roomUrl: string}];
}
