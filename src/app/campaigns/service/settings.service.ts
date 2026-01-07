import { Injectable } from "@angular/core";
import { ConstantsComponent } from "../../shared/constants.component";
import { CrudService } from "./crud.service";
import { ListenerService } from "./listerner";
import { Settings } from "src/app/shared/interfaces/settiings.interface";

@Injectable({
  providedIn: "root",
})
export class SettingsService {
  constructor(
    private crudService: CrudService,
  //  private listenerService: ListenerService
  ) {}

  async addSettings(
    settings: Settings
  ): Promise<string | undefined> {
    try {
      const docRef = await this.crudService.add_(
        settings,
        ConstantsComponent.settings_collection
      );
      return docRef;
    } catch (error) {
      console.error("Error adding settings:", error);
      return undefined;
    }
  }

  async getSettings(): Promise<Settings> {
    try {
      const getAll = await this.crudService.getAll(
        ConstantsComponent.settings_collection
      );
      var get = getAll as Settings[]
      return  get[0];
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return ;
    }
  }

  async updateSettings(settings: Settings): Promise<boolean> {
    try {
      const updated = await this.crudService.update(
        settings,
        ConstantsComponent.settings_collection
      );
      return updated;
    } catch (error) {
      console.error("Error updating settings:", error);
      return false;
    }
  }

  async deleteSettings(notificationId: string): Promise<boolean> {
    try {
      const deleted = await this.crudService.delete(
        notificationId,
        ConstantsComponent.settings_collection
      );
      return deleted;
    } catch (error) {
      console.error("Error deleting settings:", error);
      return false;
    }
  }

}
