module.exports = async (db) => {

  const findDocumentsWhereProjectHasDeletedAt = `SELECT d.id, d.name, p."deletedAt" FROM "Documents" d LEFT JOIN "Projects" p ON d."projectId" = p.id WHERE p."deletedAt" IS NOT NULL AND d."deletedAt" IS NULL`

  const result = await db.query(findDocumentsWhereProjectHasDeletedAt)
  const count = result.rows.length

  for (const row of result.rows) {
    const setDocumentDeletedAt = `UPDATE "Documents" SET "deletedAt" = $1 WHERE id = ${row.id}`
    await db.query(setDocumentDeletedAt, [row.deletedAt])
  }

  return `Successfully updated ${count} documents with a deletedAt date`
}