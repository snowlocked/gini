import {
  expect
} from 'chai'
import {
  gini,
  getRamdon,
  setColor
} from '@/utils/index'
describe('utils/index', () => {
  it('gini', () => {
    let data = Array(100).fill(1)
    expect(gini(data)).to.equal(0)
    data = Array(99).fill(0)
    data.push(100)
    expect(gini(data)).to.equal(99 / 101)
  })
  it('random', () => {
    expect(getRamdon(1)).to.equal(0)
    expect(getRamdon(2, 1)).to.equal(1)
    expect(getRamdon(2, 0)).to.not.equal(2)
  })
  it('setColor', () => {
    expect(setColor(2, 100)).to.equal('rgba(5,30,184, 1)')
    expect(setColor(2, 50)).to.equal('rgba(10,61,112, 1)')
    expect(setColor(0, 50)).to.equal('rgba(0,0,0, 1)')
    expect(setColor(50, 50)).to.equal('rgba(255,255,255, 1)')
  })
})
