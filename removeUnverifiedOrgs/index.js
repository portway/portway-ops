const axios = require('axios')

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
  Authorization: `Admin ${envVars.ADMIN_API_KEY}`
}

async function deleteUnverifiedOrgs() {
  const deleteOrgUrl = `${envVars.API_URL}/admin/unverifiedOrgs`
  const res = await axios.delete(deleteOrgUrl, { headers })
  return res.data.data
}

async function run() {
  const result = await deleteUnverifiedOrgs()
  console.log(`Removed ${result.removedOrgsCount} unverified orgs`)
}

run()