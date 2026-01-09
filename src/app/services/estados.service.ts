import { Injectable } from '@angular/core';
import { ConstantsComponent } from '../shared/constants.component';
import { CrudService } from '../campaigns/service/crud.service';
import { Estado } from '../shared/interfaces/estado.interface';

@Injectable({
  providedIn: 'root'
})
export class EstadosService {

  constructor(
    private crudService: CrudService
  ) {}

  async addEstado(estado: Estado): Promise<string | undefined> {
    try {
      const estadoData = {
        ...estado,
        fechaCreacion: new Date()
      };
      const docRef = await this.crudService.add_(
        estadoData,
        ConstantsComponent.estados_collection
      );
      return docRef;
    } catch (error) {
      console.error("Error adding estado:", error);
      return undefined;
    }
  }

  async getEstados(): Promise<Estado[]> {
    try {
      const getAll = await this.crudService.getAll(
        ConstantsComponent.estados_collection
      );
      return getAll as Estado[];
    } catch (error) {
      console.error("Error fetching estados:", error);
      return [];
    }
  }

  async updateEstado(estado: Estado): Promise<boolean> {
    try {
      const estadoData = {
        ...estado,
        fechaActualizacion: new Date()
      };
      const updated = await this.crudService.update(
        estadoData,
        ConstantsComponent.estados_collection
      );
      return updated;
    } catch (error) {
      console.error("Error updating estado:", error);
      return false;
    }
  }

  async deleteEstado(estadoId: string): Promise<boolean> {
    try {
      const deleted = await this.crudService.delete(
        estadoId,
        ConstantsComponent.estados_collection
      );
      return deleted;
    } catch (error) {
      console.error("Error deleting estado:", error);
      return false;
    }
  }

  async getEstadoPorCodigo(codigo: string): Promise<Estado | null> {
    try {
      const estados = await this.getEstados();
      const estado = estados.find(e => e.codigo === codigo);
      return estado || null;
    } catch (error) {
      console.error("Error fetching estado by codigo:", error);
      return null;
    }
  }
}
