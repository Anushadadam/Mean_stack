import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Person } from '../../models/person.model';
import { PersonService } from '../../services/person.service';

@Component({
  selector: 'app-people-list',
  templateUrl: './people-list.component.html',
  styleUrls: ['./people-list.component.css']
})
export class PeopleListComponent implements OnInit {
  people: Person[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private personService: PersonService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadPeople();
  }

  loadPeople(): void {
    this.loading = true;
    this.personService.getPeople()
      .subscribe(
        data  => { this.people = data; this.loading = false; },
        error => { this.errorMessage = error; this.loading = false; }
      );
  }

  editPerson(id: number): void {
    this.router.navigate(['/edit', id]);
  }

  deletePerson(id: number): void {
    if (confirm('Are you sure you want to delete this person?')) {
      this.personService.deletePerson(id)
        .subscribe(
          () => this.people = this.people.filter(p => p.id !== id),
          error => this.errorMessage = error
        );
    }
  }

  addNewPerson(): void {
    this.router.navigate(['/add']);
  }
}
