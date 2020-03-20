import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-viz',
  templateUrl: './viz.component.html',
  styleUrls: ['./viz.component.css']
})
export class VizComponent implements OnInit {
  location$: Observable<any>;

  constructor(
    private firestore: AngularFirestore,
    private route: ActivatedRoute,
  ) {
    this.location$ = this.route.paramMap.pipe(
      map(params => params.get('id') || '0:Indonesia'),
      switchMap((id: string) =>
        this.firestore.collection('hierarchy')
          .doc(id).get().pipe(map(snap => {
            const loc = snap.data();
            const children = [];
            if (id.startsWith('4:')) {
              for (let [rs_id, poi] of Object.entries<any>(loc.children)) {
                children.push({
                  link: ['/rs', poi.place.place_id],
                  name: poi.place.name,
                  data: poi.data
                });
              }
            } else {
              for (let [name, data] of Object.entries(loc.children)) {
                children.push({ link: ['/viz', name], name, data });
              }
            }
            children.sort((a, b) => a.name < b.name ? -1 : 1);
            loc.children = children;
            return loc;
          })))
    );
  }

  ngOnInit(): void {
  }

  numberFormat(x){
    return x?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  getLevel(id) {
    switch (id[0]) {
      case '0': return 'Nasional';
      case '1': return 'Provinsi';
      case '2': return 'Kabupaten/Kota';
      case '3': return 'Kecamatan';
      case '4': return 'Kelurahan/Desa';
    }
    return '???';
  }
}
