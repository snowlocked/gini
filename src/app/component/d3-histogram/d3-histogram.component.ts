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

import { Props, Options, AxisScale, Axis, HasAxis } from './d3-histogram.interface'

@Component({
  selector: 'app-d3-histogram',
  templateUrl: './d3-histogram.component.html',
  styleUrls: ['./d3-histogram.component.less']
})
export class D3Histogram implements OnInit, AfterViewInit, OnChanges {

  @ViewChild("d3selector", { static: false }) d3selector: ElementRef;
  @Input() data: Array<Object>
  @Input() hasAxis: HasAxis = { x: true,y: true}
  @Input() props: Props = {
    dataKey: 'data',
    id: 'id',
    color: 'color',
  }
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

  ngAfterViewInit() {
    this.draw()
  }

  ngOnChanges() {
    this.update()
  }

  // 初始化画布
  draw() {
    const { width, height } = this.options
    this.svg = d3.select(this.d3selector.nativeElement)
      .append('svg') // 在body中添加SVG
      .attr('width', width)
      .attr('height', height)
    // x轴和y轴比例
    this.axisScale = this.getAxisScale()
    // 定义x轴和y轴
    const axis = this.getAxis(this.axisScale)
    this.drawAxis(axis)
    this.drawRect(this.axisScale)
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
  getAxisScale(): AxisScale {
    const { width, height, padding } = this.options
    //x轴的比例尺
    const xScale = d3.scaleBand()
      .domain(d3.range(0, this.data.length).map(value => {
        return value.toString()
      }))
      .rangeRound([0, width - padding.left - padding.right]);

    //y轴的比例尺
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(this.data.map(value => value[this.props.dataKey]))*1.1])
      .range([height - padding.top - padding.bottom, 0]);
    return {
      xScale, yScale
    }
  }

  // 获取坐标轴比例
  getAxis(scale: AxisScale): Axis {
    const { xScale, yScale } = scale

    const xAxis = d3.axisBottom(xScale)
      .scale(xScale)
    const yAxis = d3.axisLeft(yScale)
      .scale(yScale)
    return {
      xAxis,
      yAxis
    }
  }

  // 绘制坐标轴
  drawAxis(axis: Axis): void {
    const { xAxis, yAxis } = axis
    const { padding, height } = this.options
    this.hasAxis.x && this.svg.append('g')
      .attr('class', 'axis')
      .attr('transform', 'translate(' + padding.left + ',' + (height - padding.bottom) + ')')
      .call(xAxis)
    this.hasAxis.y && this.svg.append('g')
      .attr('class', 'axis')
      .attr('transform', 'translate(' + padding.left + ',' + padding.top + ')')
      .call(yAxis)
  }

  // 绘制柱形图
  drawRect(scale: AxisScale): void {
    const { padding, height } = this.options
    const { xScale, yScale } = scale
    const {dataKey,color} = this.props
    this.rects = this.svg.selectAll(".rect")
      .data(this.data)
      .enter()
      .append("rect")
      .attr("transform", "translate(" + padding.left + "," + padding.top + ")")
      .attr("x", (d, i) => xScale(i.toString()))
      .attr("y", d => yScale(d[dataKey]))
      .attr("width", xScale.bandwidth())
      .attr("height", d => height - padding.top - padding.bottom - yScale(d[dataKey]))
      .attr('fill',d=>d[color])
      .property('data', d => d)
    this.rects = this.addToolTipEvent(this.rects)
  }

  // 更新柱形图
  update () {
    if(this.svg && this.tooltip){
      this.remove()
      this.draw()
    }
  }

  // 设置柱形属性
  setRectAttrs (rect: any):any {
    const {height,padding} = this.options
    const {dataKey,color} = this.props
    const {xScale,yScale} = this.axisScale
    return rect
      .attr("x", (d, i) => xScale(i.toString()))
      .attr("y", d => yScale(d[dataKey]))
      .attr("width", xScale.bandwidth())
      .attr("height", d => height - padding.top - padding.bottom - yScale(d[dataKey]))
      .attr('fill',d=>d[color])
  }

  // 添加hover事件
  addToolTipEvent (rect:any):any{
    const self = this
    return rect.on('mouseover', function () {
      
      self.updateTooltip(this.data, this.x.baseVal.value, this.y.baseVal.value)
    })
      .on('mousemove', function () {
        self.updateTooltip(this.data, this.x.baseVal.value, this.y.baseVal.value)
      })
      .on('mouseout', () => {
        this.tooltip.transition().style('visibility', 'hidden')
      })
  }

  // 更新提示框信息
  updateTooltip(data:Object,x,y){
    const {width,padding} = this.options
    if (x < padding.left) {
      x = padding.left
    }
    if (x > width - padding.left) {
      x = width - padding.left
    }
    const tspanData = [`${this.props.id}: ${data[this.props.id]}`, `${this.props.dataKey}: ${data[this.props.dataKey]}`]
    const updateTooltip = this.tooltip
      .style('left', x + 'px')
      .style('top', y + 'px')
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

  // 移除画布
  remove () {
    this.tooltip.remove()
    this.svg.remove()
  }
}
