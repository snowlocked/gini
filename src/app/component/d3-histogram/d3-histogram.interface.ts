import * as d3 from 'd3'

export interface Props {
  dataKey: string,
  id: string,
  color: string
}

export interface Padding{
  top: number,
  bottom: number,
  left: number,
  right: number
}

export interface Options {
  width:number, 
  height:number,
  padding:Padding
}

export interface AxisScale{
  xScale: d3.ScaleBand<string>,
  yScale: d3.ScaleLinear<number, number>
}

export interface Axis{
  xAxis: d3.Axis<string>,
  yAxis: d3.Axis<number | {valueOf(): number;}>
}

export interface HasAxis{
  x: boolean,
  y: boolean
}
