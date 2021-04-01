const db = require('./dbConnector')
// Define available scripts here.
// Script must be defined in ./scripts/[value].js
// key is the accepted argument for this script
const scripts = {
  documentSlugs: 'createDocumentSlugs',
  setDeletedRecords: 'setDeletedRecords',
  imageOptimization: 'imageOptimization'
}
const validScriptNames = Object.keys(scripts)

console.log('loaded index.js')

async function run() {
  const scriptName = process.argv[2]

  if (!validScriptNames.includes(scriptName)) {
    throw new Error(`${scriptName} is not a valid script, must be one of: ${validScriptNames.join(', ')}`)
  }

  const scriptFilePath = `./scripts/${scripts[scriptName]}`
  console.log('requiring ' + scriptFilePath)

  const scriptFunc = require(scriptFilePath)

  try {
    const results = await scriptFunc(db)
    console.log(results)
    console.log('script executed successfully!')
    process.exit()
  } catch(e) {
    throw e
  }
}

run()


