export interface BookingRequest {
    ts?: Date;
    createdOnString?: string;
    time?: Date;
    timeString?: string;
    pickup?: string;
    destination?: string;
    seats: 1 | 2 | 3 | 4;
    name?: string;
    phone?: string;
    email?: string;
}
