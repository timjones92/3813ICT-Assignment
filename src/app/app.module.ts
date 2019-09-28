import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ChannelComponent } from './channel/channel.component';
import { GroupComponent } from './group/group.component';
import { SocketService } from './services/socket.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminComponent, AddGroupAssisDialog, DeleteGroupAssisDialog } from './admin/admin.component';
import { MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { 
  GroupDialog, 
  UserDialog, 
  AddGroupUserDialog, 
  DeleteUserFromGroupDialog,
  AddChannelDialog,
  AddChannelUserDialog,
  DeleteUserFromChannelDialog } from './admin/admin.component';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  entryComponents: [
    GroupDialog, 
    UserDialog, 
    AddGroupUserDialog, 
    DeleteUserFromGroupDialog, 
    AddChannelDialog, 
    AddChannelUserDialog, 
    DeleteUserFromChannelDialog,
    AddGroupAssisDialog,
    DeleteGroupAssisDialog
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    ChannelComponent,
    GroupComponent,
    AdminComponent,
    GroupDialog,
    UserDialog,
    AddGroupUserDialog,
    DeleteUserFromGroupDialog,
    AddChannelDialog,
    AddChannelUserDialog,
    DeleteUserFromChannelDialog,
    AddGroupAssisDialog,
    DeleteGroupAssisDialog
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    CommonModule,
    MatDialogModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    HttpClientModule,
    MatSelectModule,
    MatTabsModule
  ],
  providers: [SocketService, {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}}], 
  bootstrap: [AppComponent]
})
export class AppModule { }
