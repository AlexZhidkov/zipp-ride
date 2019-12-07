import { BookingRequest } from './booking-request';

export interface AppEvent {
    event: 'Ride booking requested.';
    data: BookingRequest;
}
