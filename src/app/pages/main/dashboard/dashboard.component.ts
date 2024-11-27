import { Component, OnInit } from '@angular/core';
import { FontAwesomeModule, IconDefinition } from '@fortawesome/angular-fontawesome';
import { faAngry } from '@fortawesome/free-regular-svg-icons';
import { faPaw } from '@fortawesome/free-solid-svg-icons';

@Component({
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './dashboard.component.html',
  styles: ``
})
export class DashboardComponent implements OnInit {
  sampleData = {
    usersCount: 120,
    ordersCount: 45,
    revenue: 8000,
  };

  icons: { [key: string]: IconDefinition; } = {
    angry: faAngry,
    paw: faPaw,
  };

  constructor() {}

  ngOnInit(): void {}
}
