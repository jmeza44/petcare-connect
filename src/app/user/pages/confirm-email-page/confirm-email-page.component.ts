import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { ConfirmEmailRequest } from '../../models';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
    selector: 'pet-confirm-email-page',
    templateUrl: './confirm-email-page.component.html',
    standalone: true,
    imports: [CommonModule, ButtonComponent],
    styles: [``],
})
export class ConfirmEmailPageComponent implements OnInit {
    loading = false;
    error: string | null = null;
    success = false;

    constructor(
        private userService: UserService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        const email = this.route.snapshot.queryParamMap.get('email');
        const token = this.route.snapshot.queryParamMap.get('token');

        if (email && token) {
            this.handleEmailConfirmation({ email, token });
        } else {
            this.error = 'Información incompleta para confirmar el correo.';
        }
    }

    handleEmailConfirmation(request: ConfirmEmailRequest): void {
        this.loading = true;
        this.error = null;
        this.userService.confirmEmail(request).subscribe({
            next: () => {
                this.success = true;
                this.loading = false;
            },
            error: (err) => {
                console.log(err);
                this.error = err.error.message || 'Ocurrió un error al confirmar el correo electrónico.';
                this.loading = false;
            }
        });
    }

    redirectToLogin(): void {
        this.router.navigate(['/ingreso']);
    }
}
