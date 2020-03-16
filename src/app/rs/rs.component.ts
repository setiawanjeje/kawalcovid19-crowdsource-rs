import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ApplicationRef, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, filter, switchMap, take } from 'rxjs/operators';
import { firestore } from 'firebase/app';

import 'firebase/firestore';

@Component({
  selector: 'app-rs',
  templateUrl: './rs.component.html',
  styleUrls: ['./rs.component.css']
})
export class RsComponent implements AfterViewInit {
  @ViewChild('mapContainer', { static: false }) gmap: ElementRef;
  @ViewChild('pacInput', { static: false }) pacInput: ElementRef;
  map: google.maps.Map;
  coordinates = new google.maps.LatLng(-6.1475083, 106.827287);
  mapOptions: google.maps.MapOptions = { center: this.coordinates, zoom: 8 };
  marker = new google.maps.Marker({ position: this.coordinates, map: this.map });
  placesService;
  infowindow;
  infowindowContent;
  rsForm;
  id$: Observable<string>;
  place$: Observable<any>;
  requests$: Observable<any[]>;
  status = 'new';

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private firestore: AngularFirestore,
    private cd: ChangeDetectorRef,
  ) {
    this.rsForm = this.formBuilder.group({
      rs_id: '',
      rs_name: '',
      odp: '',
      pdpp: '',
      pdps: '',
      covp: '',
      covs: '',
      maskers: '',
      gloves: '',
      hazmats: '',
      others: '',
      contact: '',
    });

    this.id$ = this.route.paramMap.pipe(map((params: ParamMap) => params.get('id')));
    this.place$ = this.id$.pipe(filter(Boolean), switchMap((placeId: string) => {
      return this.firestore.collection('rs').doc(placeId).get().pipe(map(snap => {
        const place = snap.data();
        this.setPlace(place, true);
        if (place.data) {
          console.log('data', place.data);
          delete place.data.timestamp;
          try {
            this.rsForm.setValue(place.data);
          } catch (e) {
            console.error(e);
          }
        }
        return place;
      }));
    }));
    this.requests$ =
      this.id$.pipe(filter(Boolean), switchMap((placeId: string) => {
        return this.firestore.collection('rs').doc(placeId).collection('requests').valueChanges();
      }));
  }

  get placeId() {
    return this.rsForm.get('rs_id').value;
  }

  get placeName() {
    return this.rsForm.get('rs_name').value;
  }

  async setPlace(place, adjustViewport, saveToDb = false) {
    if (!place.geometry) return;

    if (adjustViewport) {
      if (place.geometry.viewport) {
        this.map.fitBounds(place.geometry.viewport);
      } else {
        this.map.setCenter(place.geometry.location);
        this.map.setZoom(17);
      }
    }

    // Set the position of the marker using the place ID and location.
    // @ts-ignore
    this.marker.setPlace({
      placeId: place.place_id,
      location: place.geometry.location
    });

    this.marker.setVisible(false);

    this.rsForm.get('rs_id').setValue(place.place_id);
    this.rsForm.get('rs_name').setValue(place.name);

    this.infowindow.close();
    this.infowindow.setPosition(place.geometry.location);
    this.infowindowContent.children['place-icon'].src = place.icon;
    this.infowindowContent.children['place-name'].textContent = place.name;
    this.infowindow.open(this.map);

    if (saveToDb) {
      await this.firestore.collection('rs').doc(place.place_id).update(JSON.parse(JSON.stringify(place)));
    }
    this.cd.detectChanges();
  }

  async ngAfterViewInit() {
    if (await this.id$.pipe(take(1)).toPromise()) {
      this.gmap.nativeElement.style.height = '250px';
    } else {
      this.gmap.nativeElement.style.height = '400px';
    }

    this.map = new google.maps.Map(this.gmap.nativeElement,
      this.mapOptions);
    this.placesService = new google.maps.places.PlacesService(this.map);
    this.marker.setMap(this.map);
    var input = this.pacInput.nativeElement;
    // this.map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(input);

    this.infowindow = new google.maps.InfoWindow;
    this.infowindowContent = document.getElementById('infowindow-content');
    this.infowindow.setContent(this.infowindowContent);

    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', this.map);
    autocomplete.setFields(['place_id', 'geometry', 'formatted_phone_number', 'formatted_address', 'icon', 'website', 'name']);
    autocomplete.addListener('place_changed', () => this.setPlace(autocomplete.getPlace(), true, true));

    this.map.addListener('click', (event) => {
      // @ts-ignore
      var placeId = event.placeId;
      if (!placeId) return;
      event.stop();
      this.placesService.getDetails({ placeId }, (place, status) => {
        if (status === 'OK') {
          this.setPlace(place, false, true);
        }
      });
    });
  }

  async onSubmit(data, place) {
    console.log('data', data);
    console.log('place ', JSON.stringify(place, null, 4));
    this.status = 'updating';
    data.timestamp = firestore.FieldValue.serverTimestamp();
    const rsDoc = this.firestore.collection('rs').doc(place.place_id);
    await rsDoc.update({ data });
    await rsDoc.collection('requests').add(data);
    this.status = 'done';
    this.rsForm.markAsPristine();
    return false;
  }

  generateLink(data) {
    console.log('data', data);
  }
}
