export const getNumberFromString = (string) => {
  let number = 0
  if (string.search('đồng/tháng') !== -1) {
    number = +string.match(/\d+/)[0] / Math.pow(10, 3)
  } else if (string.search('triệu/tháng') !== -1) {
    number = +string.match(/\d+/)[0]
  } else if (string.search('m')) {
    number = +string.match(/\d+/)[0]
  }
  return number
}
export const getNumberFromStringV2 = (string) => {
  let number = 0

  if (string.search('đồng/tháng') !== -1) {
    number = +string.match(/\d+/)[0] / Math.pow(10, 3)
  } else if (string.search('triệu/tháng') !== -1) {
    number = +string.split(' ')[0]
  } else if (string.search('m')) {
    number = +string.match(/\d+/)[0]
  }
  return +number
}

export const getMoneyFromStringV3 = (string) => {
  let number = 0
  if (string.search('đồng/tháng') !== -1) {
    number = +string.match(/\d+/)[0] / Math.pow(10, 3)
    number = number * 100000
  } else if (string.search('triệu/tháng') !== -1) {
    number = +string.split(' ')[0]
    number = number * 1000000
  }
  //   } else if (string.search('m')) {
  //     number = +string.match(/\d+/)[0]
  //   }

  return +number
}

export const slugToString = (title) => {
  let string = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .split(' ')
    .join('-')

  let slug = string.split('/').join('-')

  return slug
}
