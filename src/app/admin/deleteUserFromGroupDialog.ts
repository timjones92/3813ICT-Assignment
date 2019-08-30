import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface DeleteUserFromGroupDialogData {
    users: [Object];
    groupName: string;
}

@Component({
    selector: 'deleteUserFromGroupDialog',
    templateUrl: 'deleteUserFromGroupDialog.html',
})
  
export class DeleteUserFromGroupDialog {
    selectedUser: string;

    constructor(
      public DeleteUserFromGroupDialogRef: MatDialogRef<DeleteUserFromGroupDialog>,
      @Inject(MAT_DIALOG_DATA) public data: DeleteUserFromGroupDialogData) {}
  
    onCancelClick(): void {
      this.DeleteUserFromGroupDialogRef.close();
    }
  
}