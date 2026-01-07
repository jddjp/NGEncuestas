import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConstantsComponent } from 'src/app/shared/constants.component';
import { WidgetDialogDeleteComponent } from 'src/app/shared/widgets/widget-dialog-delete.component';
import { formatDate } from '@angular/common';
import { UserService } from 'src/app/campaigns/service/users.service';
import { DomSanitizer } from '@angular/platform-browser';
import { serverTimestamp } from 'firebase/firestore';
import { Chip } from 'primeng/chip';
import { User } from 'src/app/shared/interfaces/user.interface';

@Component({
    templateUrl: './users.component.html',
    providers: [MessageService],
    styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {
    @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;
    wait = true;
    usuarioForm: FormGroup;
    ID_DATA: string = '';
    newDialog: boolean = false;
    users: User[] = [];
    usuarioSelected: User = null;
    post: User = null;
    loading: boolean = false;
    rowsPerPageOptions = [5, 10, 20];
    editar = false;
    showInfo = false;
    iconButton = 'pi pi-check';
    columnasTable = [
        { field: 'name', header: 'Nombre' },
        { field: 'email', header: 'Correo' },
        { field: 'rol', header: 'Rol' },
    ];

    previsualizacion: any = '';
    imagenSelected = false;
    saving_user = false;
    showConfirmDeleteComment = false;
    showConfirmDeleteCommentReplie = false;
    loadingConfirmDeleteComment: boolean = false;
    showReplies: boolean = false;
    contentComment: string = "";
    replyTo: string = "";

    constructor(
        private userService: UserService,
        private fb: FormBuilder,
        private sanitizer: DomSanitizer,
        private messageService: MessageService
    ) {
        this.usuarioForm = this.fb.group({
            id:[''],
            name: [''],
            email: [''],
            rol: [''],
        
        });
    }

    async ngOnInit() {
        this.getData();
    }

    cleanForm() {
        this.usuarioForm = this.fb.group({
            id: [''],
            name: [''],
            email: [''],
            rol: [''],
        });
        this.ID_DATA = '';
    }
    async getData() {
        this.wait = true;
        const usuariosData = await this.userService.getUsers();
        //console.log(usuariosData);
        this.users = usuariosData;
        this.wait = false;
    }

    openNew() {
        this.iconButton = 'pi pi-check';
        this.editar = false;
        this.showInfo = true;
        this.cleanForm();
        this.clearImage();
    }

    removeComment(comment: any) {
       
    }

    removeCommentReplie(comment: any, replie: any) {
       
    }

    deleteSelectedProducts() {
       
    }

    _showConfirmDeleteComment(){
        this.showConfirmDeleteComment = true;
    }

    _showConfirmDeleteCommentRplie(){
        this.showConfirmDeleteCommentReplie = true;
    }

    editProduct(banner: any) {
        this.editar = true;
        this.newDialog = true;
        this.ID_DATA = banner.referencia;
    }

    async edit(user: any) {
        this.editar = true
        this.showInfo = true;
        this.usuarioForm.patchValue(user)
    }

    async showUser(user: any) {
      
    }

    async confirmDeleteSelected() {
    
    }

    async _showConfirmDelete(usuario: any){
      
        
    }

    deletePortada(portada: any) {
       
    }
    async confirmDelete() {

    }

    resetData() {
        this.usuarioForm.reset();
        this.ID_DATA = '';
        this.loading = false;
        this.iconButton = 'pi pi-check';
    }

    hideDialog() {
        this.showInfo = false;
    }

    hideDialogNew() {
        this.showInfo = false;
        this.resetData();
    }

    
    async saveUser() {
       
    }
    async editUser() {
        this.usuarioForm.value.uid = this.usuarioForm.value.id
        delete this.usuarioForm.value.id;
        console.log(this.usuarioForm.value)
        const docId =  await this.userService.updateUser(this.usuarioForm.value)
        if (docId) {
            this.messageService.add({
                severity: "success",
                summary: "Correcto",
                detail: "Usuario Editado correctamente",
                life: 3000,
            });
      }
      this.cleanForm()
      this.showInfo = false
    }

    dateFormat(timestamp: any) {
        const date = timestamp.toDate().toDateString();
        const format = 'dd/MM/yyyy';
        const locale = 'en-US';
        return formatDate(date, format, locale).toString();
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }

    triggerFileInput(): void {
        this.fileInput.nativeElement.click();
    }
    capturarFile(event) {
       
    }

    extraerBase64 = async ($event: any) =>
        new Promise((resolve, reject) => {
            try {
                const unsafeImg = window.URL.createObjectURL($event);
                const image = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
                const reader = new FileReader();
                reader.readAsDataURL($event);
                reader.onload = () => {
                    resolve({
                        base: reader.result,
                    });
                };
                reader.onerror = (error) => {
                    resolve({
                        base: null,
                    });
                };
            } catch (e) {
                return null;
            }
        });

    clearImage() {
    }


}
