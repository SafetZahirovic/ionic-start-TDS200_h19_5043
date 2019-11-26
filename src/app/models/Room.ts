export default interface Room {
    roomID?: string;
    capacity: number;
    roomName: string;
    companyRentingRoom: string;
    imageUrl: string;
    landlordID: string;
    address: string;
    datesAvailable: [string];
    datesBooked: [{dates: [string], userID}];
    coordinates: {latitude: number, longitude: number};
    fullyBooked: boolean;
    addedNewRoom: boolean;
    whoCanSee?: string[];
}
