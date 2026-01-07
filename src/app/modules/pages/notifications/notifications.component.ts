import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ConfirmationService, MessageService } from "primeng/api";
import { Table } from "primeng/table";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ConstantsComponent } from "src/app/shared/constants.component";
import { WidgetDialogDeleteComponent } from "src/app/shared/widgets/widget-dialog-delete.component";
import { formatDate } from "@angular/common";
import { UserService } from "src/app/campaigns/service/users.service";
import { DomSanitizer } from "@angular/platform-browser";
import { serverTimestamp, doc, updateDoc } from "firebase/firestore";
import { Chip } from "primeng/chip";
import { NotificationService } from "src/app/campaigns/service/notification.service";
import { Notification } from "src/app/shared/interfaces/notification.interface";
import { User } from "src/app/shared/interfaces/user.interface";

@Component({
  providers: [MessageService, ConfirmationService],
  templateUrl: "./notifications.component.html",
  styleUrl: "./notifications.component.scss",
})
export class NotificationsComponent {
  wait = true;
  form: FormGroup;
  ID_DATA: string = "";
  newDialog: boolean = false;
  notifications: Notification[] = [];
  loading: boolean = false;
  rowsPerPageOptions = [5, 10, 20];
  editar = false;
  showDialog = false;
  iconButton = "pi pi-check";
  columnasTable = [
    { field: "title", header: "Título" },
    { field: "description", header: "Descripción" },
    { field: "created_at", header: "Fecha de Creación" },
  ];

  previsualizacion: any = "";
  imagenSelected = false;
  saving_user = false;
  showConfirmDeleteComment = false;
  showConfirmDeleteCommentReplie = false;
  loadingConfirmDeleteComment: boolean = false;
  showReplies: boolean = false;
  contentComment: string = "";
  replyTo: string = "";
  users: User[] = [];
  iconToAsk = 'pi pi-question-circle';
  iconColor = 'text-blue-500';
  uidEdit = ""
  constructor(
    private noticationService: NotificationService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private userService: UserService,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer
  ) {
    this.form = this.fb.group({
      uid: [""],
      title: [""],
      description: [""],
      create_date: [""],
    });
  }

  async ngOnInit() {
    this.getData();
  }

  cleanForm() {
    this.form = this.fb.group({
      uid: [""],
      title: [""],
      description: [""],
      create_date: [""],
    });
    this.ID_DATA = "";
  }
  async getData() {
    this.wait = true;
    const notifactionsData = await this.noticationService.getNotifications();
    this.notifications = notifactionsData;
    const usuariosData = await this.userService.getUsers();
    this.users = usuariosData;
    this.wait = false;
  }

  openNew() {
    this.iconButton = "pi pi-check";
    this.editar = false;
    this.showDialog = true;
    this.cleanForm();
  }

  async edit(notification: any) {
    this.editar = true;
    this.uidEdit = notification.id
    this.iconButton = "pi pi-pencil";
    this.form.patchValue(notification);
    this.form.value.uid = notification.id
    this.showDialog = true;
  }

  async sendNotification(notification: any) {
    this.iconToAsk = 'pi pi-send';
    this.iconColor = 'bg-green-500';
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `¿Estás seguro de que deseas reenviar esta notificación ${notification.title}?`,
      header: "Reenviar Notificación",
      icon: "pi pi-trash",
      acceptIcon: "none",
      rejectIcon: "none",
      rejectButtonStyleClass: "p-button-text",
      accept: () => {
        this.users.forEach((item) => {
          if (item.token_notification_fcm) {
            this.noticationService.sendNotification(
              notification,
              item.token_notification_fcm
            );
          } else {
            console.warn(
              `El usuario ${item.name} no tiene token de notificación`
            );
          }
        });
      },
    });
  }
  async confirmDelete(notification: any) {
    this.iconToAsk = 'pi pi-trash';
    this.iconColor = 'bg-red-500';
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `¿Estás seguro de que deseas eliminar esta notificación ${notification.title}?`,
      header: "Eliminar",
      icon: "pi pi-trash",
      acceptIcon: "none",
      rejectIcon: "none",
      rejectButtonStyleClass: "p-button-text",
      accept: () => {
        this.noticationService
          .deleteNotification(notification.id)
          .then((res) => {
            if (res) {
              this.messageService.add({
                severity: "success",
                summary: "Eliminacion correcta",
                detail: "Notificación eliminada exitosamente",
                life: 3000,
              });
              this.getData();
            } else {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: "No se pudo eliminar la notificación",
                life: 3000,
              });
            }
          });
      },
    });
  }

  resetData() {
    this.form.reset();
    this.ID_DATA = "";
    this.loading = false;
    this.iconButton = "pi pi-check";
  }

  hideDialog() {
    this.showDialog = false;
  }

  hideDialogNew() {
    this.showDialog = false;
    this.resetData();
  }

  async save() {
    this.form.value.created_at = new Date();
    const docId = await this.noticationService.addNotification(this.form.value);
    console.log(docId);
    if (docId) {
      this.messageService.add({
        severity: "success",
        summary: "Correcto",
        detail: "Notificación creada exitosamente",
        life: 3000,
      });
    }
    this.getData();
    this.hideDialogNew();
  }

  async editForm() {

    this.form.value.uid = this.uidEdit
    const updateDoc = await this.noticationService.updateNotification(
      this.form.value
    );
    if (updateDoc) {
      this.messageService.add({
        severity: "success",
        summary: "Correcto",
        detail: "Notificación actualizada exitosamente",
        life: 3000,
      });
    }
    this.getData();
    this.hideDialogNew();
    this.resetData();
    console.log(this.form.value);
  }

  dateFormat(timestamp: any) {
    const date = timestamp.toDate().toDateString();
    const format = "dd/MM/yyyy HH:mm:ss";
    const locale = "en-US";
    return formatDate(date, format, locale).toString();
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, "contains");
  }
}
