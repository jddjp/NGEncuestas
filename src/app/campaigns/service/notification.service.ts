import { Injectable } from "@angular/core";
import { ConstantsComponent } from "../../shared/constants.component";
import { Notification } from "src/app/shared/interfaces/notification.interface";
import { CrudService } from "./crud.service";
import { ListenerService } from "./listerner";

@Injectable({
  providedIn: "root",
})
export class NotificationService {
  constructor(
    private crudService: CrudService,
    private listenerService: ListenerService
  ) {}

  async addNotification(
    notification: Notification
  ): Promise<string | undefined> {
    try {
      const docRef = await this.crudService.add_(
        notification,
        ConstantsComponent.notifications_collection
      );
      return docRef;
    } catch (error) {
      console.error("Error adding notification:", error);
      return undefined;
    }
  }

  async getNotifications(): Promise<Notification[]> {
    try {
      const getAll = await this.crudService.getAll(
        ConstantsComponent.notifications_collection
      );
      return getAll as Notification[];
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return [];
    }
  }

  async updateNotification(notification: Notification): Promise<boolean> {
    try {
      const updated = await this.crudService.update(
        notification,
        ConstantsComponent.notifications_collection
      );
      return updated;
    } catch (error) {
      console.error("Error updating notification:", error);
      return false;
    }
  }

  async deleteNotification(notificationId: string): Promise<boolean> {
    try {
      const deleted = await this.crudService.delete(
        notificationId,
        ConstantsComponent.notifications_collection
      );
      return deleted;
    } catch (error) {
      console.error("Error deleting notification:", error);
      return false;
    }
  }

  async sendNotification(
    notification: Notification,
    tokenUser: string
  ): Promise<void> {
    this.listenerService.sendNotification(
      notification.title,
      notification.description,
      tokenUser
    );
  }
}
