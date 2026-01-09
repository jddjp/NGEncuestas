import { OnInit } from "@angular/core";
import { Component } from "@angular/core";
import { LayoutService } from "./service/app.layout.service";
import { Router } from "@angular/router";
import { MessageService, ConfirmationService } from "primeng/api";

@Component({
  providers: [MessageService, ConfirmationService],
  selector: "app-menu",
  templateUrl: "./app.menu.component.html",
})
export class AppMenuComponent implements OnInit {
  model: any[] = [];

  constructor(
    private confirmationService: ConfirmationService,
    public layoutService: LayoutService,
    private router: Router
  ) { }

  ngOnInit() {
    var rol = this.getRol()

    if (rol == "A") {
      this.model = [
        {
          label: "Menú",
          icon: "pi pi-fw pi-briefcase",
          items: [
            /*{
              label: "Dashboard",
              icon: "pi pi-fw pi-chart-pie",
              routerLink: ["/dashboard/dashboard"],
            },
            {
              label: "Propuestas",
              icon: "pi pi-fw pi-file",
              routerLink: ["/dashboard/proposals"],
            },
            {
              label: "Biografía",
              icon: "pi pi-fw pi-user",
              routerLink: ["/dashboard/profile"],
            },
            {
              label: "Comentarios",
              icon: "pi pi-comments",
              routerLink: ["/dashboard/comments"],
            },
            {
              label: "Multimedia",
              icon: "pi pi-fw pi-image",
              routerLink: ["/dashboard/multimedia"],
            },*/
            
            
            {
              label: "Partidos",
              icon: "pi pi-fw pi-flag",
              routerLink: ["/dashboard/partidos"],
            },
            {
              label: "Estados",
              icon: "pi pi-fw pi-map",
              routerLink: ["/dashboard/estados"],
            },
            {
              label: "Valores",
              icon: "pi pi-fw pi-dollar",
              routerLink: ["/dashboard/valores"],
            },
            {
              label: "Usuarios",
              icon: "pi pi-fw pi-users",
              routerLink: ["/dashboard/users"],
            },
            /*{
              label: "Notificaciones",
              icon: "pi pi-fw pi-bell",
              routerLink: ["/dashboard/notifications"],
            },*/
            {
              label: "Salir",
              icon: "pi pi-fw pi-sign-in",
              command: () => this.salir(),
            },
          ],
        },
      ];
    }
    else{
      this.model = [
        {
          label: "Menú",
          icon: "pi pi-fw pi-briefcase",
          items: [
           
            {
              label: "Comentarios",
              icon: "pi pi-comments",
              routerLink: ["/dashboard/comments"],
            },
            {
              label: "Salir",
              icon: "pi pi-fw pi-sign-in",
              command: () => this.salir(),
            },
          ],
        },
      ];
    }
  }

  salir() {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `¿Deseas cerrar sesión?`,
      header: "Salir",
      icon: "pi pi-trash",
      acceptIcon: "none",
      rejectIcon: "none",
      rejectButtonStyleClass: "p-button-text",
      accept: () => {
        localStorage.clear();
        window.location.reload();
      },
    });

  }

  getRol(): String {
    if (localStorage.d) {
      var user = JSON.parse(localStorage.getItem('user'));
      return user.rol
    }

  }
}
