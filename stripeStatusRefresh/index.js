/**
 * This script will update Portway organizations with the most recent org status from Stripe
 */

const axios = require('axios')
// const Promise = require('bluebird')
const async = require('async')

const envVarNames = [
  'ADMIN_API_KEY',
  'API_URL'
]

const envVars = envVarNames.reduce((vars, envVar) => {
  const val = process.env[envVar]
  if (!val) {
    throw new Error(`Must provide ${envVar} env var`)
  }
  vars[envVar] = val
  return vars
}, {})

const headers = {
  "Authorization": `Admin ${envVars.ADMIN_API_KEY}`
}

async function fetchOrgs(page) {
  const url = `${envVars.API_URL}/admin/organizations`;

  const { data: { data: orgs } } = await axios.get(url, { headers })

  return orgs
}

async function updateOrg(org) {
  const adminOrgUrl = `${envVars.API_URL}/admin/organizations`

  return axios.post(`${adminOrgUrl}/${org.id}/updateBillingStatus`, {}, { headers })
}

async function run() {
  // How many orgs to process at once
  const parallelProcessNum = 10

  const orgs = await fetchOrgs(0)

  const numOrgs = orgs.length
  const iterations = Math.ceil(numOrgs / parallelProcessNum)

  const batchOrgs = []

  // Break orgs into an array of arrays to aid limited parallel processing and avoid
  // stripe rate limit party fouls.
  for (var i = 0; i < iterations; i++) {
    const startI = i * parallelProcessNum
    batchOrgs.push(orgs.slice(startI, startI + parallelProcessNum))
  }

  // Make sure failed promises don't interrupt flow. Similar to bluebird allSettled
  const reflectOrgUpdate = async.reflect(updateOrg)

  const results = await async.reduce(
    batchOrgs,
    { successCount: 0, errorCount: 0 },
    (memo, orgs, cb) => {
      async.map(orgs, reflectOrgUpdate)
        .then((results) => {
          results.forEach((result) => {
            if (result.value) {
              memo.successCount += 1
            } else {
              memo.errorCount += 1
            }
          })
          // Wait 2 seconds between each batch to avoid Stripe rate limits
          setTimeout(() => {
            cb(null, memo)
          }, 2000)
        })
    }
  )

  console.log(`Organizations updated: ${results.successCount}, \n There were ${results.errorCount} failures`)
  process.exit(0)
}

run()