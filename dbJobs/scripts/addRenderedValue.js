const fieldRenderedValue = require('../libs/fieldRenderedValue')

module.exports = async (db) => {
  const result = await db.query(`SELECT name, id FROM "Fields" WHERE "renderedValue" IS NULL`)
  const fieldWithValuesResult = await db.query(`SELECT "Field"."id", "Field"."orgId", "Field"."name", "Field"."documentId", "Field"."versionId", "Field"."type", "Field"."order", "Field"."meta", "Field"."renderedValue", "Field"."formats", "Field"."alignment", "Field"."alt", "Field"."createdAt", "Field"."updatedAt", "Field"."deletedAt", "FieldTypeStringValue"."id" 
  AS "FieldTypeStringValue.id", "FieldTypeStringValue"."orgId" AS "FieldTypeStringValue.orgId", "FieldTypeStringValue"."value" AS "FieldTypeStringValue.value", "FieldTypeStringValue"."createdAt" AS "FieldTypeStringValue.createdAt", "FieldTypeStringValue"."updatedAt" AS "FieldTypeStringValue.updatedAt", "FieldTypeStringValue"."deletedAt" AS "FieldTypeStringValue.deletedAt", 
  "FieldTypeStringValue"."fieldId" AS "FieldTypeStringValue.fieldId", "FieldTypeTextValue"."id" AS "FieldTypeTextValue.id", "FieldTypeTextValue"."orgId" AS "FieldTypeTextValue.orgId", "FieldTypeTextValue"."value" AS "FieldTypeTextValue.value", "FieldTypeTextValue"."structuredValue" AS "FieldTypeTextValue.structuredValue", "FieldTypeTextValue"."createdAt" AS "FieldTypeTextValue.createdAt", 
  "FieldTypeTextValue"."updatedAt" AS "FieldTypeTextValue.updatedAt", "FieldTypeTextValue"."deletedAt" AS "FieldTypeTextValue.deletedAt", "FieldTypeTextValue"."fieldId" AS "FieldTypeTextValue.fieldId", "FieldTypeNumberValue"."id" AS "FieldTypeNumberValue.id", "FieldTypeNumberValue"."orgId" AS "FieldTypeNumberValue.orgId", "FieldTypeNumberValue"."value" AS "FieldTypeNumberValue.value", 
  "FieldTypeNumberValue"."createdAt" AS "FieldTypeNumberValue.createdAt", "FieldTypeNumberValue"."updatedAt" AS "FieldTypeNumberValue.updatedAt", "FieldTypeNumberValue"."deletedAt" AS "FieldTypeNumberValue.deletedAt", "FieldTypeNumberValue"."fieldId" AS "FieldTypeNumberValue.fieldId", "FieldTypeImageValue"."id" AS "FieldTypeImageValue.id", "FieldTypeImageValue"."orgId" AS "FieldTypeImageValue.orgId", 
  "FieldTypeImageValue"."value" AS "FieldTypeImageValue.value", "FieldTypeImageValue"."createdAt" AS "FieldTypeImageValue.createdAt", "FieldTypeImageValue"."updatedAt" AS "FieldTypeImageValue.updatedAt", "FieldTypeImageValue"."deletedAt" AS "FieldTypeImageValue.deletedAt", "FieldTypeImageValue"."fieldId" AS "FieldTypeImageValue.fieldId", "FieldTypeDateValue"."id" AS "FieldTypeDateValue.id", 
  "FieldTypeDateValue"."orgId" AS "FieldTypeDateValue.orgId", "FieldTypeDateValue"."value" AS "FieldTypeDateValue.value", "FieldTypeDateValue"."createdAt" AS "FieldTypeDateValue.createdAt", "FieldTypeDateValue"."updatedAt" AS "FieldTypeDateValue.updatedAt", "FieldTypeDateValue"."deletedAt" AS "FieldTypeDateValue.deletedAt", "FieldTypeDateValue"."fieldId" AS "FieldTypeDateValue.fieldId", 
  "FieldTypeFileValue"."id" AS "FieldTypeFileValue.id", "FieldTypeFileValue"."orgId" AS "FieldTypeFileValue.orgId", "FieldTypeFileValue"."value" AS "FieldTypeFileValue.value", "FieldTypeFileValue"."createdAt" AS "FieldTypeFileValue.createdAt", "FieldTypeFileValue"."updatedAt" AS "FieldTypeFileValue.updatedAt", "FieldTypeFileValue"."deletedAt" AS "FieldTypeFileValue.deletedAt", 
  "FieldTypeFileValue"."fieldId" AS "FieldTypeFileValue.fieldId" FROM "Fields" AS "Field" LEFT OUTER JOIN "FieldTypeStringValues" AS "FieldTypeStringValue" ON "Field"."id" = "FieldTypeStringValue"."fieldId" AND("FieldTypeStringValue"."deletedAt" > '2021-04-07 21:22:36.261 +00:00' OR "FieldTypeStringValue"."deletedAt" IS NULL) LEFT OUTER JOIN "FieldTypeTextValues" AS "FieldTypeTextValue" 
  ON "Field"."id" = "FieldTypeTextValue"."fieldId" AND("FieldTypeTextValue"."deletedAt" > '2021-04-07 21:22:36.262 +00:00' OR "FieldTypeTextValue"."deletedAt" IS NULL) LEFT OUTER JOIN "FieldTypeNumberValues" AS "FieldTypeNumberValue" ON "Field"."id" = "FieldTypeNumberValue"."fieldId" AND("FieldTypeNumberValue"."deletedAt" > '2021-04-07 21:22:36.262 +00:00' OR "FieldTypeNumberValue"."deletedAt" IS NULL) 
  LEFT OUTER JOIN "FieldTypeImageValues" AS "FieldTypeImageValue" ON "Field"."id" = "FieldTypeImageValue"."fieldId" AND("FieldTypeImageValue"."deletedAt" > '2021-04-07 21:22:36.262 +00:00' OR "FieldTypeImageValue"."deletedAt" IS NULL) LEFT OUTER JOIN "FieldTypeDateValues" AS "FieldTypeDateValue" ON "Field"."id" = "FieldTypeDateValue"."fieldId" AND("FieldTypeDateValue"."deletedAt" > '2021-04-07 21:22:36.262 +00:00' OR "FieldTypeDateValue"."deletedAt" IS NULL) 
  LEFT OUTER JOIN "FieldTypeFileValues" AS "FieldTypeFileValue" ON "Field"."id" = "FieldTypeFileValue"."fieldId" AND("FieldTypeFileValue"."deletedAt" > '2021-04-07 21:22:36.262 +00:00' OR "FieldTypeFileValue"."deletedAt" IS NULL) WHERE "Field"."deletedAt" IS NULL AND "Field"."renderedValue" IS NULL`)

  let updatedSuccess = 0
  for (const row of fieldWithValuesResult.rows) {
    // render template
    const renderedValue = await fieldRenderedValue(row)
    if (renderedValue != null) {
      const query = `UPDATE "Fields" SET "renderedValue" = $1 WHERE id = '${row.id}';`
      await db.query(query, [renderedValue])
      updatedSuccess++
    }
  }


  return `Successfully updated ${updatedSuccess}`
}