import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-alert-dialog",
  templateUrl: "./alert-dialog.component.html",
  styleUrls: ["./alert-dialog.component.css"],
})
export class AlertDialogComponent implements OnInit {
  // private warningSound: HTMLAudioElement = new Audio("assets/warning.mp3");

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public matDialogRef: MatDialogRef<AlertDialogComponent>
  ) {}

  ngOnInit(): void {
    // this.warningSound.load();
    // this.warningSound.loop = true;
    // this.warningSound.play();
  }

  onClickOkButton(): void {
    // this.warningSound.loop = false;
    // this.warningSound.pause();
    this.matDialogRef.close("OK");
  }
}
