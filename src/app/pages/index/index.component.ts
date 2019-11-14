import { Component, OnInit,AfterViewInit } from '@angular/core';

import {Options} from '../../component/d3-histogram/d3-histogram.interface'

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.less']
})
export class IndexComponent implements OnInit,AfterViewInit {
  data = [{
    id: 1,
    data: 100,
    color: 'red'
  },{
    id: 2,
    data: 120,
    color: 'green'
  },{
    id:3,
    data: 50,
    color: 'blue'
  }]
  private tabHeight:number=65
  private scrollWidth:number=17
  private histogramOptions: Options
  constructor() { }

  ngOnInit() {
    console.log(document.body.offsetHeight - this.tabHeight)
    this.histogramOptions = {
      height:  document.body.offsetHeight - this.tabHeight,
      width: document.body.offsetWidth-this.scrollWidth,
      padding : {
        top: 58,
        left: 58,
        bottom: 58,
        right: 58,
      }
    }
  }

  ngAfterViewInit(){
    
  }

}
