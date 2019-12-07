import { Time } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material';
import { AppEvent } from '../model/app-event';
import { BookingRequest } from '../model/booking-request';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {
  request: BookingRequest;
  requestDate: Date;
  requestTime: Time;

  constructor(
    private afs: AngularFirestore,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.request = {
      seats: 1
    };
  }

  onSubmit() {
    this.request.ts = new Date();
    this.request.time = new Date(this.requestDate.toDateString() + ' ' + this.requestTime);

    this.afs.collection<AppEvent>('events').add({
      event: 'Ride booking requested.',
      data: this.request
    })
      .then(() => {
        this.snackBar.open('Your request is submitted.');
      })
      .catch(err => {
        this.snackBar.open(err.message, null, {
          duration: 5000
        });
      });

    this.request.pickup = null;
    this.request.destination = null;
  }
}
