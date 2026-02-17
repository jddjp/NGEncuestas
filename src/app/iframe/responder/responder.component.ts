import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-responder-encuesta',
    templateUrl: './responder.component.html',
    styles: []
})
export class ResponderComponent implements OnInit {
    
    encuestaId: string | null = null;
    encuesta: any = null;

    constructor(
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.encuestaId = this.route.snapshot.paramMap.get('id');
        // Cargar la encuesta por ID
    }

    onSubmit(): void {
        // Enviar respuestas de la encuesta
    }
}
