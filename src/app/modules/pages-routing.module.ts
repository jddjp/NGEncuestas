import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NotFoundComponent } from "../not-found/not-found.component";
import { AuthGuard } from "src/config/auth.guard";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: "dashboard",
        loadChildren: () =>
          import("./pages/dashboard/dashboard.module").then((m) => m.DashboardModule),
        canActivate: [AuthGuard]
      },
      {
        path: "users",
        loadChildren: () =>
          import("./pages/users/users.module").then((m) => m.UsersModule),
        canActivate: [AuthGuard]
      },
      {
        path: "notifications",
        loadChildren: () =>
          import("./pages/notifications/notifications.module").then(
            (m) => m.NotificationsModule
          ),
        canActivate: [AuthGuard]
      },
      {
        path: "proposals",
        loadChildren: () =>
          import("./pages/proposals/proposals.module").then(
            (m) => m.ProposalsModule
          ),
        canActivate: [AuthGuard]
      },
        {
        path: "profile",
        loadChildren: () =>
          import("./pages/profile/profile.module").then(
            (m) => m.ProfileModule
          ),
          canActivate: [AuthGuard]
      },
      {
        path: "comments",
        loadChildren: () =>
          import("./pages/comments/comments.module").then(
            (m) => m.CommentsModule
          ),
          canActivate: [AuthGuard]
        
      },
      {
        path: "estados",
        loadChildren: () =>
          import("./pages/estados/estados.module").then(
            (m) => m.EstadosModule
          ),
          canActivate: [AuthGuard]
      },
      {
        path: "partidos",
        loadChildren: () =>
          import("./pages/partidos/partidos.module").then(
            (m) => m.PartidosModule
          ),
          canActivate: [AuthGuard]
      },
      {
        path: "valores",
        loadChildren: () =>
          import("./pages/valores/valores.module").then(
            (m) => m.ValoresModule
          ),
          canActivate: [AuthGuard]
      },
      {
        path: "multimedia",
        loadChildren: () =>
          import("./pages/multimedia/multimedia.module").then(
            (m) => m.MultimediaModule
          ),
          canActivate: [AuthGuard]
      },
      { path: "notFound", component: NotFoundComponent },
      { path: "**", redirectTo: "/notFound" },
    ]),
  ],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
