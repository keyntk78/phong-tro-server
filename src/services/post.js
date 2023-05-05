import db from '../models'
import { v4 } from 'uuid'
import generateCode from '../ultis/generateCode'
import { slugToString, getMoneyFromStringV3, getNumberFromStringV2 } from '../ultis/common'
const { Op, where } = require('sequelize')

const getPostsService = () =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Post.findAll({
        raw: true,
        nest: true,
        include: [
          { model: db.Image, as: 'images', attributes: ['image'] },
          { model: db.Attribute, as: 'attribute', attributes: ['priceNumber', 'areaNumber', 'published', 'hashtag'] },
          { model: db.User, as: 'user', attributes: ['name', 'zalo', 'phone', 'avatar'] }
        ],
        attributes: ['id', 'title', 'star', 'address', 'description', 'slug']
      })

      resolve({
        err: resolve ? 0 : 1,
        msg: resolve ? 'OK' : 'Gotting post is failed',
        response
      })
    } catch (error) {
      reject(error)
    }
  })

const getPostsPaginationService = (page, query, { priceNumber, areaNumber }) =>
  new Promise(async (resolve, reject) => {
    try {
      let offset = !page || +page <= 1 ? 0 : +page - 1

      const queries = {}

      if (priceNumber) queries.priceNumber = { [Op.between]: priceNumber }
      if (areaNumber) queries.areaNumber = { [Op.between]: areaNumber }

      const response = await db.Post.findAndCountAll({
        where: {
          ...query
        },
        raw: true,
        nest: true,
        offset: offset * +process.env.LIMIT || 0,
        limit: +process.env.LIMIT,
        include: [
          { model: db.Image, as: 'images', attributes: ['image'] },
          {
            model: db.Attribute,
            as: 'attribute',
            attributes: ['priceNumber', 'areaNumber', 'published', 'hashtag'],
            where: queries
          },
          { model: db.User, as: 'user', attributes: ['name', 'zalo', 'phone', 'avatar'] }
        ],
        order: [['updatedAt', 'DESC']],

        attributes: ['id', 'title', 'star', 'address', 'description', 'slug']
      })

      resolve({
        err: resolve ? 0 : 1,
        msg: resolve ? 'OK' : 'Gotting post is failed',
        response
      })
    } catch (error) {
      reject(error)
    }
  })

const getNewPostsService = () =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Post.findAll({
        raw: true,
        nest: true,
        order: [['createdAt', 'DESC']],
        limit: +process.env.LIMIT,
        include: [
          { model: db.Image, as: 'images', attributes: ['image'] },

          { model: db.Attribute, as: 'attribute', attributes: ['priceNumber', 'areaNumber', 'published', 'hashtag'] },
          { model: db.User, as: 'user', attributes: ['name', 'zalo', 'phone', 'avatar'] }
        ],
        attributes: ['id', 'title', 'star', 'address', 'description', 'slug', 'createdAt']
      })

      resolve({
        err: resolve ? 0 : 1,
        msg: resolve ? 'OK' : 'Gotting post is failed',
        response
      })
    } catch (error) {
      reject(error)
    }
  })

const createNewPostService = (body, userId) =>
  new Promise(async (resolve, reject) => {
    try {
      let attributesId = v4()
      let overviewId = v4()
      let imagesId = v4()
      let postId = v4()

      let labelCode = ''
      let slugPost = slugToString(body.title)
      let date = new Date()
      let codeHastag = `#${Math.floor(Math.random() * Math.pow(10, 6))}`
      let provinceCode = ''

      let province = await db.Province.findOne({
        raw: true,
        where: {
          [Op.or]: [
            { value: body?.province?.replace('Thành phố ', '') },
            { value: body?.province?.replace('Tỉnh ', '') }
          ]
        }
      })

      let label = await db.Label.findOne({
        raw: true,
        where: {
          value: body?.label
        }
      })

      let category = await db.Category.findOne({
        raw: true,
        where: {
          code: body?.categoryCode
        }
      })

      if (province) {
        provinceCode = province?.code
      } else {
        provinceCode = body?.province.includes('Thành phố')
          ? generateCode(body?.province?.replace('Thành phố ', ''))
          : generateCode(body?.province?.replace('Tỉnh ', ''))
        await db.Province.create({
          code: provinceCode,
          value: body?.province.includes('Thành phố')
            ? body?.province?.replace('Thành phố ', '')
            : body?.province?.replace('Tỉnh ', '')
        })
      }

      if (label) {
        labelCode = label?.code
      } else {
        labelCode = generateCode(body.label)
        await db.Label.create({
          code: labelCode,
          value: body?.label,
          slug: slugToString(body?.label)
        })
      }

      await db.Post.create({
        id: postId,
        title: body.title,
        labelCode: labelCode,
        address: body.address || null,
        attributesId: attributesId,
        categoryCode: body.categoryCode,
        description: body.description || null,
        userId: userId,
        overviewId: overviewId,
        imagesId: imagesId,
        slug: slugPost,
        provinceCode: provinceCode,
        areaCode: body.areaCode,
        priceCode: body.priceCode
      })

      await db.Attribute.create({
        id: attributesId,
        areaNumber: +body.areaNumber,
        priceNumber: +body.priceNumber,
        published: date,
        hashtag: codeHastag
      })

      await db.Image.create({
        id: imagesId,
        image: JSON.stringify(body.images)
      })

      await db.Overview.create({
        id: overviewId,
        code: codeHastag,
        area: body?.areaOverview,
        type: category.value,
        target: body.target,
        created: date,
        expired: date,
        bonus: 'Tin thường'
      })
      resolve({
        err: 0,
        msg: 'OK'
      })
    } catch (error) {
      reject(error)
    }
  })

