import { Component, OnInit,AfterViewInit,ViewChild,ElementRef } from '@angular/core';

import {Options} from '../../component/d3-histogram/d3-histogram.interface'

import {Fortune} from '../../utils/fortune'

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.less']
})
export class IndexComponent implements OnInit,AfterViewInit {
  @ViewChild("histogramForm", { static: false }) histogramForm: ElementRef;
  data = []
  private tabHeight:number=65
  private scrollWidth:number=17
  private histogramOptions: Options
  private fortuneData: Fortune
  currentGini: number = 0
  currentMiddle: number = 0
  constructor() {

  }

  ngOnInit() {
    this.fortuneData = new Fortune({
      length:100,
      fortune: 100
    })
    this.currentGini = this.fortuneData.getGini()
    this.currentMiddle = this.fortuneData.getMiddle()
    this.data = this.fortuneData.getSortData().map(people=>{
      const info = people.getInfo()
      return {
        id: info.id,
        data: info.fortune,
        color: people.color
      }
    })
    this.histogramOptions = {
      height:  document.body.offsetHeight - this.tabHeight,
      width: document.body.offsetWidth-this.scrollWidth,
      padding : {
        top: 58,
        left: 33,
        bottom: 58,
        right: 33,
      }
    }
  }

  ngAfterViewInit(){
    console.log(this.histogramForm)
  }

  run(event){
    console.log(event)
  }

  stop(){
    
  }
}
