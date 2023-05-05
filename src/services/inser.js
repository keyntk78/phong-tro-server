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

const categories = [
  {
    code: 'CTCH',
    value: 'Cho thuê căn hộ',
    header: 'Cho Thuê Căn Hộ Chung Cư, Giá Rẻ, Mới Nhất 2023',
    subheader:
      'Cho thuê căn hộ - Kênh đăng tin cho thuê căn hộ số 1: giá rẻ, chính chủ, đầy đủ tiện nghi. Cho thuê chung cư với nhiều mức giá, diện tích cho thuê khác nhau.',
    slug: 'cho-thue-can-ho'
  },
  {
    code: 'CTMB',
    value: 'Cho thuê mặt bằng',
    header: 'Cho Thuê Mặt Bằng, Cửa Hàng + Kiot Giá Rẻ, Mới Nhất 2023',
    subheader:
      'Cho thuê mặt bằng - Kênh thông tin mặt bằng giá rẻ, cửa hàng, kiot số 1 Việt Nam. Tìm mặt bằng kinh doanh, buôn bán nhỏ, gần chợ tất cả có tại web phongtro123.com',
    slug: 'cho-thue-mat-bang'
  },
  {
    code: 'CTPT',
    value: 'Cho thuê phòng trọ',
    header: 'Cho thuê phòng trọ, Giá Rẻ, Mới Nhất 2023',
    subheader:
      'Cho thuê phòng trọ - Kênh thông tin số 1 về phòng trọ giá rẻ, phòng trọ sinh viên, phòng trọ cao cấp mới nhất năm 2023. Tất cả nhà trọ cho thuê giá tốt nhất tại Việt Nam.',
    slug: 'cho-thue-phong-tro'
  },
  {
    code: 'NCT',
    value: 'Cho thuê nhà nguyên căn',
    header: 'Cho Thuê Nhà Nguyên Căn, Giá Rẻ, Chính Chủ, Mới Nhất 2023',
    subheader:
      'Cho thuê nhà nguyên căn - Kênh đăng tin cho thuê nhà số 1: giá rẻ, chính chủ, miễn trung gian, đầy đủ tiện nghi, mức giá, diện tích cho thuê khác nhau.',
    slug: 'cho-thue-nha-nguyen-can'
  }
]

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

      await db.Category.bulkCreate(categories)

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
            description:
              'Căn hộ biển cao cấp New Galaxy Nha Trang. Với thời điểm hiện tại, để tìm một căn hộ biển, pháp lý chuẩn - rõ ràng, giá tốt hơn thị trường, có ngân hàng cho vay, sổ đỏ sở hữu lâu dài, tiến độ thanh toán nhẹ nhàng, tiềm năng tăng giá cao, chủ đầu tư uy tín hàng đầu Việt Nam là một điều không hề dễ.',
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
