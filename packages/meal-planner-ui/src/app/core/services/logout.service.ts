import { inject, Injectable } from "@angular/core";
import { StorageService } from "./storage.service";
import { SessionKeys } from "app/shared/definitions";
import { Router } from "@angular/router";

@Injectable({
    providedIn: 'root'
})

export class LogoutService {
    private storageService = inject(StorageService);
    private router = inject(Router);
    
    logout(){
        this.storageService.removeFromStorage(SessionKeys.Token);
        this.router.navigate(['/login']);
    }
}