import * as d3 from 'd3'

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
    // const self = this
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
    const max = d3.max(data, d => d[this.numberKey])
    const scaleY = (this.height - this.padding.bottom) * 0.9 / max
    return scaleY > 1 ? 1 : scaleY
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
}
