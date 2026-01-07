import { Injectable } from '@angular/core';
import { ConstantsComponent } from '../../shared/constants.component';
import { CrudService } from './crud.service';
import { User } from 'src/app/shared/interfaces/user.interface';

@Injectable({
    providedIn: 'root',
})
export class UserService {

constructor(
    private crudService: CrudService
  ) {}

  async addUser(
    user: User
  ): Promise<string | undefined> {
    try {
      const docRef = await this.crudService.add_(
        user,
        ConstantsComponent.users_collection
      );
      return docRef;
    } catch (error) {
      console.error("Error adding user:", error);
      return undefined;
    }
  }

  async getUsers(): Promise<User[]> {
    try {
      const getAll = await this.crudService.getAll(
        ConstantsComponent.users_collection
      );
      return getAll as User[];
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  }

  async updateUser(user: User): Promise<boolean> {
    try {
      const updated = await this.crudService.update(
        user,
        ConstantsComponent.users_collection
      );
      return updated;
    } catch (error) {
      console.error("Error updating user:", error);
      return false;
    }
  }

  async deleteUser(userId: string): Promise<boolean> {
    try {
      const deleted = await this.crudService.delete(
        userId,
        ConstantsComponent.users_collection
      );
      return deleted;
    } catch (error) {
      console.error("Error deleting user:", error);
      return false;
    }
  }
}

