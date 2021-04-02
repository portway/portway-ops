// this is a hybrid script that uses both direct db access and an admin route

const sharp = require('sharp')
const axios = require('axios')
const { uploadBuffer } = require('../integrators/s3')
const path = require('path')
const { lookup } = require('mime-types')
const fs = require('fs')
const moment = require('moment')
const promisifyStreamPipe = require('../utils/promisifyStreamPipe')

const { API_URL, ADMIN_SECRET_KEY } = process.env

module.exports = async (db) => {

  const findNonDeletedImageFieldsWithoutOptimization = `SELECT f.name, f.id, f."documentId", f."orgId", v.value FROM "Fields" f LEFT JOIN "FieldTypeImageValues" v ON v."fieldId" = f.id WHERE "formats" IS NULL AND "type" = '4' AND f."deletedAt" IS NULL`

  const result = await db.query(findNonDeletedImageFieldsWithoutOptimization)
  let successCount = 0
  let failCount = 0

  for (const row of result.rows) {
    try {
      await createImageAlternatives(row.value, row.documentId, row.id, row.orgId)
      successCount++
    } catch (err) {
      console.log(`error processing image for field ${JSON.stringify(row)}`)
      failCount++
    }
  }

  return `Successfully updated ${successCount} fields with no format information, failed for ${failCount} fields`
}

sharp.cache(false)
sharp.concurrency(0)

const IMAGE_TEMP_DIRECTORY = process.env.IMAGE_TEMP_DIRECTORY || './image_temp/'

const createImageAlternatives = async function (url, documentId, fieldId, orgId) {
  const s3Location = url.split('/').slice(3, -1).join('/')
  const extension = path.extname(url)
  const basename = path.basename(url, extension)
  const basekey = path.join(s3Location, basename, basename)
  const originalMimetype = lookup(url)

  // download file and save to disk
  const d = moment().format('YYYY-MM-DD_ss')
  const uniqueId = `${basename}_${d}_${fieldId}`
  const filePath = path.resolve(IMAGE_TEMP_DIRECTORY, `${uniqueId}${extension}`)

  const resp = await axios({ url, responseType: 'stream', method: 'get' })
  const writeStream = fs.createWriteStream(filePath)

  await promisifyStreamPipe(resp.data, writeStream)
  let image = sharp(filePath)
  const metadata = await image.metadata()
  // force gc
  image = null

  // originalHalf
  let originalHalf = await sharp(filePath)
    .resize(Math.round(metadata.width / 2))
    .toBuffer()

  const originalHalfResult = await uploadBuffer(originalHalf, `${basekey}-original-half${extension}`, originalMimetype)
  originalHalf = null

  // webPFull
  let webPFull = await sharp(filePath)
    .toFormat('webp')
    .toBuffer()

  const webPFullResult = await uploadBuffer(webPFull, `${basekey}-full.webp`, 'image/webp')
  // force garbage collection
  webPFull = null

  // webPHalf
  let webPHalf = await sharp(filePath)
    .resize(Math.round(metadata.width / 2))
    .toFormat('webp')
    .toBuffer()

  const webPHalfResult = await uploadBuffer(webPHalf, `${basekey}-half.webp`, 'image/webp')
  // force garbage collection
  webPHalf = null

  try {
    fs.promises.unlink(filePath)
  } catch (err) {
    // log but don't throw
    logger(LOG_LEVELS.ERROR, `error deleting temp file for job ${job.id} in queue ${QUEUES.IMAGE_PROCESSING}, filename: ${filePath}`)
  }

  const formatData = {
    original: {
      full: url,
      half: originalHalfResult.Location
    },
    webp: {
      full: webPFullResult.Location,
      half: webPHalfResult.Location
    }
  }

  return updateFieldFormats(documentId, fieldId, orgId, formatData)
}

const updateFieldFormats = async function (documentId, fieldId, orgId, formats) {
  let data
  const url = (new URL(`admin/organizations/${orgId}/documents/${documentId}/fields/${fieldId}/formats`, API_URL)).href

  try {
    data = (await axios.put(url,
      formats,
      {
        headers: {
          Authorization: `Admin ${ADMIN_SECRET_KEY}`
        }
      })).data
  } catch (err) {
    const customError = new Error()
    if (err.response) {
      // non-2xx response condition
      customError.message = err.response.data
      customError.statusCode = err.response.status
    } else if (err.request) {
      // no response
      customError.message = 'no response received from api'
      customError.statusCode = 504
    } else {
      // configuration error
      customError.message = err.message
      customError.statusCode = 500
    }
    throw customError
  }

  return data
}