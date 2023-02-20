function linearRegression(minDmg: number, maxDmg: number, range: number[], damage: number[]) {
  const xBar = range.reduce((sum, cur) => sum + cur, 0) / range.length
  const yBar = damage.reduce((sum, cur) => sum + cur, 0) / damage.length

  let numerator = 0
  let denominator = 0
  for (let i = 0; i < range.length; i++) {
    numerator += (range[i] - xBar) * (damage[i] - yBar)
    denominator += (range[i] - xBar) ** 2
  }

  const m = numerator / denominator
  const b = yBar - m * xBar

  const minX = (minDmg - b) / m
  const maxX = (maxDmg - b) / m

  return {
    line: {
      slope: m,
      yIntercept: b
    },
    minX,
    maxX
  }
}

const minDmg = 500
const maxDmg = 1000
const damage = [598, 652, 747, 905]
const range = [120, 130, 150, 180]

const result = linearRegression(minDmg, maxDmg, range, damage)
console.log('Line: y = ' + result.line.slope + 'x + ' + result.line.yIntercept)
console.log('Minimum X: ' + result.minX)
console.log('Maximum X: ' + result.maxX)
