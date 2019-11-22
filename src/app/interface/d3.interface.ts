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

export interface AxisScaleLine{
  xScale: d3.ScaleLinear<number, number>,
  yScale: d3.ScaleLinear<number, number>,
  xScaleYear: d3.ScaleLinear<number, number>
}

export interface Axis{
  xAxis: d3.Axis<string|d3.AxisDomain> ,
  yAxis: d3.Axis<number | {valueOf(): number;} | d3.AxisDomain>
}

export interface HasAxis{
  x: boolean,
  y: boolean
}

export interface PointProps {
  r: number,
  color: string,
  xScale: d3.ScaleLinear<number, number>,
  yScale: d3.ScaleLinear<number, number>
}

