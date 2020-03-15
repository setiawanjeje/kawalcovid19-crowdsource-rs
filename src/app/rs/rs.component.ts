import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import 'firebase/firestore';

@Component({
  selector: 'app-rs',
  templateUrl: './rs.component.html',
  styleUrls: ['./rs.component.css']
})
export class RsComponent implements OnInit {
  rsForm;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,

  ) { 

    this.rsForm = this.formBuilder.group({
      name: '',
      address: '',
      lat: '',
      lng: '',
    });
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(map((params: ParamMap) =>
      params.get('id')
    ));
  }

  onSubmit(data) {
    console.log('data', data);
    return false;
  }
}
