import { Injectable } from '@angular/core';
import { ConstantsComponent } from '../shared/constants.component';
import { CrudService } from '../campaigns/service/crud.service';
import { Partido } from '../shared/interfaces/partido.interface';

@Injectable({
  providedIn: 'root'
})
export class PartidosService {

  constructor(
    private crudService: CrudService
  ) {}

  async addPartido(partido: Partido): Promise<string | undefined> {
    try {
      const partidoData = {
        ...partido,
        fechaCreacion: new Date()
      };
      const docRef = await this.crudService.add_(
        partidoData,
        ConstantsComponent.partidos_collection
      );
      return docRef;
    } catch (error) {
      console.error("Error adding partido:", error);
      return undefined;
    }
  }

  async getPartidos(): Promise<Partido[]> {
    try {
      const getAll = await this.crudService.getAll(
        ConstantsComponent.partidos_collection
      );
      return getAll as Partido[];
    } catch (error) {
      console.error("Error fetching partidos:", error);
      return [];
    }
  }

  async updatePartido(partido: Partido): Promise<boolean> {
    try {
      const partidoData = {
        ...partido,
        fechaActualizacion: new Date()
      };
      const updated = await this.crudService.update(
        partidoData,
        ConstantsComponent.partidos_collection
      );
      return updated;
    } catch (error) {
      console.error("Error updating partido:", error);
      return false;
    }
  }

  async deletePartido(partidoId: string): Promise<boolean> {
    try {
      const deleted = await this.crudService.delete(
        partidoId,
        ConstantsComponent.partidos_collection
      );
      return deleted;
    } catch (error) {
      console.error("Error deleting partido:", error);
      return false;
    }
  }

  async getPartidoPorSiglas(siglas: string): Promise<Partido | null> {
    try {
      const partidos = await this.getPartidos();
      const partido = partidos.find(p => p.siglas === siglas);
      return partido || null;
    } catch (error) {
      console.error("Error fetching partido by siglas:", error);
      return null;
    }
  }
}
