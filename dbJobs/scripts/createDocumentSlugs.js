
// Function blatantly copied from API :shrug:
function slugify(string) {
  if (typeof string !== 'string') {
    throw new Error('Slugify requires type string, got ' + typeof string)
  }

  // Code from https://gist.github.com/hagemann/382adfc57adbd5af078dc93feef01fe1
  const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;'
  const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------'
  const p = new RegExp(a.split('').join('|'), 'g')

  return string.toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, '') // Trim - from end of text
}

module.exports = async (db) => {
  const result = await db.query(`SELECT name, id FROM "Documents" WHERE "slug" IS NULL`)

  for(const row of result.rows) {
    const slug = slugify(row.name)
    const query = `UPDATE "Documents" SET slug = '${slug}' WHERE id = '${row.id}';`
    console.log(query)
    await db.query(query)
  }

  const versionResults = await db.query(`SELECT name, id FROM "DocumentVersions" WHERE "slug" IS NULL`)

  for (const row of versionResults.rows) {
    const slug = slugify(row.name)
    const query = `UPDATE "DocumentVersions" SET slug = '${slug}' WHERE id = '${row.id}';`
    console.log(query)
    await db.query(query)
  }

  return `Successfully updated ${result.rows.length} documents and ${versionResults.rows.length} documentVersions` //result.rows
}