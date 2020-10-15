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

async function fetchWebhookDeliveries(page) {
  const webhookDeliveryUrl = `${envVars.API_URL}/admin/webhookdeliveries`

  return axios.get(`${webhookDeliveryUrl}?page=${page}`, { headers })
}

async function deleteWebhookDeliveries(deliveries) {
  const deliveryDeleteUrl = `${envVars.API_URL}/admin/webhookdeliveries`

  for (const delivery of deliveries) {
    await axios.delete(`${deliveryDeleteUrl}/${delivery.id}`, { headers })
  }
}

async function run() {
  let page = 1
  let deleteCount = 0
  let hasNextPage = true

  do {
    let result

    try {
      const response = await fetchWebhookDeliveries(page)
      result = response.data

      page += 1

      if (result.page >= result.totalPages) {
        hasNextPage = false
      }
      await deleteWebhookDeliveries(result.data)
      deleteCount += result.data.length

    } catch(e) {
      console.error(e)
      break
    }

  } while (hasNextPage)

  console.log(`Removed ${deleteCount} webhook delivery records`)
}

run()