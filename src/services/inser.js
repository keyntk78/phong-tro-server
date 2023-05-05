import db from '../models'
import bcrypt from 'bcrypt'
import { v4 } from 'uuid'
require('dotenv').config()
import chothucanho from '../../data/chothuecanho.json'
import chothuematbang from '../../data/chothuematbang.json'
import chothuephongtro from '../../data/chothuephongtro.json'
import nhachothue from '../../data/nhachothue.json'

import { dataPrice, dataArea } from '../ultis/data'
import generateCode from '../ultis/generateCode'
import { slugToString, getMoneyFromStringV3, getNumberFromStringV2 } from '../ultis/common'

// const databody = chothucanho.body
const dataBody = [
  {
    body: chothuephongtro.body,
    code: 'CTPT'
  },
  {
    body: chothuematbang.body,
    code: 'CTMB'
  },
  {
    body: chothucanho.body,
    code: 'CTCH'
  },
  {
    body: nhachothue.body,
    code: 'NCT'
  }
]
const hashPassword = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(12))

export const insertService = () =>
  new Promise(async (resolve, reject) => {
    let hashtag = 1000
    try {
      const provinceCodes = []
      const labelCodes = []
      dataBody.map((data) => {
        data.body.forEach(async (item) => {
          let postId = v4()
          let attributesId = v4()
          let labelCode = generateCode(item?.header?.class?.classType).trim()
          labelCodes?.every((item) => item?.code !== labelCode) &&
            labelCodes.push({
              code: labelCode,
              value: item?.header?.class?.classType?.trim(),
              slug: slugToString(item?.header?.class?.classType?.trim())
            })
          let provinceCode = generateCode(item?.header?.address?.split(',')?.slice(-1)[0]).trim()
          provinceCodes?.every((item) => item?.code !== provinceCode) &&
            provinceCodes.push({
              code: provinceCode,
              value: item?.header?.address?.split(',')?.slice(-1)[0].trim()
            })
          let userId = v4()
          let overviewId = v4()
          let imagesId = v4()
          let date = new Date()
          let price = getMoneyFromStringV3(item?.header?.attributes?.price)
          let slugPost = slugToString(item?.header?.title)
          let codeHastag = hashtag++
          let currentArea = getNumberFromStringV2(item?.header?.attributes?.acreage)

          let priceCode = dataPrice.find((area) => area.max > price && area.min <= price)?.code
          let areaCode = dataArea.find((area) => area.max > currentArea && area.min <= currentArea)?.code

          await db.Post.create({
            id: postId,
            title: item?.header?.title,
            star: item?.header?.star,
            labelCode: labelCode,
            address: item?.header?.address,
            attributesId: attributesId,
            categoryCode: data.code,
            description: JSON.stringify(item?.mainContent.content),
            userId: userId,
            overviewId: overviewId,
            imagesId: imagesId,
            slug: slugPost,
            provinceCode,
            areaCode: areaCode,
            priceCode: priceCode
          })

          await db.Attribute.create({
            id: attributesId,
            areaNumber: currentArea,
            priceNumber: price,
            published: date,
            hashtag: codeHastag
          })

          await db.Image.create({
            id: imagesId,
            image: JSON.stringify(item?.images)
          })

          await db.Overview.create({
            id: overviewId,
            code: codeHastag,
            area: item?.overview.content.find((i) => i.name === 'Khu vực')?.content,
            type: item?.overview.content.find((i) => i.name === 'Loại tin rao:')?.content,
            target: item?.overview.content.find((i) => i.name === 'Đối tượng thuê:')?.content,
            created: date,
            expired: date,
            bonus: item?.overview.content.find((i) => i.name === 'Gói tin:')?.content
          })

          await db.User.create({
            id: userId,
            name: item?.contact.content.find((i) => i.name === 'Liên hệ:')?.content,
            password: hashPassword('123456'),
            phone: item?.contact.content.find((i) => i.name === 'Điện thoại:')?.content,
            zalo: item?.contact.content.find((i) => i.name === 'Zalo')?.content
          })
        })
      })

      // console.log(provinceCodes);
      provinceCodes?.forEach(async (item) => {
        await db.Province.create(item)
      })
      labelCodes?.forEach(async (item) => {
        await db.Label.create(item)
      })

      resolve('Done')
    } catch (error) {
      reject(error)
    }
  })

export const createPricesAndAreas = () =>
  new Promise((resolve, reject) => {
    try {
      dataPrice.forEach(async (item, index) => {
        await db.Price.create({
          code: item.code,
          value: item.value,
          order: index + 1
        })
      })
      dataArea.forEach(async (item, index) => {
        await db.Area.create({
          code: item.code,
          value: item.value,
          order: index + 1
        })
      })
      resolve('OK')
    } catch (err) {
      reject(err)
    }
  })
