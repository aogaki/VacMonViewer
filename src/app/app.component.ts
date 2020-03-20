import { Component } from "@angular/core";
import { HttpClientService } from "./http-client.service";

declare var JSROOT: any;

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  title = "vac-mon-viewer";

  public autoRefresh = false;

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
    { title: "8 days", seconds: 8 * 24 * 60 * 60 }
  ];
  selectedDuration = this.timeDurations[0];

  getGraph() {
    const date = new Date();
    const offset = this.selectedDuration.seconds;
    const start = Math.round(date.getTime() / 1000) - offset;

    this.httpClientService
      .getVacMonGraph(String(start), "0", "PA1")
      .then(response => {
        const obj = JSROOT.parse(response["canvas"]);
        obj.fGridx = true;
        obj.fGridy = true;
        obj.fLogy = this.logScaleFlag;

        // To refresh the range of X-axis (time), this is simplest for me
        if (JSROOT.cleanup) JSROOT.cleanup("grPA1");
        JSROOT.redraw("grPA1", obj, "ALP");
      });

    this.httpClientService
      .getVacMonGraph(String(start), "0", "PA2")
      .then(response => {
        const obj = JSROOT.parse(response["canvas"]);
        obj.fGridx = true;
        obj.fGridy = true;
        obj.fLogy = this.logScaleFlag;

        // To refresh the range of X-axis (time), this is simplest for me
        if (JSROOT.cleanup) JSROOT.cleanup("grPA2");
        JSROOT.draw("grPA2", obj, "ALP");
      });
  }

  constructor(private httpClientService: HttpClientService) {
    this.getGraph();

    setInterval(() => {
      if (this.autoRefresh) {
        this.getGraph();
      }
    }, 5000);
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
}
