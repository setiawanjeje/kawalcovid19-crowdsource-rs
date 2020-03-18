import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MapService {
  map: google.maps.Map;
  coordinates = new google.maps.LatLng(-6.1475083, 106.827287);
  marker = new google.maps.Marker({ position: this.coordinates });
  placesService: google.maps.places.PlacesService;
  place: google.maps.places.PlaceResult;

  constructor() { }

  setMap(mapNativeElement) {
    const options = { center: this.coordinates, zoom: 8 };
    this.map = new google.maps.Map(mapNativeElement, options);
    this.marker.setMap(this.map);
    this.placesService = new google.maps.places.PlacesService(this.map);
    this.setPlace(this.place);
  }

  setPlace(place: google.maps.places.PlaceResult) {
    this.place = place;
    if (!this.map || !place || !place.geometry) return;

    console.log('thisplace', place);
    if (place.geometry.viewport) {
      this.map.fitBounds(place.geometry.viewport);
    } else {
      this.map.setCenter(place.geometry.location);
      this.map.setZoom(17);
    }

    // @ts-ignore
    this.marker.setPlace({
      placeId: place.place_id,
      location: place.geometry.location
    });
    this.marker.setVisible(true);
  }

  setAutocomplete(input, callback) {
    var ac = new google.maps.places.Autocomplete(input);
    ac.bindTo('bounds', this.map);
    ac.setFields(['place_id', 'name', 'geometry', 'icon']);
    ac.addListener('place_changed', () => callback(ac.getPlace().place_id));
  }

  getDetails(placeId: string): Promise<google.maps.places.PlaceResult> {
    return new Promise<google.maps.places.PlaceResult>((resolve, reject) => {
      this.placesService.getDetails({ placeId }, (place, status) => {
        if (status === 'OK') resolve(place); else reject(status);
      });
    });
  }
}
