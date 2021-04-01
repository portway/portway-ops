// this is a hybrid script that uses both direct db access and an admin route

module.exports = async (db) => {

  const findNonDeletedImageFieldsWithoutOptimization = `SELECT f.name, f.id, v.value FROM "Fields" f LEFT JOIN "FieldTypeImageValues" v ON v."fieldId" = f.id WHERE "formats" IS NULL AND "type" = '4' AND f."deletedAt" IS NULL`

  const result = await db.query(findNonDeletedImageFieldsWithoutOptimization)
  const count = result.rows.length

  for (const row of result.rows) {
    console.log(row)
  }

  return `Successfully updated ${count} fields with no format information`
}

`SELECT d.id, d.name, p."deletedAt" FROM "Documents" d LEFT JOIN "Projects" p ON d."projectId" = p.id WHERE p."deletedAt" IS NOT NULL AND d."deletedAt" IS NULL`