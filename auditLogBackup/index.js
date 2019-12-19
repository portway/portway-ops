/**
 * This script will download a log file from rapid7 insightOps
 * and upload it to S3
 */

const fs = require('fs')
const util = require('util')
const AWS = require('aws-sdk')
const axios = require('axios')

const readFile = util.promisify(fs.readFile)
const unlink = util.promisify(fs.unlink)

const envVarNames = [
  'S3_CONTENT_BUCKET',
  'AWS_SES_REGION',
  'API_KEY',
  'LOG_ID'
]

const envVars = envVarNames.reduce((vars, envVar) => {
  const val = process.env[envVar]
  if (!val) {
    throw new Error(`Must provide ${envVar} env var`)
  }
  vars[envVar] = val
  return vars
}, {})

AWS.config.update({ region: envVars.AWS_SES_REGION })
const s3 = new AWS.S3({ apiVersion: '2006-03-01' })

// Get UTC milliseconds for the previous day's 24 hours
// Returns "from" as 1 ms after the previous midnight, and
// "to" as the current day's midnight
function calculateStartAndEnd() {
  const twentyFourHoursMinusOneMs = (1000*60*60*24)
  const date = new Date()
  date.setUTCHours(0)
  date.setUTCMinutes(0)
  date.setUTCSeconds(0)
  date.setUTCMilliseconds(0)

  const to = date.getTime()
  const from = to - twentyFourHoursMinusOneMs

  return { from, to }
}

async function downloadlogs(from, to, filePath) {
  const url = `https://us.rest.logs.insight.rapid7.com/download/logs/${envVars.LOG_ID}?from=${from}&to=${to}`;

  const headers = {
    "x-api-key": envVars.API_KEY
  };

  const response = await axios.get(url, { headers, responseType: 'stream' })

  const fileWriter = fs.createWriteStream(filePath)
  response.data.pipe(fileWriter)

  return new Promise((resolve, reject) => {
    fileWriter.on("finish", resolve);
    fileWriter.on("error", reject);
  })
}

async function uploadToS3(filePath, destinationPath) {
  try {
    await s3
      .upload({
        Bucket: envVars.S3_CONTENT_BUCKET,
        Key: `audit/logs/${destinationPath}`,
        ContentType: 'text/plain',
        Body: await readFile(filePath)
      })
      .promise()
  } catch(e) {
    throw(e)
  } finally {
    unlink(filePath)
  }
}

async function run() {
  const filePath = 'output/temp.txt'
  const { from, to } = calculateStartAndEnd()

  await downloadlogs(from, to, filePath)

  const date = new Date(from)
  const destinationPath = `${date.getUTCFullYear()}/${date.getUTCMonth()+1}/${date.getUTCDate()}.txt`

  await uploadToS3(filePath, destinationPath)
  
  console.log('successfully uploaded file to ' + destinationPath)
  process.exit(0)
}

run()