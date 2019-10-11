import {
  gini,
  getRamdon,
  setColor
} from './index.js'

class People {
  constructor (data) {
    this.fortune = data.fortune
    this.id = data.id
    this.color = data.color
    const initData = {
      index: 1,
      fortune: this.fortune,
      round: 1
    }
    this.history = [initData]
    this.theRichest = initData
    this.thePoorest = initData
  }
  addFortune (value) {
    this.fortune += value
    this.fortune < 0 && (this.fortune = 0)
  }
  recordHistory (data) {
    data.index = this.history.length + 1
    this.history.push(data)
    this.setRichest(data)
    this.setPoorest(data)
  }
  setRichest (data) {
    if (data.fortune > this.theRichest.fortune) {
      this.theRichest = data
    }
  }
  setPoorest (data) {
    if (data.fortune < this.thePoorest.fortune) {
      this.thePoorest = data
    }
  }
}
class Fortune {
  constructor (data = {}) {
    !data.length && typeof data.length !== 'number' && (data.length = 100)
    !data.total && typeof data.total && (data.total = (data.avg || 100) * data.length)
    this.persons = []
    for (let i = 0; i < data.length; i++) {
      this.persons.push(
        new People({
          fortune: data.total / data.length,
          id: i + 1,
          color: setColor(i, data.length)
        })
      )
    }
    this.length = data.length
    this.giniHistory = []
    this.getMiddle(this.persons)
    this.getGini(this.persons)
  }
  calcGini () {
    const data = this.persons.map(person => person.fortune)
    return gini(data)
  }
  minus (fortune = 1) {
    this.persons.forEach(person => person.addFortune(-fortune))
  }
  add (fortune = 1, times = this.length) {
    for (let i = 0; i < times; i++) {
      const index = getRamdon(this.length)
      this.persons[index].addFortune(fortune)
    }
  }
  record () {
    // console.log(this.sortData())
    this.sortData()
      .forEach((person, index) => {
        person.recordHistory({
          fortune: person.fortune,
          round: this.length - index
        })
      })
  }
  excute (data = {}) {
    this.minus(data.minus || 1)
    this.add(data.add || 1, data.times || this.length)
    this.record()
  }
  sortData () {
    const sort = [...this.persons]
      .sort((personA, personB) => personA.fortune - personB.fortune)
    this.getMiddle(sort)
    this.getGini(sort)
    // console.log(sort)
    return sort
  }
  getMiddle (data) {
    if (this.length % 2 === 0) {
      this.middle = (data[this.length / 2 - 1].fortune + data[this.length / 2].fortune) / 2
    } else {
      this.middle = data[(this.length - 1) / 2].fortune
    }
  }
  getGini (data) {
    this.gini = gini(data.map(val => val.fortune))
    this.giniHistory.push(this.gini)
  }
}

export default Fortune
