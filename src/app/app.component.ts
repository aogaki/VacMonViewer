import { Component, OnInit } from "@angular/core";
import { HttpClientService } from "./http-client.service";
import { map } from "rxjs/operators";
import { Breakpoints, BreakpointObserver } from "@angular/cdk/layout";
import { MatDialog } from "@angular/material/dialog";
import { AlertDialogComponent } from "./alert/alert-dialog/alert-dialog.component";

declare var JSROOT: any;

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  title = "vac-mon-viewer";

  private dialogCanOpen: boolean = true;

  public autoRefresh: boolean = false;
  public logScaleFlag: boolean = false;

  timeDurations = [
    { title: "1 hour", seconds: 60 * 60 },
    { title: "2 hours", seconds: 2 * 60 * 60 },
    { title: "4 hours", seconds: 4 * 60 * 60 },
    { title: "8 hours", seconds: 8 * 60 * 60 },
    { title: "12 hours", seconds: 12 * 60 * 60 },
    { title: "1 day", seconds: 24 * 60 * 60 },
    { title: "2 days", seconds: 2 * 24 * 60 * 60 },
    { title: "4 days", seconds: 4 * 24 * 60 * 60 },
    { title: "8 days", seconds: 8 * 24 * 60 * 60 },
  ];
  selectedDuration = this.timeDurations[0];

  names = [
    { sensor: "PA1", graph: "grPA1" },
    { sensor: "PA2", graph: "grPA2" },
  ];

  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          {
            sensorName: this.names[0].sensor,
            grName: this.names[0].graph,
            cols: 2,
            rows: 1,
          },
          {
            sensorName: this.names[1].sensor,
            grName: this.names[1].graph,
            cols: 2,
            rows: 1,
          },
        ];
      }

      return [
        {
          sensorName: this.names[0].sensor,
          grName: this.names[0].graph,
          cols: 1,
          rows: 1,
        },
        {
          sensorName: this.names[1].sensor,
          grName: this.names[1].graph,
          cols: 1,
          rows: 1,
        },
      ];
    })
  );

  getGraph() {
    const date = new Date();
    const offset = this.selectedDuration.seconds;
    const start = Math.round(date.getTime() / 1000) - offset;

    for (let i = 0; i < this.names.length; i++) {
      const name = this.names[i];

      this.httpClientService
        .getVacMonGraph(String(start), "0", name.sensor)
        .then((response) => {
          const obj = JSROOT.parse(response["canvas"]);
          obj.fGridx = true;
          obj.fGridy = true;
          obj.fLogy = this.logScaleFlag;

          // To refresh the range of X-axis (time), this is simplest for me
          if (JSROOT.cleanup) JSROOT.cleanup(name.graph);
          JSROOT.redraw(name.graph, obj, "ALP");
        });
    }
  }

  getState() {
    this.httpClientService.getStatus().then((response) => {
      const status = response.status;
      if (status !== "OK") {
        if (this.dialogCanOpen) {
          this.openDialog(status);
        }
      }
    });
  }

  constructor(
    private httpClientService: HttpClientService,
    private breakpointObserver: BreakpointObserver,
    public dialog: MatDialog
  ) {
    this.getGraph();

    setInterval(() => {
      if (this.autoRefresh) {
        this.getGraph();
      }
    }, 5000);

    setInterval(() => {
      this.getState();
    }, 5000);

    // this.openDialog();
  }

  toggleAutoRefresh() {
    this.autoRefresh = !this.autoRefresh;
  }

  onTimeDurationSelected(): void {
    this.getGraph();
  }

  scaleChanged(): void {
    this.getGraph();
  }

  openDialog(errorMessage: string = "Kill the warning!") {
    this.dialogCanOpen = false;
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      data: {
        title: "Pressure monitor warning",
        message: errorMessage,
      },
      height: "300px",
      width: "500px",
      disableClose: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.dialogCanOpen = true;
    });
  }

  ngOnInit(): void {}
}
