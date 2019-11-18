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

import { Props, Options, AxisScale, Axis } from './d3-histogram.interface'

@Component({
  selector: 'app-d3-histogram',
  templateUrl: './d3-histogram.component.html',
  styleUrls: ['./d3-histogram.component.less']
})
export class D3Histogram implements OnInit, AfterViewInit, OnChanges {

  @ViewChild("d3selector", { static: false }) d3selector: ElementRef;
  @Input() data: Array<Object>
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
      left: 58,
      bottom: 58,
      right: 58,
    }
  }
  private svg: d3.Selection<SVGSVGElement, unknown, null, undefined>
  private rects: d3.Selection<SVGRectElement, Object, SVGSVGElement, unknown>
  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.draw()
  }

  ngOnChanges() { }

  draw() {
    const { width, height } = this.options
    this.svg = d3.select(this.d3selector.nativeElement)
      .append('svg') // 在body中添加SVG
      .attr('width', width)
      .attr('height', height)
    // x轴和y轴比例
    const axisScale = this.getAxisScale()
    // 定义x轴和y轴
    const axis = this.getAxis(axisScale)
    this.drawAxis(axis)
    this.drawRect(axisScale)
  }

  getAxisScale(): AxisScale {
    const { width, height, padding } = this.options
    //x轴的比例尺
    const xScale = d3.scaleBand()
      .domain(d3.range(0, this.data.length).map(value => {
        return value.toString();
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

  drawAxis(axis: Axis): void {
    const { xAxis, yAxis } = axis
    const { padding, height } = this.options
    this.svg.append('g')
      .attr('class', 'axis')
      .attr('transform', 'translate(' + padding.left + ',' + (height - padding.bottom) + ')')
      .call(xAxis)
    this.svg.append('g')
      .attr('class', 'axis')
      .attr('transform', 'translate(' + padding.left + ',' + padding.top + ')')
      .call(yAxis)
  }

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
  }
}
