const AWS = require('aws-sdk')

const { S3_CONTENT_BUCKET, AWS_SES_REGION } = process.env

AWS.config.update({ region: AWS_SES_REGION })
const s3 = new AWS.S3({ apiVersion: '2006-03-01' })

const uploadBuffer = async function (buffer, key, contentType) {

  const params = {
    Bucket: S3_CONTENT_BUCKET,
    Key: key,
    ContentType: contentType,
    Body: buffer,
    ACL: 'public-read'
  }

  return s3.upload(params).promise()
}

module.exports = {
  uploadBuffer
}