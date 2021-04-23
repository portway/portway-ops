// Webhooks weren't getting soft deleted when projects were deleted, this will go through and add the deletedAt timestamp
// to webhooks referencing a soft deleted project

module.exports = async (db) => {

  const findWebhooksWhereProjectHasDeletedAt = `SELECT w.id, p."deletedAt" FROM "Webhooks" w LEFT JOIN "Projects" p ON w."projectId" = p.id WHERE p."deletedAt" IS NOT NULL AND w."deletedAt" IS NULL`

  const result = await db.query(findWebhooksWhereProjectHasDeletedAt)
  const count = result.rows.length

  for (const row of result.rows) {
    const setWebhookDeletedAt = `UPDATE "Webhooks" SET "deletedAt" = $1 WHERE id = ${row.id}`
    await db.query(setWebhookDeletedAt, [row.deletedAt])
  }

  return `Successfully updated ${count} webhooks with a deletedAt date`
}