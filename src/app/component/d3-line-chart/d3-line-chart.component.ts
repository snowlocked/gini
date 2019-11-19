import { 
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  OnChanges,
  ElementRef,
  Input 
} from '@angular/core';

import * as d3 from 'd3'

import { Props, Options, AxisScale, Axis, HasAxis } from '../../interface/d3.interface'
  

@Component({
  selector: 'app-d3-line-chart',
  templateUrl: './d3-line-chart.component.html',
  styleUrls: ['./d3-line-chart.component.less']
})
export class D3LineChartComponent implements OnInit,AfterViewInit,OnChanges {
  @ViewChild("d3selector", { static: false }) d3selector: ElementRef;

  @Input() data: Array<number>
  @Input() hasAxis: HasAxis = { x: true,y: true}
  @Input() options: Options = {
    width: 1050,
    height: 600,
    padding: {
      top: 58,
      left: 33,
      bottom: 58,
      right: 33,
    }
  }
  private axisScale: AxisScale
  private svg: d3.Selection<SVGSVGElement, unknown, null, undefined>
  private rects: d3.Selection<SVGRectElement, Object, SVGSVGElement, unknown>
  private tooltip: d3.Selection<SVGTextElement, unknown, null, undefined>
  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit(){
    this.draw()
  }

  ngOnChanges(){}

  draw(){
    const { width, height } = this.options
    this.svg = d3.select(this.d3selector.nativeElement)
      .append('svg') // 在body中添加SVG
      .attr('width', width)
      .attr('height', height)
  }

}
