import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
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
import { User } from "src/app/shared/interfaces/user.interface";
import { Proposal } from "src/app/shared/interfaces/proposal.interface";
import { ProposalsService } from "src/app/campaigns/service/proposals.service";
import { FileUpload } from "primeng/fileupload";
import Compressor from "compressorjs";
import { FileService } from "src/app/campaigns/service/file.service";
import { Categorie } from "src/app/shared/interfaces/categorie.interface";
import { CategoriesService } from "src/app/campaigns/service/categories.service";

@Component({
  providers: [MessageService, ConfirmationService],
  templateUrl: "./proposals.component.html",
  styleUrls: ["./proposals.component.scss"],
})
export class ProposalsComponent {
  wait = true;
  form: FormGroup;
  ID_DATA: string = "";
  newDialog: boolean = false;
  proposals: Proposal[] = [];
  loading: boolean = false;
  rowsPerPageOptions = [5, 10, 20];
  editar = false;
  showDialog = false;
  iconButton = "pi pi-check";
  columnasTable = [
    { field: "title", header: "Título" },
    { field: "categorie", header: "Categoría" },
    { field: "create_date", header: "Fecha de Creación" },
    { field: "active", header: "Activo" },
  ];

  previsualizacion: any = "";
  imagenSelected = false;
  saving = false;
  showConfirmDeleteComment = false;
  showConfirmDeleteCommentReplie = false;
  loadingConfirmDeleteComment: boolean = false;
  showReplies: boolean = false;
  contentComment: string = "";
  replyTo: string = "";
  users: User[] = [];
  iconToAsk = "pi pi-question-circle";
  iconColor = "text-blue-500";
  title = "Seleccionar Imagen";
  @ViewChild("fileInput", { static: false }) fileInput!: ElementRef;
  uidEdit = ""
  categories: Categorie[] = [];
  newImage = false;
  constructor(
    private proposalService: ProposalsService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private userService: UserService,
    private categoriesService : CategoriesService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private fileService: FileService
  ) {
    this.form = this.fb.group({
      uid: [""],
      title: ["", [Validators.required]],
      description: [""],
      categorie: ["",Validators.required],
      created_at: [""],
      url_image: [""],
      active: [false],
    });
  }

  async ngOnInit() {
    this.getData();
    this.getCategories()
  }

   async getCategories() {
        const categories = await this.categoriesService.getAll();
        this.categories = categories;
        this.wait = false;
    }

  cleanForm() {
    this.form = this.fb.group({
      uid: [""],
      title: ["", [Validators.required]],
      description: [""],
      categorie: [this.categories[0],Validators.required],
      created_at: [""],
      url_image: [""],
      active: [false],
    })
    this.ID_DATA = "";
  }
  async getData() {
    this.wait = true;
    const data = await this.proposalService.getProposal();
    this.proposals = data;
    const usuariosData = await this.userService.getUsers();
    this.users = usuariosData;
    this.wait = false;
  }

  openNew() {
    this.iconButton = "pi pi-check";
    this.editar = false;
    this.showDialog = true;
    this.editar = false
    this.previsualizacion = null
    this.imagenSelected = false
    this.title = "Seleccionar Imagen"
    this.cleanForm();
  }

  async edit(proposal: any) {
    //   console.log(proposal)
    this.newImage = false
    this.uidEdit = proposal.id;
    this.editar = true;
    this.iconButton = "pi pi-pencil";
    this.form.patchValue(proposal);
    this.showDialog = true;
  }

  async confirmDelete(proposal: any) {
    this.iconToAsk = "pi pi-trash";
    this.iconColor = "bg-red-500";
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `¿Estás seguro de que deseas eliminar esta propuesta ${proposal.title}?`,
      header: "Eliminar",
      icon: "pi pi-trash",
      acceptIcon: "none",
      rejectIcon: "none",
      rejectButtonStyleClass: "p-button-text",
      accept: () => {
        this.proposalService.deleteProposal(proposal.id).then((res) => {
          if (res) {
            this.messageService.add({
              severity: "success",
              summary: "Eliminacion correcta",
              detail: "Propuesta eliminada exitosamente",
              life: 3000,
            });
            this.getData();
          } else {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: "No se pudo eliminar la propuesta",
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
    if(this.form.invalid){
      return
    }
    if (this.previsualizacion == "") {
      this.messageService.add({
        severity: "warn",
        summary: "Aviso",
        detail: "Deberias seleccionar al menos una imagen",
        life: 3000,
      });
     // this.saving = false
      return;
    }
    this.saving = true;
    this.form.value.created_at = new Date();
    if (this.form.value.image_file !== "") {
      const blob = this.base64ToBlob(this.form.value.image_file);
      const image_file = await this.fileService.uploadFile(blob, "proposals/");
      this.form.value.url_image = image_file;
    }
    delete this.form.value.image_file;
    delete this.form.value.uid;
    const docId = await this.proposalService.addProposal(this.form.value);
    if (docId) {
      this.messageService.add({
        severity: "success",
        summary: "Correcto",
        detail: "Propuesta creada exitosamente",
        life: 3000,
      });
    }
    this.getData();
    this.hideDialogNew();
    this.saving = false;
  }

  async editForm() {
    this.saving = true
    this.form.value.uid = this.uidEdit;
    if (this.newImage && this.previsualizacion == "") {
      this.messageService.add({
        severity: "warn",
        summary: "Aviso",
        detail: "Deberias seleccionar al menos una imagen",
        life: 3000,
      });
      this.saving = false
      return;
    }

    if (this.newImage) {
      var remove = await this.fileService.removeFile(this.form.value.url_image)
      const blob = this.base64ToBlob(this.previsualizacion);
      const image_file = await this.fileService.uploadFile(blob, "proposals/");
      this.form.value.url_image = image_file;
      delete this.form.value.image_file;
    }
    const updateDoc = await this.proposalService.updateProposal(
      this.form.value
    );
    if (updateDoc) {
      this.messageService.add({
        severity: "success",
        summary: "Correcto",
        detail: "Propuesta actualizada exitosamente",
        life: 3000,
      });
    }
    this.getData();
    this.hideDialogNew();
    this.resetData();
    this.saving = false
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

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  capturarFile(event) {
    const fotografiaCaptura = event.target.files[0];
    new Compressor(fotografiaCaptura, {
      quality: 0.7,
      maxWidth: 800,
      maxHeight: 800,
      success: (compressedImage) => {
        const reader = new FileReader();
        reader.readAsDataURL(compressedImage);
        reader.onload = () => {
          const imagenBase64 = reader.result as string;
          this.previsualizacion = imagenBase64;
          this.imagenSelected = true;
          this.title = "";
          this.newImage = true;
          this.form.value.image_file = this.previsualizacion;
          this.cdr.detectChanges();
        };
      },
      error: (err) => {
        console.error("Error al comprimir la imagen:", err);
      },
    });
  }

  base64ToBlob(base64: string): Blob {
    const byteCharacters = atob(base64.split(",")[1]);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset++) {
      const byteArray = new Uint8Array(1);
      byteArray[0] = byteCharacters.charCodeAt(offset);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: "image/png" }); // Ajusta el tipo MIME según la imagen
  }

  clearImage() {
    this.title = "Seleccionar Imagen";
    this.imagenSelected = false;
    this.previsualizacion = "";
    this.cdr.detectChanges();
  }

  previewImgage() {
    return ConstantsComponent.url_storage + this.form.value.url_image;
  }
}
