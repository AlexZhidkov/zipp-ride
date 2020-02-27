/// <reference types='@types/googlemaps' />
declare var google: any;

import { Time } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppEvent } from '../model/app-event';
import { BookingRequest } from '../model/booking-request';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit, AfterViewInit {
  @ViewChild('pickupInput', { static: false }) pickupInput: any;
  @ViewChild('destinationInput', { static: false }) destinationInput: any;

  request: BookingRequest;
  requestDate: Date;
  requestTime: Time;

  constructor(
    private afs: AngularFirestore,
    private analytics: AngularFireAnalytics,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.request = {
      seats: 1
    };
  }

  ngAfterViewInit() {
    this.setupPlacesAutocomplete();
  }

  private setupPlacesAutocomplete() {
    // https://developers-dot-devsite-v2-prod.appspot.com/maps/documentation/javascript/examples/places-autocomplete-addressform
    const options = {
      componentRestrictions: { country: 'AU' },
      bounds: new google.maps.LatLngBounds(
        new google.maps.LatLng(-32.960731, 115.540547),
        new google.maps.LatLng(-31.455746, 116.079108)
      ),
      types: ['geocode'],
      fields: ['formatted_address']
    };

    const pickupAutocomplete = new google.maps.places.Autocomplete(this.pickupInput.nativeElement, options);
    pickupAutocomplete.addListener('place_changed', () => {
      const place = pickupAutocomplete.getPlace();
      this.request.pickup = place.formatted_address;
    });

    const destinationAutocomplete = new google.maps.places.Autocomplete(this.destinationInput.nativeElement, options);
    destinationAutocomplete.addListener('place_changed', () => {
      const place = destinationAutocomplete.getPlace();
      this.request.destination = place.formatted_address;
    });
  }

  onSubmit() {
    this.request.ts = new Date();
    this.request.createdOnString = this.request.ts.toString();
    this.request.time = new Date(this.requestDate.toDateString() + ' ' + this.requestTime);
    this.request.timeString = this.request.time.toString();
    this.afs.collection<AppEvent>('events').add({
      event: 'Ride booking requested.',
      data: this.request
    })
      .then(() => {
        this.snackBar.open('Your request is submitted.');
        this.analytics.logEvent('request_submitted', { app_name: 'ZZAP' });
      })
      .catch(err => {
        this.snackBar.open(err.message, null, {
          duration: 5000
        });
        this.analytics.logEvent('submit_failed', { app_name: 'ZZAP' });
      });

    this.request.pickup = null;
    this.request.destination = null;
  }
}
