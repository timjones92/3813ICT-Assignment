import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface AddChannelUserDialogData {
    users: [Object];
    channelName: string;
}

@Component({
    selector: 'addChannelUserDialog',
    templateUrl: 'addChannelUserDialog.html',
})
  
export class AddChannelUserDialog {
    selectedUser: string;

    constructor(
      public addChannelUserDialogRef: MatDialogRef<AddChannelUserDialog>,
      @Inject(MAT_DIALOG_DATA) public data: AddChannelUserDialogData) {}
  
    onCancelClick(): void {
      this.addChannelUserDialogRef.close();
    }
  
}