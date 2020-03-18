import { Component, EventEmitter, ViewChild, ElementRef, Input, AfterViewInit, Output, OnChanges } from '@angular/core';
import { MapService } from './map.service';

@Component({
  selector: 'app-map',
  template: `<div #mapContainer class="map" [style.height.px]="height"></div>`,
  styles: [`
  #map {
    height: 300px;
    width: 100%;
    margin-bottom: 20px;
  }
  `]
})
export class MapComponent implements AfterViewInit, OnChanges {
  @Input() height = 250;
  @Input() place: google.maps.places.PlaceResult;

  @Output() clickedPlaceId = new EventEmitter<string>();

  @ViewChild('mapContainer', { static: false }) mapRef: ElementRef;

  constructor(private mapService: MapService) { }

  ngAfterViewInit() {
    this.mapService.setMap(this.mapRef.nativeElement);
    this.mapService.map.addListener('click', (event: google.maps.IconMouseEvent) => {
      if (!event.placeId) return;
      event.stop();
      this.clickedPlaceId.next(event.placeId);
    });
  }

  ngOnChanges() {
    this.mapService.setPlace(this.place);
  }
}
