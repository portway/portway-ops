module.exports = async (db) => {

  // Need to find two kinds of records:
  // 1) records that have a null/invalid fkey
  // 2) records with a soft-deleted parent

  // Start with fields

  /*
  SELECT t1.ID
FROM Table1 t1
    LEFT JOIN Table2 t2 ON t1.ID = t2.ID
WHERE t2.ID IS NULL
*/

  const query = `SELECT f.id, f."deletedAt" FROM "Fields" f LEFT JOIN "Documents" d ON f."documentId" = d.id WHERE d."deletedAt" IS NOT NULL`
  const q2 = 'SELECT * FROM "Fields"'

  const result = await db.query(query)
  console.log(result.rows)

  // const fieldsWithDeletedDocCount = result.rows[0].count
  // console.log(`Found ${fieldsWithDeletedDocCount} fields with a deleted document`)

  // for (const row of result.rows) {
  //   const slug = slugify(row.name)
  //   const query = `UPDATE "Documents" SET slug = '${slug}' WHERE id = '${row.id}';`
  //   await db.query(query)
  // }

  // const versionResults = await db.query(`SELECT name, id FROM "DocumentVersions" WHERE "slug" IS NULL`)

  // for (const row of versionResults.rows) {
  //   const slug = slugify(row.name)
  //   const query = `UPDATE "DocumentVersions" SET slug = '${slug}' WHERE id = '${row.id}';`
  //   await db.query(query)
  // }

  // return `Successfully updated ${result.rows.length} documents and ${versionResults.rows.length} documentVersions`
}