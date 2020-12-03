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

async function deleteResources() {
  const deleteOrgUrl = `${envVars.API_URL}/admin/softdeletedresources`
  const res = await axios.delete(deleteOrgUrl, { headers })
  return
}

async function run() {
  await deleteResources()
  console.log(`Successfully deleted softDeleted resources`)
}

run()