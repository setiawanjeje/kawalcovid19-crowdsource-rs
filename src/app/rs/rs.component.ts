import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, filter, switchMap, tap } from 'rxjs/operators';
import { firestore } from 'firebase/app';

import 'firebase/firestore';

export interface Data {
  odp: number;
  pdpp: number;
  pdps: number;
  covp: number;
  covs: number;
  maskers: number;
  gloves: number;
  hazmats: number;
  others: number;
  contact: string;
  timestamp: any;
}

export class PlaceData {
  place: google.maps.places.PlaceResult;
  data: Data;
}

@Component({
  selector: 'app-rs',
  templateUrl: './rs.component.html',
  styleUrls: ['./rs.component.css']
})
export class RsComponent {
  rsForm;
  placeData$: Observable<PlaceData>;
  status = 'new';

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private firestore: AngularFirestore,
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

    this.placeData$ = this.route.paramMap.pipe(
      map((params: ParamMap) => params.get('id')),
      filter(Boolean),
      switchMap((placeId: string) =>
        this.firestore.collection('rs')
          .doc<PlaceData>(placeId)
          .valueChanges()),
      tap((placeData: PlaceData) => {
        const data: Data = { ...placeData.data };
        delete data.timestamp;
        this.rsForm.reset(data);
      })
    );
  }

  async onSubmit(data: Data, placeId: string) {
    this.status = 'updating';
    data.timestamp = firestore.FieldValue.serverTimestamp();
    const rsDoc = this.firestore.collection('rs').doc(placeId);
    await rsDoc.update({ data });
    await rsDoc.collection('requests').add(data);
    this.status = 'done';
    this.rsForm.markAsPristine();
    return false;
  }
}
