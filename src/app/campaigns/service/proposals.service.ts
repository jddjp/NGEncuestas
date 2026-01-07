import { Injectable } from "@angular/core";
import { ConstantsComponent } from "../../shared/constants.component";
import { CrudService } from "./crud.service";
import { Proposal } from "src/app/shared/interfaces/proposal.interface";

@Injectable({
  providedIn: "root",
})
export class ProposalsService {
  constructor(
    private crudService: CrudService,
  ) {}

  async addProposal(
    proposal: Proposal
  ): Promise<string | undefined> {
    try {
      const docRef = await this.crudService.add_(
        proposal,
        ConstantsComponent.proposals_collection
      );
      return docRef;
    } catch (error) {
      console.error("Error adding notification:", error);
      return undefined;
    }
  }

  async getProposal(): Promise<Proposal[]> {
    try {
      const getAll = await this.crudService.getAll(
        ConstantsComponent.proposals_collection
      );
      return getAll as Proposal[];
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return [];
    }
  }

  async updateProposal(proposal: Proposal): Promise<boolean> {
    try {
      console.log(proposal)
      const updated = await this.crudService.update(
        proposal,
        ConstantsComponent.proposals_collection
      );
      return updated;
    } catch (error) {
      console.error("Error updating notification:", error);
      return false;
    }
  }

  async deleteProposal(uid: string): Promise<boolean> {
    try {
      const deleted = await this.crudService.delete(
        uid,
        ConstantsComponent.proposals_collection
      );
      return deleted;
    } catch (error) {
      console.error("Error deleting notification:", error);
      return false;
    }
  }


}
