import { Injectable } from "@angular/core";
import { ConstantsComponent } from "../../shared/constants.component";
import { CrudService } from "./crud.service";
import { Profile } from "src/app/shared/interfaces/profile.interface";

@Injectable({
  providedIn: "root",
})
export class ProfileService {
  constructor(
    private crudService: CrudService,
  ) {}

  async addProfile(
    profile: Profile
  ): Promise<string | undefined> {
    try {
      const docRef = await this.crudService.add_(
        profile,
        ConstantsComponent.profile_collection
      );
      return docRef;
    } catch (error) {
      console.error("Error adding profile:", error);
      return undefined;
    }
  }

  async getProfile(): Promise<Profile> {
    try {
      const getAll = await this.crudService.getAll(
        ConstantsComponent.profile_collection
      );
      var get = getAll as Profile[]
      return  get[0];
    } catch (error) {
      console.error("Error fetching profile:", error);
      return ;
    }
  }

  async updateProfile(profile: Profile): Promise<boolean> {
    try {
      const updated = await this.crudService.update(
        profile,
        ConstantsComponent.profile_collection
      );
      return updated;
    } catch (error) {
      console.error("Error updating profile:", error);
      return false;
    }
  }

  async deleteProfile(profileId: string): Promise<boolean> {
    try {
      const deleted = await this.crudService.delete(
        profileId,
        ConstantsComponent.profile_collection
      );
      return deleted;
    } catch (error) {
      console.error("Error deleting profile:", error);
      return false;
    }
  }

}
