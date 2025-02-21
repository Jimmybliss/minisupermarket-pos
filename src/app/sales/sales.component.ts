import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-sales',
  imports: [],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.sass'
})
export class SalesComponent implements OnInit {
  salesData: any;
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get('http://localhost:8000/api/sales/').subscribe(data => {
      this.salesData = data;
      console.log(data);
    });
  }

}
