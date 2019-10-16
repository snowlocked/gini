import * as d3 from 'd3'

function getScaleY (data) {
  const max = d3.max(data, d => d[this.numberKey])
  const scaleY = (this.height - this.padding.bottom) * 0.9 / max
  return scaleY > 1 ? 1 : scaleY
}
export class Histogram {
  constructor (options) {
    let {
      width,
      height,
      data,
      padding,
      numberKey,
      selector
    } = options
    this.width = width || 1050
    this.height = height || 600

    this.padding = Object.assign({}, padding, {
      top: 8,
      right: 8,
      bottom: 8,
      left: 8
    })
    this.step = (this.width - this.padding.left - this.padding.right) / (data.length || 1)
    this.data = data || []
    this.selector = selector || 'body'
    this.numberKey = numberKey
    this.tooltip = d3.select(this.selector)
      .append('text')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('display', 'block')
      .style('background', 'rgba(30,23,35,0.6)')
      .style('color', '#fff')
      .style('text-algin', 'center')
      .style('padding', '4px 8px')

    this.draw()
  }
  draw () {
    const scaleY = this.getScaleY(this.data)
    this.svg = d3
      .select(this.selector)
      .append('svg') // 在body中添加SVG
      .attr('width', this.width)
      .attr('height', this.height)
    this.rect = this.svg
      .selectAll('rect')
      .data(this.data) // 绑定数据
      .enter() // 获取enter部分
      .append('rect') // 添加rect元素,使其与绑定数组的长度一致
      .property('data', d => d)
    this.rect = this.setRectAttrs(this.rect, scaleY)
    this.rect = this.addToolTipEvent(this.rect)
  }
  update (data) {
    this.data = data || []
    this.step = (this.width - this.padding.left) / (data.length || 1)
    const scaleY = this.getScaleY(data)
    let updateRect = this.svg.selectAll('rect').data(this.data) // 错误 d3.selectAll() 出了svg范围
    let exitRect = updateRect.exit()
    let enterRect = updateRect.enter()

    // update处理方法
    this.setRectAttrs(
      updateRect
        .property('data', d => d)
        .transition(),
      scaleY
    )

    // enter处理方法
    enterRect = enterRect.append('rect')
      .property('data', d => d)
    enterRect = this.setRectAttrs(enterRect, scaleY)
    this.addToolTipEvent(enterRect)

    exitRect.transition().remove()
    // exitRect
  }
  getScaleY (data) {
    return getScaleY.call(this, data)
  }
  setRectAttrs (rect, scaleY) {
    return rect.attr('fill', d => d.color)
      .attr('x', (d, i) => this.padding.left + i * this.step)
      .attr('y', d => this.height - this.padding.bottom - d[this.numberKey] * scaleY)
      .attr('width', this.step)
      .attr('height', d => d[this.numberKey] * scaleY)
  }
  addToolTipEvent (rect) {
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
  updateTooltip (data, x, y) {
    if (x < 60) {
      x = 60
    }
    if (x > this.width - 60) {
      x = this.width - 60
    }
    const tspanData = [`id: ${data.id}`, `${this.numberKey}: ${data[this.numberKey]}`]
    const updateTooltip = this.tooltip
      .style('left', x - 48 + 'px')
      .style('top', y - 52 + 'px')
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
  remove () {
    this.tooltip.remove()
    this.svg.remove()
  }
}

export class LineChart {
  constructor (options) {
    let {
      width,
      height,
      data,
      padding,
      selector
    } = options
    this.width = width || 1050
    this.height = height || 600

    this.padding = Object.assign({}, padding, {
      top: 58,
      right: 58,
      bottom: 58,
      left: 58
    })
    this.step = (this.width - this.padding.left - this.padding.right) / (data.length || 1)
    this.data = data || []
    this.selector = selector || 'body'
    this.draw()
  }
  draw () {
    // const scaleY = this.getScaleY(this.data)
    this.svg = d3
      .select(this.selector)
      .append('svg') // 在body中添加SVG
      .attr('width', this.width)
      .attr('height', this.height)
    // x轴和y轴比例
    const axisScale = this.setAxisScale()
    // 定义x轴和y轴
    const axis = this.setAxis(axisScale)
    // 绘制x轴和y轴
    this.drawAxis(axis)
    // 绘制路径
    this.drawPath(axisScale)
    // 描点
    this.drawPoint(axisScale)
    this.tooltip = d3.select(this.selector)
      .append('text')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('display', 'block')
      .style('background', 'rgba(30,23,35,0.6)')
      .style('color', '#fff')
      .style('text-algin', 'center')
      .style('padding', '4px 8px')
  }
  setAxisScale () {
    const max = d3.max(this.data)
    // x轴比例
    const xScale = d3.scaleLinear()
      .domain([0, this.data.length])
      .range([0, this.width - this.padding.left - this.padding.right])
    // y轴比例
    const yScale = d3.scaleLinear()
      .domain([0, max])
      .range([this.height - this.padding.top - this.padding.bottom, 0])
    return {
      xScale,
      yScale
    }
  }
  setAxis ({ xScale, yScale }) {
    const xAxis = d3.axisBottom()
      .scale(xScale)
    const yAxis = d3.axisLeft()
      .scale(yScale)
    return {
      xAxis,
      yAxis
    }
  }
  drawAxis ({ xAxis, yAxis }) {
    this.svg.append('g')
      .attr('class', 'axis')
      .attr('transform', 'translate(' + this.padding.left + ',' + (this.height - this.padding.bottom) + ')')
      .call(xAxis)
    this.svg.append('g')
      .attr('class', 'axis')
      .attr('transform', 'translate(' + this.padding.left + ',' + this.padding.top + ')')
      .call(yAxis)
  }
  drawPath ({ xScale, yScale }) {
    // 定义路径函数
    const linePath = d3.line()
      .x((d, index) => xScale(index))
      .y(yScale)
    // 绘制路径
    this.svg.append('g')
      .append('path')
      .attr('class', 'line-path')
      .attr('transform', 'translate(' + this.padding.left + ',' + this.padding.top + ')')
      .attr('d', linePath(this.data))
      .attr('fill', 'none')
      .attr('stroke-width', 1)
      .attr('stroke', '#67C23A')
  }
  drawPoint ({ xScale, yScale }) {
    let step = Math.floor(this.data.length / 100)
    if (step < 1) {
      step = 1
    }
    const dataset = []
    this.data.forEach((item, index) => {
      if (index % step === 0 || index + 1 === this.data.length) {
        dataset.push([index, item])
      }
    })
    this.point = this.setPoints(dataset, { r: 5, color: 'transparent', xScale, yScale })
    this.addToolTipEvent(this.point, { xScale, yScale })
    this.setPoints(dataset, { r: 2, color: '#67C23A', xScale, yScale })
  }
  setPoints (data, { r, color, xScale, yScale }) {
    return this.svg.append('g')
      .selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('r', r)
      .property('data', d => d)
      .attr(
        'transform',
        (d, index) => 'translate(' + (xScale(d[0]) + this.padding.left) + ',' + (yScale(d[1]) + this.padding.top) + ')'
      )
      .attr('fill', color)
  }
  addToolTipEvent (point, scale) {
    const self = this
    return point.on('mouseover', function () {
      // console.log(this.data)
      self.updateTooltip(this.data, scale)
    })
      .on('mousemove', function () {
        self.updateTooltip(this.data, scale)
      })
  }
  updateTooltip (data, { xScale, yScale }) {
    const tspanData = [data[1].toFixed(5)]
    const x = data[0]
    const y = data[1]
    const updateTooltip = this.tooltip
      .style(
        'left',
        (xScale(x) + this.padding.left - 37) + 'px'
      )
      .style(
        'top',
        (yScale(y) + this.padding.top - 27) + 'px'
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
  remove () {
    this.tooltip.remove()
    this.svg.remove()
  }
}
