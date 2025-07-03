import { mysqlTable, varchar, int, decimal, timestamp, text, bigint, index } from 'drizzle-orm/mysql-core'
import { sql } from 'drizzle-orm'



// 数据集表 - 知识库数据集表
export const snDataset = mysqlTable('sn_dataset', {
    id: varchar('id', { length: 255 }).primaryKey().notNull(), // Dify dataset ID
    siteId: int('site_id').notNull(), // 关联的站点ID
    creatorId: bigint('creator_id', { mode: 'number' }).notNull(), // 创建者ID
    createTime: timestamp('create_time').default(sql`CURRENT_TIMESTAMP`), // 创建时间
    updateTime: timestamp('update_time').default(sql`CURRENT_TIMESTAMP`).onUpdateNow(), // 更新时间
    deleteTime: timestamp('delete_time'), // 删除时间
}, (table) => ({
    siteIdIdx: index('idx_site_id').on(table.siteId),
    creatorIdIdx: index('idx_creator_id').on(table.creatorId),
}))

// 站点LLM Token记录表
export const snLlmToken = mysqlTable('sn_llm_token', {
    id: bigint('id', { mode: 'number' }).primaryKey().autoincrement().notNull(), // 主键ID
    siteId: int('site_id').notNull(), // 站点ID
    tokens: bigint('tokens', { mode: 'number' }).notNull().default(0), // 剩余可用token数量
    createTime: timestamp('create_time').default(sql`CURRENT_TIMESTAMP`), // 创建时间
    updateTime: timestamp('update_time').default(sql`CURRENT_TIMESTAMP`).onUpdateNow(), // 更新时间
    deleteTime: timestamp('delete_time'), // 删除时间
}, (table) => ({
    siteIdIdx: index('idx_site_id').on(table.siteId),
}))

// 类型导出
export type SnLlmToken = typeof snLlmToken.$inferSelect
export type SnDataset = typeof snDataset.$inferSelect

