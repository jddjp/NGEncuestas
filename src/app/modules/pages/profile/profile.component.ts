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
import { SettingsService } from '../../../campaigns/service/settings.service';
import { ProfileService } from "src/app/campaigns/service/profile.service";
import { Award } from "src/app/shared/interfaces/awards";
import { Settings } from "src/app/shared/interfaces/settiings.interface";

@Component({
  providers: [MessageService, ConfirmationService],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  wait = true;
  loadingImage =false
  form: FormGroup;
  formAward : FormGroup
  ID_DATA: string = "";
  newDialog: boolean = false;
  loading: boolean = false;
  editar = false;
  iconButton = "pi pi-check";
  previsualizacion: any = "";
  imagenSelected = false;
  saving = false;
  replyTo: string = "";
  iconToAsk = "pi pi-question-circle";
  iconColor = "text-blue-500";
  title = "Seleccionar Imagen";
  @ViewChild("fileInput", { static: false }) fileInput!: ElementRef;
  uidEdit = ""
  newImage = false;
  url_about_me = ""
  showDialog = false;
  showDialogPosition = false;
  awards: Award[] = []
  position: Award[] = []
  selectedItem;
  selectedItemPos;
  uidSettings :Settings
  constructor(
    //private proposalService: ProposalsService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private settingsService : SettingsService,
    private fileService: FileService,
    private profileService: ProfileService
  ) {
    this.form = this.fb.group({
      id:[""],
      uid: [""],
      career: ["",],
      position: [""],
      awards: [""],
      vision: [""],
    });

    this.formAward =  this.fb.group({
      order:[0],
      name:[""],
      icons:[""],
      description : [""]
    })
  }
  selectedIcon = 'fa-solid fa-medal';

  icons: string[] = [
    'fa-solid fa-medal',   // Check mark
    'fa-solid fa-trophy',   // Cross mark
    'fa-solid fa-award',    // Plus icon
    'fa-solid fa-briefcase',   // Minus icon
    'fa-solid fa-graduation-cap',    // Star icon
  ];
  
  async ngOnInit() {
    this.getData();
  }

  cleanForm() {
    this.form = this.fb.group({
      id: [""],
      uid: [""],
      career: ["",],
      position: [""],
      awards: [""],
      vision: [""],
    });

  
    this.ID_DATA = "";
  }

  cleanAward(){
    this.formAward = this.fb.group({
      order: [0],
      name: [""],
      icons: [""],
      description: [""]
    })
  }

  async getData() {
    this.wait = true;
    const data = await this.settingsService.getSettings();
    this.uidSettings = data
    this.url_about_me = data.img_about_me

    const profile = await this.profileService.getProfile()
    this.awards = profile.awards
    this.position = profile.position
    this.form.patchValue(profile)
    this.wait = false;
  }

  openNew() {
    
  }

  async edit(proposal: any) {

  }


  resetData() {
    this.form.reset();
    this.ID_DATA = "";
    this.loading = false;
    this.iconButton = "pi pi-check";
  }

  hideDialog() {
   
  }

  cancelEdit() {
    this.editar = false
  }

  async save() {
    //const docId = await this.profileService.addProfile(this.form.value);
   // console.log(this.form.value)
    this.form.value.uid = this.form.value.id;
    //this.form.value.awards = this.awards
    delete this.form.value.id;
    const updateDoc =  await this.profileService.updateProfile(this.form.value)
    
    if (updateDoc) {
      this.messageService.add({
        severity: "success",
        summary: "Correcto",
        detail: "Biografía actualizada correctamente",
        life: 3000,
      });
    }
    this.editar = false
  }

  async refreshList(){
    this.form.value.uid = this.form.value.id;
    this.form.value.awards = this.awards
    delete this.form.value.id;
    const updateDoc = await this.profileService.updateProfile(this.form.value)

    if (updateDoc) {
      this.messageService.add({
        severity: "success",
        summary: "Correcto",
        detail: "Biografía actualizada correctamente",
        life: 3000,
      });
    }
  }

  async refreshListPos() {
    this.form.value.uid = this.form.value.id;
    this.form.value.position = this.position
    delete this.form.value.id;
    const updateDoc = await this.profileService.updateProfile(this.form.value)

    if (updateDoc) {
      this.messageService.add({
        severity: "success",
        summary: "Correcto",
        detail: "Biografía actualizada correctamente",
        life: 3000,
      });
    }
  }

  async editForm() {
    this.editar = true
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

  async capturarFile(event) {
    //console.log(this.url_about_me)
    this.loadingImage = true
    this.cdr.detectChanges();
    const fotografiaCaptura = event.target.files[0];
    new Compressor(fotografiaCaptura, {
      quality: 0.7,
      maxWidth: 800,
      maxHeight: 800,
      success: async (compressedImage) => {
      
        const reader = new FileReader();
        reader.readAsDataURL(compressedImage);
        reader.onload = async () =>  {

          var remove = await this.fileService.removeFile(this.url_about_me)
          const imagenBase64 = reader.result as string;
          this.previsualizacion = imagenBase64;
          this.imagenSelected = true;
          //this.title = "";
          this.newImage = true;
          //this.form.value.image_file = this.previsualizacion;
          
          const blob = this.base64ToBlob(this.previsualizacion);
          const image_file = await this.fileService.uploadFile(blob,"home_imgs/");
          this.url_about_me = image_file.toString()
          this.uidSettings.img_about_me = image_file.toString()
          this.uidSettings.uid  = "app_settings"
          this.loadingImage = false
          await this.settingsService.updateSettings(this.uidSettings)
          this.messageService.add({
            severity: "success",
            summary: "Correcto",
            detail: "Imagen Actualizada corectamente",
            life: 3000,
          });
          this.cdr.detectChanges();
         // console.log(image_file)
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
    //return this.url_about_me
    return ConstantsComponent.url_storage + this.url_about_me;
  }

  addPosition() {
    this.cleanAward()
    this.showDialogPosition = true
  }

  addAward(){
    this.cleanAward()
    this.showDialog = true
  }

  async savePosition() {
    var newList = []
    newList.push(...this.position)
    var maxOrder = 1
    if(this.position.length != 0){
      maxOrder = Math.max(...newList.map(pos => pos.order))
    }
    this.position = []
    const pos: Award = {
      order: maxOrder + 1,
      name: this.formAward.value.name,
      description: this.formAward.value.description,
      icon: this.selectedIcon
    }
    newList.push(pos)
    this.position = newList
    await this.refreshListPos()
    this.showDialogPosition = false
    this.cleanAward()
  }

   saveAward(){
     var newList = []
     newList.push(...this.awards)
     var maxOrder = 1
     if (this.awards.length != 0) {
       maxOrder = Math.max(...newList.map(award => award.order));
     }
    // const maxOrder = Math.max(...newList.map(award => award.order));
     this.awards = []
     const award: Award = {
       order: maxOrder + 1,
       name: this.formAward.value.name,
       description: this.formAward.value.description,
       icon: this.selectedIcon
     }
     newList.push(award)
     this.awards = newList
     this.refreshList()
     this.showDialog = false
     this.cleanAward()
   }

  removePosition() {
    if (this.selectedItemPos == undefined || this.selectedItemPos.length == 0) {
      this.messageService.add({
        severity: "warn",
        summary: "Aviso",
        detail: "Selecciona un Cargo de la lista para remover",
        life: 3000,
      });
      return
    }
    var newList = this.position.filter(pos =>
      !this.selectedItemPos.some(selected => selected.order === pos.order)
    );
    this.position = []
    this.refreshListPos()
    this.position = newList

  }
  
  removeAward() {
    if(this.selectedItem == undefined || this.selectedItem.length == 0){
      this.messageService.add({
        severity: "warn",
        summary: "Aviso",
        detail: "Selecciona un Premio de la lista para remover",
        life: 3000,
      });
      return
    }
    var newList = this.awards.filter(award =>
      !this.selectedItem.some(selected => selected.order === award.order)
    );
    this.awards = []
    this.refreshList()
    this.awards = newList

  }

  /*onItemChange(event: any) {
    console.log('Ítem seleccionado:', this.selectedItem);
  }

  onItemSelect(event: any) {
    this.selectedItem = event.value;
    console.log('Ítem seleccionado:', this.selectedItem);
  }*/
  onSelectionChange(event: any) {
    this.selectedItem = event.value
    console.log('Selected items:', event.value);

  }

  onSelectionChangePo(event: any) {
    this.selectedItemPos = event.value
    console.log('Selected items Pos:', event.value);

  }

  // Método para seleccionar un ícono
  selectIcon(icon: string): void {
    this.selectedIcon = icon;
  }

  hideDialogNew() {
    this.showDialog = false;
    this.resetData();
  }
}
