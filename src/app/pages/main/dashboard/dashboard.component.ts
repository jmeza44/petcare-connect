import { Component, OnInit } from '@angular/core';

@Component({
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styles: ``
})
export class DashboardComponent implements OnInit {
  sampleData = {
    usersCount: 120,
    ordersCount: 45,
    revenue: 8000,
  };

  constructor() {}

  ngOnInit(): void {}
}
