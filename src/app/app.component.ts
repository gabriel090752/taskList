import { BrowserModule } from '@angular/platform-browser';
import {AfterViewInit, Component, NgModule} from '@angular/core';
import {HttpClient, HttpClientModule, HttpClientJsonpModule, HttpErrorResponse} from '@angular/common/http';
import {RouterOutlet} from "@angular/router";
import {NgForOf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {catchError, Observable, Subscription, tap, throwError} from "rxjs"; // Import HttpClientModule


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgForOf, FormsModule, HttpClientModule, HttpClientJsonpModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})


export class AppComponent implements AfterViewInit{

  protected tasks: any[] = [];

  private task_requests:Object[] = [];

  constructor(private http: HttpClient) {
    this.getIp()

  }

  private ipAddress: string = ""

  ngAfterViewInit(){
    this.getData().subscribe(data => {
      this.task_requests = data
      this.tasks = (this.task_requests[this.task_requests.length - 1] as any).tasks
      console.log(this.tasks)
     });
  }
  onSubmit(event: any){
    this.tasks.push(event);
    this.sendData(this.ipAddress, this.tasks).subscribe(
      (response) => {
        console.log('Request successful:', response);
        this.tasks.push(response)
      },
      (error) => {
        console.error('Error sending request:', error);
      }
    );
  }

  get theTasks(){
    // @ts-ignore
    return this.task
  }
  set setTheTasks(task:any){
    this.tasks = task
  }
  getIp() {
    this.http.jsonp('http://api.ipify.org/?format=jsonp&callback=JSONP_CALLBACK', 'callback').pipe(
      catchError((err: HttpErrorResponse) => {
        console.error('JSONP Error:', err.message);
        return throwError(err);
      }),
      tap((response: any) => {
        // Extracting the IP address from the response
        this.ipAddress = response.ip;

        // Call getData() after fetching the IP address
        this.getData().subscribe(data => {
          this.task_requests = data;
          this.tasks = (this.task_requests[this.task_requests.length - 1] as any).tasks;
          console.log(this.tasks);
        });
      })
    ).subscribe();
  }

  sendData(key: string, data: any): Observable<any> {
    const body = { ipAddress: key, tasks: data };
    return this.http.post('http://localhost:8080/tasks', body);
  }

  getData() {
    const ipAddress = this.ipAddress
    return this.http.get(`http://localhost:8080/tasks/${ipAddress}`).pipe(
      tap((response: any) => {
      })
    );
  }
  lastElement(){
    console.log(this.task_requests[0])
  }

}
