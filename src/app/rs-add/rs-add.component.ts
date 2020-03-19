import { Component, ViewChild, ElementRef, AfterViewInit, NgZone } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MapService } from '../map/map.service';

@Component({
  selector: 'app-rs-add',
  templateUrl: './rs-add.component.html',
  styleUrls: ['./rs-add.component.css']
})
export class RsAddComponent implements AfterViewInit {
  @ViewChild('pacInput', { static: false }) pacInput: ElementRef;
  @ViewChild('anchor', { static: false }) anchor: ElementRef;

  place: google.maps.places.PlaceResult;

  constructor(
    private firestore: AngularFirestore,
    private mapService: MapService,
    private ngZone: NgZone,
  ) { }

  ngAfterViewInit() {
    this.mapService.setAutocomplete(
      this.pacInput.nativeElement,
      this.generateLink.bind(this));
  }

  async generateLink(placeId: string) {
    let place = await this.mapService.getDetails(placeId);
    place = JSON.parse(JSON.stringify(place));
    await this.firestore.collection('rs')
      .doc(placeId)
      .set({ place }, { merge: true });
    ;
    this.pacInput.nativeElement.value = place.name;
    this.ngZone.run(() => this.place = place);
  }

  scrollIntoView() {
    this.anchor.nativeElement.scrollIntoView({ behavior: "smooth", block: "end" });
  }
}
