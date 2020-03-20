import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class HttpClientService {
  private host: string = "http://172.18.4.56:8000/";
  // private host: string = "http://172.18.7.22/";
  private headers: any = new Headers({ "Content-Type": "application/json" });

  constructor(private http: HttpClient) {}

  private errorHandler(err) {
    console.log("Error occured.", err);
    return Promise.reject(err.message || err);
  }

  public getVacMonList(): Promise<any> {
    return this.http
      .get(this.host + "/ELIADE/GetVacMonList", this.headers)
      .toPromise()
      .then(res => {
        const response: any = res;
        return response;
      })
      .catch(this.errorHandler);
  }

  public getVacMonGraph(
    start: string = "0",
    stop: string = "0",
    name: string = "PA1"
  ): Promise<any> {
    return this.http
      .get(
        this.host +
          "/ELIADE/GetVacMonGraph?start=" +
          start +
          "&stop=" +
          stop +
          "&name=" +
          name,
        this.headers
      )
      .toPromise()
      .then(res => {
        const response: any = res;
        return response;
      })
      .catch(this.errorHandler);
  }
}
