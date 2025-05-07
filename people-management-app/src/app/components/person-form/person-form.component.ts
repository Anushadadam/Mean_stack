import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Person } from '../../models/person.model';
import { PersonService } from '../../services/person.service';

@Component({
  selector: 'app-person-form',
  templateUrl: './person-form.component.html',
  styleUrls: ['./person-form.component.css']
})
export class PersonFormComponent implements OnInit {
  personForm: FormGroup;
  personId: number;
  isAddMode: boolean;
  loading = false;
  submitted = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private svc: PersonService
  ) { }

  ngOnInit() {
    this.personId = +this.route.snapshot.params['id'];
    this.isAddMode = !this.personId;

    this.personForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName:  ['', [Validators.required, Validators.maxLength(50)]],
      email:     ['', [Validators.required, Validators.email]],
      age:       ['', [Validators.required, Validators.min(1), Validators.max(120)]]
    });

    if (!this.isAddMode) {
      this.svc.getPerson(this.personId).subscribe(
        p => this.personForm.patchValue(p),
        e => this.errorMessage = e
      );
    }
  }

  get f() { return this.personForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.personForm.invalid) return;
    this.loading = true;

    const person: Person = {
      id: this.isAddMode ? 0 : this.personId,
      ...this.personForm.value
    };

    if (this.isAddMode) {
      this.svc.addPerson(person).subscribe(
        () => this.router.navigate(['/people'], { queryParams: { created: true } }),
        e => { this.errorMessage = e; this.loading = false; }
      );
    } else {
      this.svc.updatePerson(person).subscribe(
        () => this.router.navigate(['/people'], { queryParams: { updated: true } }),
        e => { this.errorMessage = e; this.loading = false; }
      );
    }
  }

  cancelForm() {
    this.router.navigate(['/people']);
  }
}
