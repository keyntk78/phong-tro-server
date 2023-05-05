import generateCode from './generateCode'
const prices = [
  {
    min: 0,
    max: 1000000,
    value: 'Dưới 1 triệu'
  },
  {
    min: 1000000,
    max: 2000000,
    value: 'Từ 1 - 2 triệu'
  },
  {
    min: 2000000,
    max: 3000000,
    value: 'Từ 2 - 3 triệu'
  },
  {
    min: 3000000,
    max: 5000000,
    value: 'Từ 3 - 5 triệu'
  },
  {
    min: 5000000,
    max: 7000000,
    value: 'Từ 5 - 7 triệu'
  },
  {
    min: 7000000,
    max: 10000000,
    value: 'Từ 7 - 10 triệu'
  },
  {
    min: 10000000,
    max: 15000000,
    value: 'Từ 10 - 15 triệu'
  },
  {
    min: 15000000,
    max: 99999999999999999,
    value: 'Trên 15 triệu'
  }
]

const areas = [
  {
    min: 0,
    max: 20,
    value: 'Dưới 20m'
  },
  {
    min: 20,
    max: 30,
    value: 'Từ 20m - 30m'
  },
  {
    min: 30,
    max: 50,
    value: 'Từ 30m - 50m'
  },
  {
    min: 50,
    max: 70,
    value: 'Từ 50m - 70m'
  },
  {
    min: 70,
    max: 90,
    value: 'Từ 70m - 90m'
  },
  {
    min: 90,
    max: 9999999,
    value: 'Trên 90m'
  }
]

export const dataPrice = prices.map((item) => ({
  ...item,
  code: generateCode(item.value)
}))
export const dataArea = areas.map((item) => ({
  ...item,
  code: generateCode(item.value)
}))
