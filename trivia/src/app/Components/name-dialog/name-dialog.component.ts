import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-name-dialog',
  templateUrl: './name-dialog.component.html',
  styleUrls: ['./name-dialog.component.scss']
})
export class NameDialogComponent implements OnInit {
  name = ""
  constructor(
    private dialogRef: MatDialogRef<NameDialogComponent>,
  ) { }

  ngOnInit(): void {
  }
  submit(){
    this.dialogRef.close({event:'close', name:this.name});
  }
  close() {
    this.dialogRef.close();
  }
}
