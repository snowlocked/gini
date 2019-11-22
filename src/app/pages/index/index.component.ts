import { Component, OnInit,AfterViewInit,ViewChild,ElementRef } from '@angular/core';

import {Options,HasAxis} from '../../interface/d3.interface'
import {RunParams} from './index.interface'

import {Fortune} from '../../utils/fortune'
import {
  MONTH_TO_DAYS,
  YEAR_TO_MONTHS,
  YEAR_TO_DAYS
} from '../../utils/const'

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.less']
})
export class IndexComponent implements OnInit,AfterViewInit {
  @ViewChild("histogramForm", { static: false }) histogramForm: ElementRef;
  data = []
  giniHistory: number[] = []
  memberHistory: number[] = []
  private tabHeight:number=65
  private scrollWidth:number=17
  private graphOptions: Options
  private fortuneData: Fortune
  private currentRound: number = 0
  private extraTimes: number
  private timer : any = null
  private runData:RunParams
  private hasAxis:HasAxis = { x: false,y: true}
  currentTab: number = 0
  currentGini: number = 0
  currentMiddle: number = 0
  memberId: number
  membersNum: number = 100
  constructor() {

  }

  ngOnInit() {
    this.fortuneData = new Fortune({
      length:this.membersNum,
      fortune: 100
    })
    this.currentGini = this.fortuneData.getGini()
    this.currentMiddle = this.fortuneData.getMiddle()
    this.updateData()
    this.graphOptions = {
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

  ngAfterViewInit(){}

  changeTab(tab){
    if(tab===1){
      this.giniHistory = this.fortuneData.getGiniHistory()
    }
  }

  run(event:RunParams){
    this.runData = event
    this.membersNum = event.peoples
    this.fortuneData = new Fortune({
      length: this.membersNum,
      fortune: 100
    })
    
    this.runMonths(event.years * YEAR_TO_MONTHS)
    // console.log(event)
  }

  runOneDay(){
    // const {rate,peoples} = this.runData
    this.fortuneData.execute(this.extraTimes)
    this.currentGini = this.fortuneData.getGini()
    this.currentMiddle = this.fortuneData.getMiddle()
  }
  runOneMonth(){
    for(let i = 0;i < MONTH_TO_DAYS; i++){
      this.runOneDay()
    }
    this.updateData()
  }
  async runMonths(months:number){
    this.runOneMonth()
    if(months%YEAR_TO_MONTHS===0){
      this.extraTimes = (this.runData.rate/100) * (this.fortuneData.getTotal()/YEAR_TO_DAYS)
      // console.log(this.extraTimes)
    }
    months--
    months > 0 && setTimeout(()=>{
      this.runMonths(months)
    }, 2e3/YEAR_TO_MONTHS)
  }

  stop(){

  }

  updateData(){
    this.data = this.fortuneData.getSortData().map(people=>{
      const info = people.getInfo()
      return {
        id: info.id,
        data: info.fortune,
        color: people.color
      }
    })
  }

  drawMemberFortune(memberId){
    this.memberHistory = this.fortuneData.getTargetPeopleHistory(memberId)
  }
}
