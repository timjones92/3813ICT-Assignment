import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface UserDialogData {
    username: string;
    email: string;
    role: string;
}

@Component({
    selector: 'user-dialog',
    templateUrl: 'user-dialog.html',
})
  
export class UserDialog {
  
    constructor(
      public userDialogRef: MatDialogRef<UserDialog>,
      @Inject(MAT_DIALOG_DATA) public data: UserDialogData) {}
  
    onCancelClick(): void {
      this.userDialogRef.close();
    }
  
}