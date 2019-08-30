import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface AddChannelDialogData {
    groups: [Object];
    channelGroup: Object;
    channelName: string;
}

@Component({
    selector: 'addChannelDialog',
    templateUrl: 'addChannelDialog.html',
})
  
export class AddChannelDialog {

    constructor(
      public addChannelDialogRef: MatDialogRef<AddChannelDialog>,
      @Inject(MAT_DIALOG_DATA) public data: AddChannelDialogData) {}
  
    onCancelClick(): void {
      this.addChannelDialogRef.close();
    }
  
}