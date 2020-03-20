import { Component, EventEmitter, ViewChild, ElementRef, Input, AfterViewInit, Output, OnChanges } from '@angular/core';
import { MapService } from './map.service';

@Component({
  selector: 'app-map',
  template: `<div #mapContainer class="map" [style.height.px]="heightPercentage"></div>`,
  styles: [`
  #map {
    margin-bottom: 20px;
    width: 100vw;
    min-height:10vh;
    max-height: 50vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  `]
})
export class MapComponent implements AfterViewInit, OnChanges {
  @Input() height;
  @Input() place: google.maps.places.PlaceResult;

  @Output() clickedPlaceId = new EventEmitter<string>();

  @ViewChild('mapContainer', { static: false }) mapRef: ElementRef;

  heightPercentage:number;

  constructor(private mapService: MapService) { }
  ngOnInit(){
    if(this.height) this.heightPercentage = window.innerHeight * (this.height/100)
    else this.heightPercentage = 25
  }
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