const getPostsPaginationAdminService = (page, query, userId) =>
  new Promise(async (resolve, reject) => {
    try {
      let offset = !page || +page <= 1 ? 0 : +page - 1

      const response = await db.Post.findAndCountAll({
        where: {
          ...query,
          userId: userId
        },
        raw: true,
        nest: true,
        offset: offset * +process.env.LIMIT || 0,
        limit: +process.env.LIMIT,
        include: [
          { model: db.Image, as: 'images', attributes: ['image'] },
          {
            model: db.Attribute,
            as: 'attribute'
          },
          {
            model: db.Overview,
            as: 'overview'
          },
          { model: db.User, as: 'user', attributes: ['name', 'zalo', 'phone', 'avatar'] }
        ]
      })

      resolve({
        err: resolve ? 0 : 1,
        msg: resolve ? 'OK' : 'Gotting post is failed',
        response
      })
    } catch (error) {
      reject(error)
    }
  })

const updatePostService = ({ postId, attributeId, imageId, overviewId, ...body }) =>
  new Promise(async (resolve, reject) => {
    try {
      let slugPost = slugToString(body.title)

      let labelCode = ''
      let label = await db.Label.findOne({
        raw: true,
        where: {
          value: body?.label
        }
      })
      if (label) {
        labelCode = label?.code
      } else {
        labelCode = generateCode(body.label)

        await db.Label.create({
          code: labelCode,
          value: body?.label,
          slug: slugToString(body?.label)
        })
      }

      let provinceCode = ''
      let province = await db.Province.findOne({
        raw: true,
        where: {
          [Op.or]: [
            { value: body?.province?.replace('Thành phố ', '') },
            { value: body?.province?.replace('Tỉnh ', '') }
          ]
        }
      })

      if (province) {
        provinceCode = province?.code
      } else {
        provinceCode = body?.province.includes('Thành phố')
          ? generateCode(body?.province?.replace('Thành phố ', ''))
          : generateCode(body?.province?.replace('Tỉnh ', ''))
        await db.Province.create({
          code: provinceCode,
          value: body?.province.includes('Thành phố')
            ? body?.province?.replace('Thành phố ', '')
            : body?.province?.replace('Tỉnh ', '')
        })
      }

      await db.Post.update(
        {
          title: body.title,
          labelCode: labelCode,
          address: body.address || null,
          categoryCode: body.categoryCode,
          description: body.description || null,
          slug: slugPost,
          provinceCode: provinceCode,
          areaCode: body.areaCode,
          priceCode: body.priceCode
        },
        {
          where: {
            id: postId
          }
        }
      )

      await db.Attribute.update(
        {
          areaNumber: +body.areaNumber,
          priceNumber: +body.priceNumber
        },
        {
          where: {
            id: attributeId
          }
        }
      )

      await db.Image.update(
        {
          image: JSON.stringify(body.images)
        },
        {
          where: {
            id: imageId
          }
        }
      )

      let category = await db.Category.findOne({
        raw: true,
        where: {
          code: body?.categoryCode
        }
      })
      await db.Overview.update(
        {
          area: body?.areaOverview,
          type: category.value,
          target: body?.target
        },
        {
          where: {
            id: overviewId
          }
        }
      )
      resolve({
        err: 0,
        msg: 'Updated'
      })
    } catch (error) {
      reject(error)
    }
  })

const deletePostService = (postId, attributeId, imageId, overviewId) =>
  new Promise(async (resolve, reject) => {
    try {
      await db.Overview.destroy({ where: { id: overviewId } })
      await db.Attribute.destroy({ where: { id: attributeId } })
      await db.Image.destroy({ where: { id: imageId } })
      await db.Post.destroy({ where: { id: postId } })

      resolve({
        err: 0,
        msg: 'Deleted'
      })
    } catch (error) {
      reject(error)
    }
  })

const getPostByIdService = (id) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Post.findAll({
        where: {
          id: id
        },
        raw: true,
        nest: true,
        include: [
          { model: db.Image, as: 'images', attributes: ['image'] },
          {
            model: db.Attribute,
            as: 'attribute'
          },
          {
            model: db.Category,
            as: 'category'
          },
          {
            model: db.Province,
            as: 'province'
          },
          {
            model: db.Overview,
            as: 'overview'
          },
          { model: db.User, as: 'user', attributes: ['name', 'zalo', 'phone', 'avatar'] }
        ]
      })

      resolve({
        err: resolve ? 0 : 1,
        msg: resolve ? 'OK' : 'Getting post is failed',
        response
      })
    } catch (error) {
      reject(error)
    }
  })
export default {
  updatePostService,
  getPostsService,
  getPostsPaginationService,
  getNewPostsService,
  createNewPostService,
  getPostsPaginationAdminService,
  deletePostService,
  getPostByIdService
}
