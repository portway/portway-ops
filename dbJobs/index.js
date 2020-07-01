const db = require('./dbConnector')
// Define available scripts here.
// Script must be defined in ./scripts/[value].js
// key is the accepted argument for this script
const scripts = {
  documentSlugs: 'createDocumentSlugs'
}
const validScriptNames = Object.keys(scripts)

async function run() {
  const scriptName = process.argv[2]

  if (!validScriptNames.includes(scriptName)) {
    throw new Error(`${scriptName} is not a valid script, must be one of ${validScriptNames.join(', ')}`)
  }

  const scriptFilePath = `./${scripts[scriptName]}`
  const scriptFunc = require(scriptFilePath)

  try {
    const results = await scriptFunc(db)
    console.log(results)
    console.log('script executed successfully!')
    process.exit()
  } catch(e) {
    throw e
    process.exit(1)
  }
}

run()


