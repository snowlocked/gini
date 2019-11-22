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

import { Props, Options, AxisScaleLine, Axis, HasAxis } from '../../interface/d3.interface'
import {
  YEAR_TO_DAYS
} from '../../utils/const'
  

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
  private axisScale: AxisScaleLine
  private svg: d3.Selection<SVGSVGElement, unknown, null, undefined>
  private point: d3.Selection<SVGCircleElement, [number, number], SVGGElement, unknown>
  private tooltip: d3.Selection<SVGTextElement, unknown, null, undefined>
  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit(){
    this.draw()
  }

  ngOnChanges(){
    this.update()
  }

  draw(){
    const { width, height } = this.options
    this.svg = d3.select(this.d3selector.nativeElement)
      .append('svg') // 在body中添加SVG
      .attr('width', width)
      .attr('height', height)
    // x轴和y轴比例
    this.axisScale = this.getAxisScale()
    // 定义x轴和y轴
    const axis = this.getAxis(this.axisScale)
    // 绘制x轴和y轴
    this.drawAxis(axis)
    // 绘制路径
    this.drawPath(this.axisScale)
    // 描点
    this.drawPoint(this.axisScale)
    this.tooltip = d3.select(this.d3selector.nativeElement)
      .append('text')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('display', 'block')
      .style('background', 'rgba(30,23,35,0.6)')
      .style('color', '#fff')
      .style('text-algin', 'center')
      .style('padding', '4px 8px')
  }

  // 获取x,y轴比例尺
  getAxisScale(): AxisScaleLine {
    const {width,padding,height} = this.options
    const max = d3.max(this.data)*1.1
    // x轴比例
    const xScale = d3.scaleLinear()
      .domain([0, this.data.length])
      .range([0, width - padding.left - padding.right])
    const xScaleYear = d3.scaleLinear()
      .domain([0, Math.floor(this.data.length/YEAR_TO_DAYS)])
      .range([0, width - padding.left - padding.right])
    // y轴比例
    const yScale = d3.scaleLinear()
      .domain([0, max])
      .range([height - padding.top - padding.bottom, 0])
    return {
      xScale,
      yScale,
      xScaleYear
    }
  }

  getAxis (axisScale:AxisScaleLine): Axis{
    const {xScaleYear,yScale} = axisScale
    const xAxis = d3.axisBottom(xScaleYear)
      .scale(xScaleYear)
    const yAxis = d3.axisLeft(yScale)
      .scale(yScale)
    return {
      xAxis,
      yAxis
    }
  }

  drawAxis (axis:Axis): void{
    const {xAxis, yAxis} = axis
    const {padding,height} = this.options
    this.svg.append('g')
      .attr('class', 'axis')
      .attr('transform', 'translate(' + padding.left + ',' + (height - padding.bottom) + ')')
      .call(xAxis)
    this.svg.append('g')
      .attr('class', 'axis')
      .attr('transform', 'translate(' + padding.left + ',' + padding.top + ')')
      .call(yAxis)
  }

  drawPath (axisScale:AxisScaleLine): void{
    const {xScale, yScale} =  axisScale
    const {padding} = this.options
    // 定义路径函数
    const linePath = d3.line()
      .x(d => xScale(d[0]))
      .y(d => yScale(d[1]))
    // 绘制路径
    this.svg.append('g')
      .append('path')
      .attr('class', 'line-path')
      .attr('transform', 'translate(' + padding.left + ',' + padding.top + ')')
      .attr('d', linePath(this.data.map((number,index)=>[index,number])))
      .attr('fill', 'none')
      .attr('stroke-width', 1)
      .attr('stroke', '#67C23A')
  }

  drawPoint (axisScale:AxisScaleLine) {
    const {xScale, yScale} =  axisScale
    const step = YEAR_TO_DAYS
    const dataset:[number, number][] = []
    this.data.forEach((item, index) => {
      if (index % step === 0 || index + 1 === this.data.length) {
        dataset.push([index, item])
      }
    })
    this.point = this.setPoints(dataset, { r: 8, color: 'transparent', xScale, yScale })
    this.addToolTipEvent(this.point, axisScale)
    this.setPoints(dataset, { r: 3, color: '#67C23A', xScale, yScale })
  }

  setPoints (data:[number, number][], pointSetting) {
    const { r, color, xScale, yScale } = pointSetting
    const {padding} = this.options
    return this.svg.append('g')
      .selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('r', r)
      .property('data', d => d)
      .attr(
        'transform',
        (d, index) => 'translate(' + (xScale(d[0]) + padding.left) + ',' + (yScale(d[1]) + padding.top) + ')'
      )
      .attr('fill', color)
  }
  addToolTipEvent (point, scale:AxisScaleLine) {
    const self = this
    return point.on('mouseover', function () {
      // console.log(this.data)
      self.updateTooltip(this.data, scale)
    })
      .on('mousemove', function () {
        self.updateTooltip(this.data, scale)
      })
  }
  updateTooltip (data, scale:AxisScaleLine) {
    const {xScale, yScale} = scale
    const {padding} = this.options
    const tspanData = [data[1].toFixed(5)]
    const x = data[0]
    const y = data[1]
    const updateTooltip = this.tooltip
      .style(
        'left',
        (xScale(x) + padding.left - 37) + 'px'
      )
      .style(
        'top',
        (yScale(y) + padding.top - 27) + 'px'
      )
      .style('visibility', 'visible')
      .selectAll('tspan')
      .data(tspanData)
    const enterTooltip = updateTooltip.enter()
    const exitTooltip = updateTooltip.exit()
    updateTooltip
      .style('display', 'block')
      .text(t => t)
    enterTooltip
      .append('tspan')
      .style('display', 'block')
      .text(t => t)
    exitTooltip.remove()
  }

  update () {
    if(this.svg && this.tooltip){
      this.remove()
      this.draw()
    }
  }

  remove () {
    this.tooltip.remove()
    this.svg.remove()
  }

}
