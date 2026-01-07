import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { RouterModule } from "@angular/router";

import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { ImageModule } from "primeng/image";
import { WidgetInputTextComponent } from "./components/app-widget-input-text";
import { WidgetInputPassComponent } from "./components/app-widget-input-pass";
import { PasswordModule } from "primeng/password";
import { FileUploadModule } from "primeng/fileupload";
import { FileDemoComponent } from "./components/file/filedemo.component";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { RippleModule } from "primeng/ripple";
import { ToastModule } from "primeng/toast";
import { ToolbarModule } from "primeng/toolbar";
import { RatingModule } from "primeng/rating";
import { InputTextModule } from "primeng/inputtext";
import { InputTextareaModule } from "primeng/inputtextarea";
import { DropdownModule } from "primeng/dropdown";
import { RadioButtonModule } from "primeng/radiobutton";
import { InputNumberModule } from "primeng/inputnumber";
import { DialogModule } from "primeng/dialog";
import { WidgetInputSwitchModule } from "src/app/shared/widgets/widget-input-switch.module";
import { WidgetInputTextAreaModule } from "src/app/shared/widgets/widget-input-textarea.module";
import { WidgetDialogDeleteModule } from "src/app/shared/widgets/widget-dialog-delete.module";
import { CalendarModule } from "primeng/calendar";
import { WidgetInputSelectModule } from "src/app/shared/widgets/widget-input-select.module";
import { WidgetInputCalendarModule } from "src/app/shared/widgets/widget-input-calendar.module";
import { WidgetInputChipsModule } from "src/app/shared/widgets/widget-input-chips.module";
import { SharedVariablesService } from "src/app/campaigns/service/shared_variables.service";
import { CheckboxModule } from "primeng/checkbox";
import { MultiSelectModule } from "primeng/multiselect";
import { CardModule } from "primeng/card";
import { AvatarModule } from "primeng/avatar";
import { DividerModule } from "primeng/divider";
import { TagModule } from "primeng/tag";
import { ChipModule } from "primeng/chip";
import { LoadingModule } from "./loading/loading.module";
import { ConfirmPopupModule } from "primeng/confirmpopup";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { TooltipModule } from 'primeng/tooltip';
import { StorageModule } from "@angular/fire/storage";
import { PanelModule } from 'primeng/panel';
import { OrderListModule } from 'primeng/orderlist';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ChartModule } from 'primeng/chart';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    ImageModule,
    PasswordModule,
    FileUploadModule,
    TableModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    RatingModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    RadioButtonModule,
    InputNumberModule,
    DialogModule,
    WidgetInputSwitchModule,
    WidgetInputTextAreaModule,
    WidgetDialogDeleteModule,
    WidgetInputSelectModule,
    WidgetInputCalendarModule,
    WidgetInputChipsModule,
    FileUploadModule,
    CalendarModule,
    CardModule,
    AvatarModule,
    DividerModule,
    TagModule,
    ChipModule,
    LoadingModule,
    ConfirmPopupModule,
    ConfirmDialogModule,
    TooltipModule,
    StorageModule,
    PanelModule,
    OrderListModule,
    ProgressSpinnerModule,
    ChartModule
  ],
  declarations: [
    WidgetInputTextComponent,
    WidgetInputPassComponent,
    FileDemoComponent,
  ],
  exports: [
    WidgetInputTextComponent,
    WidgetInputPassComponent,
    FileDemoComponent,
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    ImageModule,
    PasswordModule,
    FileUploadModule,
    CommonModule,
    TableModule,
    FileUploadModule,
    FormsModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    RatingModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    RadioButtonModule,
    InputNumberModule,
    DialogModule,
    WidgetInputSwitchModule,
    WidgetInputTextAreaModule,
    WidgetDialogDeleteModule,
    WidgetInputSelectModule,
    WidgetInputCalendarModule,
    WidgetInputChipsModule,
    FileUploadModule,
    CalendarModule,
    CardModule,
    AvatarModule,
    DividerModule,
    TagModule,
    ChipModule,
    LoadingModule,
    ConfirmPopupModule,
    ConfirmDialogModule,
    TooltipModule,
    StorageModule,
    PanelModule,
    OrderListModule,
    ProgressSpinnerModule,
    ChartModule
  ],
})
export class SharedModule {}
