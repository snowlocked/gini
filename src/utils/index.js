export const gini = data => {
  data = data.sort((a, b) => a > b)
  const len = data.length
  let sumData = []
  data.forEach((value, index) => {
    index === 0 && sumData.push(value)
    index > 0 && sumData.push(sumData[index - 1] + value)
  })
  const avgArea = sumData[len - 1] * (len + 1) / 2

  const sumArea = sumData.reduce((sum, value) => sum + value, 0)
  return (avgArea - sumArea) / avgArea
}

export const getRandom = (max = 100, min = 0) => Math.floor(Math.random() * (max - min) + min)

export const setColor = (index, total = 100) => {
  let p = (256 ** 3) * index / total
  const red = Math.floor(p / (256 ** 2))
  if (red >= 256) {
    return 'rgba(255,255,255, 1)'
  }
  p = p % (256 ** 2)
  const green = Math.floor(p / 256)
  const blue = Math.floor(p % 256)
  return `rgba(${red},${green},${blue}, 1)`
}
