import { Injectable } from '@angular/core';
import { ConstantsComponent } from '../../shared/constants.component';
import { CrudService } from './crud.service';
import { Categorie } from 'src/app/shared/interfaces/categorie.interface';

@Injectable({
    providedIn: 'root',
})
export class CategoriesService {

constructor(
    private crudService: CrudService
  ) {}

  async addCategorie(
    categorie: Categorie
  ): Promise<string | undefined> {
    try {
      const docRef = await this.crudService.add_(
        categorie,
        ConstantsComponent.categorie_collection
      );
      return docRef;
    } catch (error) {
      console.error("Error adding categorie:", error);
      return undefined;
    }
  }

  async getAll(): Promise<Categorie[]> {
    try {
      const getAll = await this.crudService.getAll(
        ConstantsComponent.categorie_collection
      );
      return getAll as Categorie[];
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  }

  async updateCategorie(categorie: Categorie): Promise<boolean> {
    try {
      const updated = await this.crudService.update(
        categorie,
        ConstantsComponent.categorie_collection
      );
      return updated;
    } catch (error) {
      console.error("Error updating categorie:", error);
      return false;
    }
  }

  async deleteCategorie(categorieId: string): Promise<boolean> {
    try {
      const deleted = await this.crudService.delete(
        categorieId,
        ConstantsComponent.categorie_collection
      );
      return deleted;
    } catch (error) {
      console.error("Error deleting categorie:", error);
      return false;
    }
  }
}

