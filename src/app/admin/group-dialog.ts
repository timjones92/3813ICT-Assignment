import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface DialogData {
    groupName: string;
  }

@Component({
    selector: 'group-dialog',
    templateUrl: 'group-dialog.html',
})
  
export class GroupDialog {
  
    constructor(
      public dialogRef: MatDialogRef<GroupDialog>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData) {}
  
    onCancelClick(): void {
      this.dialogRef.close();
    }
  
}