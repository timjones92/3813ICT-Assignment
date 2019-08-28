import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface AddGroupUserDialogData {
    users: [Object];
    groupName: string;
}

@Component({
    selector: 'addGroupUserDialog',
    templateUrl: 'addGroupUserDialog.html',
})
  
export class AddGroupUserDialog {
    selectedUser: string;

    constructor(
      public addGroupUserDialogRef: MatDialogRef<AddGroupUserDialog>,
      @Inject(MAT_DIALOG_DATA) public data: AddGroupUserDialogData) {}
  
    onCancelClick(): void {
      this.addGroupUserDialogRef.close();
    }
  
}