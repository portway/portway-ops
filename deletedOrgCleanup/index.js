/**
 * This script will fetch portway organizations and trigger database and asset deletion if time since deletion is sufficient
 */

const axios = require('axios')
const Promise = require('bluebird')
const DAYS_AGO_FOR_DELETION = 30

const envVarNames = [
  'ADMIN_API_KEY',
  'API_URL',
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

// Get UTC milliseconds for 30 days ago
function calculate30DaysAgo() {
  const thirtyDays = (1000*60*60*24*DAYS_AGO_FOR_DELETION)
  const date = new Date()
  const now = date.getTime()
  const thirtyDaysAgo = now - thirtyDays

  return thirtyDaysAgo
}

async function fetchCanceledOrgs(thirtyDaysAgo) {
  const url = `${envVars.API_URL}/admin/organizations/canceled`;

  const headers = {
    "Authorization": `Admin ${envVars.ADMIN_API_KEY}`
  }

  const { data: { data: canceledOrgs } } = await axios.get(url, { headers })

  return canceledOrgs
}

async function deleteOrgs(orgs) {
  const adminOrgUrl = `${envVars.API_URL}/admin/organizations`

  const headers = {
    Authorization: `Admin ${envVars.ADMIN_API_KEY}`
  }

  return Promise.allSettled(orgs.map((org) => {
    return axios.delete(`${adminOrgUrl}/${org.id}`, { headers })
    .then((result) => {
      console.log(`Successfully deleted organization with id ${org.id}`)
    })
    .catch((err) => {
      console.log(`Error deleting organization with id ${org.id} `)
      throw(err)
    })
  }))

}

async function run() {
  const thirtyDaysAgoTimestamp = calculate30DaysAgo()

  const canceledOrgs = await fetchCanceledOrgs()

  const orgsForDeletion = canceledOrgs.filter((org) => {
    console.log(Date.parse(org.canceledAt))
    console.log(thirtyDaysAgoTimestamp)
    return Date.parse(org.canceledAt) < thirtyDaysAgoTimestamp
  })

  const results = await deleteOrgs(orgsForDeletion)

  let successCount = 0
  let failCount = 0

  results.forEach((result) => {
    if (result.isFulfilled()) {
      successCount++
    } else {
      failCount++
    }
  }, {})
  
  console.log(`Organization Deletion: Successfully deleted ${successCount} organizations, \n There were ${failCount} failures`)
  process.exit(0)
}

run()