export interface BookingRequest {
    ts?: Date;
    time?: Date;
    pickup?: string;
    destination?: string;
    seats: 1 | 2 | 3 | 4;
    name?: string;
    phone?: string;
    email?: string;
}
