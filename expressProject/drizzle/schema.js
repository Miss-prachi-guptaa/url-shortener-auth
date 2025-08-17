import { relations, sql } from 'drizzle-orm';
import { timestamp, int, mysqlTable, varchar, text, boolean } from 'drizzle-orm/mysql-core';



export const sessionsTable = mysqlTable("sessions", {
  id: int().autoincrement().primaryKey(),
  userId: int("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  valid: boolean().default(true).notNull(),
  userAgent: text("user_agent"),
  ip: varchar({ length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
})
export const usersTable = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
  isEmailValid: boolean("is_email_valid").notNull().default(false),
});

export const verifyEmailTokensTable = mysqlTable("is_email_valid", {
  id: int().autoincrement().primaryKey(),
  userId: int("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  token: varchar({ length: 8 }).notNull(),
  expiresAt: timestamp("expires_at")
    // The brackets inside sql`` is necessary here, otherwise you would get syntax error.
    .default(sql`(CURRENT_TIMESTAMP + INTERVAL 1 DAY)`)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const shortLinkTable = mysqlTable('short_link', {
  id: int().autoincrement().primaryKey(),
  url: varchar({ length: 255 }).notNull(),
  shortCode: varchar("short_code", { length: 20 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
  userId: int("user_id").notNull().references(() => usersTable.id)
});


export const userRelation = relations(usersTable, ({ many }) => ({
  shortLinks: many(shortLinkTable),
  sessions: many(sessionsTable)
}));

export const shortLinksRelation = relations(shortLinkTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [shortLinkTable.userId],
    references: [usersTable.id],
  })
}));

export const sessionRelation = relations(sessionsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [sessionsTable.userId],
    references: [usersTable.id],
  })
}));

