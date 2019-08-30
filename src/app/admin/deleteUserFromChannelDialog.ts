import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface DeleteUserFromChannelDialogData {
    users: [Object];
    channelName: string;
}

@Component({
    selector: 'deleteUserFromChannelDialog',
    templateUrl: 'deleteUserFromChannelDialog.html',
})
  
export class DeleteUserFromChannelDialog {
    selectedUser: string;

    constructor(
      public deleteUserFromChannelDialogRef: MatDialogRef<DeleteUserFromChannelDialog>,
      @Inject(MAT_DIALOG_DATA) public data: DeleteUserFromChannelDialogData) {}
  
    onCancelClick(): void {
      this.deleteUserFromChannelDialogRef.close();
    }
  
}