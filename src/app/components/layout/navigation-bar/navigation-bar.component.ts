import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../shared/button/button.component';
import { faBars } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'pet-navigation-bar',
  standalone: true,
  imports: [RouterLink, ButtonComponent],
  templateUrl: './navigation-bar.component.html',
  styles: ``
})
export class NavigationBarComponent implements OnInit {
  barsIcon = faBars;

  constructor() {}

  ngOnInit(): void {
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuToggle && mobileMenu) {
      menuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
      });
    }
  }
}
