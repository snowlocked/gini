import {PeopleData,FortuneData} from './interface'
import {getGini,getRandom,setColor} from './index'

class People {
  private id: number
  private fortune: number
  private history: number[] = []
  color: string
  constructor(data:PeopleData){
    this.id = data.id
    this.fortune = data.fortune
    this.color = data.color
    this.history.push(data.fortune)
  }

  addFortune(value: number){
    this.fortune += value
    this.fortune < 0 && (this.fortune = 0)
  }

  recordHistory(){
    this.history.push(this.fortune)
  }

  getFortune(): number{
    return this.fortune
  }

  getHistory(): number[] {
    return this.history
  }

  getInfo():PeopleData{
    return {
      id: this.id,
      fortune: this.fortune
    }
  }
}


export class Fortune{
  private total: number
  private peoples: People[] = []
  private giniHistory: number[] = [0]
  private middle: number
  private gini: number
  private sort: People[]
  length: number
  constructor(data:FortuneData){
    this.length = data.length
    for(let i = 0;i<this.length;i++){
      this.peoples.push(new People({
        id: i+1,
        fortune: data.fortune,
        color: setColor(i,this.length)
      }))
    }
    this.total = this.length * data.fortune
    this.middle = data.fortune
    this.gini = 0
    this.sort = this.peoples
  }

  execute(extraTimes: number = 0):void{   
    for (let i = 0; i < this.length; i++) {
      let fortune = this.peoples[i].getFortune()
      if (fortune >= 1) {
        this.peoples[i].addFortune(-1)
        this.addRandom(1)
      }
    }
    // console.log(times)
    for (let i = 1; i < extraTimes; i++) {
      this.addRandom(1)
    }
    const rest = extraTimes-Math.floor(extraTimes)
    rest > 0 && this.addRandom(rest)
    this.record()
  }

  addRandom(fortune:number):void{
    const index = getRandom(this.length)
    this.peoples[index].addFortune(fortune)
  }

  record():void{
    this.sortData()
    this.sort.forEach((people:People) => {
      people.recordHistory()
    })
    this.giniHistory.push(this.gini)
  }

  sortData ():void {
    this.sort = [...this.peoples]
      .sort((a:People, b:People) => a.getFortune() - b.getFortune())
    this.setMiddle()
    this.setGini()
  }

  getTotal():number {
    return this.total
  }

  setMiddle (): void{
    const data = this.sort
    if (this.length % 2 === 0) {
      this.middle = (data[this.length / 2 - 1].getFortune() + data[this.length / 2].getFortune()) / 2
    } else {
      this.middle = data[(this.length - 1) / 2].getFortune()
    }
  }

  getMiddle():number {
    return this.middle
  }

  setGini (): void{
    const giniData = getGini(this.sort.map((people:People):number => people.getFortune()))
    this.gini = giniData.gini
    this.total = giniData.total
  }

  getGini():number {
    return this.gini
  }

  getSortData():People[]{
    return this.sort
  }

  getGiniHistory():number[]{
    return this.giniHistory
  }

  getTargetPeopleHistory(id: number): number[] {
    const people =  this.peoples.find(people=>people.getInfo().id === id)
    if(people){
      return people.getHistory()
    }
    return []
  }

}
