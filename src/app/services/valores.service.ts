import { Injectable } from '@angular/core';
import { ConstantsComponent } from '../shared/constants.component';
import { CrudService } from '../campaigns/service/crud.service';
import { Valor } from '../shared/interfaces/valor.interface';

@Injectable({
  providedIn: 'root'
})
export class ValoresService {

  constructor(
    private crudService: CrudService
  ) {}

  async addValor(valor: Valor): Promise<string | undefined> {
    try {
      const valorData = {
        ...valor,
        fechaCreacion: new Date()
      };
      const docRef = await this.crudService.add_(
        valorData,
        ConstantsComponent.valores_collection
      );
      return docRef;
    } catch (error) {
      console.error("Error adding valor:", error);
      return undefined;
    }
  }

  async getValores(): Promise<Valor[]> {
    try {
      const getAll = await this.crudService.getAll(
        ConstantsComponent.valores_collection
      );
      return getAll as Valor[];
    } catch (error) {
      console.error("Error fetching valores:", error);
      return [];
    }
  }

  async updateValor(valor: Valor): Promise<boolean> {
    try {
      const valorData = {
        ...valor,
        fechaActualizacion: new Date()
      };
      const updated = await this.crudService.update(
        valorData,
        ConstantsComponent.valores_collection
      );
      return updated;
    } catch (error) {
      console.error("Error updating valor:", error);
      return false;
    }
  }

  async deleteValor(valorId: string): Promise<boolean> {
    try {
      const deleted = await this.crudService.delete(
        valorId,
        ConstantsComponent.valores_collection
      );
      return deleted;
    } catch (error) {
      console.error("Error deleting valor:", error);
      return false;
    }
  }
}
