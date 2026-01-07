import { Injectable } from '@angular/core';
import {
  Router,
  CanLoad,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { ConfigService } from 'src/config/config.service';
import { VariablesService } from '../app/services/variablesGL.service';
import { Rol } from 'src/app/models/rol.enum';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanLoad, CanActivate {
  userData: any;
  currentUser: any;
  constructor(private authService: ConfigService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    if (this.authService.Usuario) {
      this.currentUser = this.getRol();
        //console.log(route.url)

      if(this.currentUser == null || this.currentUser == undefined){
        localStorage.clear();
        this.router.navigate(['/login'], { replaceUrl: true });
        return false;
      }
      if (route.url.length != 0 && route.url[0].path == 'login') {
        this.router.navigate(['/dashboard/proposals'], { replaceUrl: true });
      }

      if (route.url.length != 0 ){
        if(this.currentUser == "U"){
          switch (route.url[0].path){
            case 'dashboard':
              this.router.navigate(['/dashboard/comments'], { replaceUrl: true });
              return ;
            case 'proposals':
              this.router.navigate(['/dashboard/comments'], { replaceUrl: true });
              return
            case 'users':
              this.router.navigate(['/dashboard/comments'], { replaceUrl: true });
              return
            case 'profile':
              this.router.navigate(['/dashboard/comments'], { replaceUrl: true });
                return
            case 'multimedia':
              this.router.navigate(['/dashboard/comments'], { replaceUrl: true });
              return
            default:
              //this.router.navigate(['/dashboard/comments'], { replaceUrl: true });
              return
            }
           
        }
        
      }

      return true;
    } else {
  
      localStorage.clear();
      if (route.url[0].path == 'login') {
        return true;
      } else {
        this.router.navigate(['/login'], { replaceUrl: true });
        return false;
      }
        
    }
  }

  canLoad(route: ActivatedRouteSnapshot,): boolean {
    if (this.authService.Usuario) {
      return true;
    } else {
      localStorage.clear();
      this.router.navigate(['/portal/login'], { replaceUrl: true });
      return false;
    }
  }

  getRol(): String {
    if (localStorage.d) {
      this.userData = JSON.parse(localStorage.getItem('user'));
      console.log(this.userData)

      if(this.userData == null || this.userData == undefined){ return null}
      return this.userData.rol
    }
  }
}
