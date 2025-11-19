// Audit log table for database changes
import { pgTable, text, timestamp, serial } from "drizzle-orm/pg-core";

export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  tableName: text("table_name").notNull(),
  operation: text("operation").notNull(),
  changedAt: timestamp("changed_at").defaultNow().notNull(),
  userId: text("user_id"),
  changedData: text("changed_data"),
});
