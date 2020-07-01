module.exports = (db) => {
  const result = await db.query(`SELECT name FROM "Documents" WHERE "slug" IS NULL`)

  result.rows.forEach(row => {
    console.log(row)
    "UPDATE films SET kind = 'Dramatic' WHERE kind = 'Drama';"
  })

  console.log('#################################')

  return result.rows
}