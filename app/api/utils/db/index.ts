import { drizzle } from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise'

const DB_HOST = `${process.env.DB_HOST}`
const DB_PORT = parseInt(`${process.env.DB_PORT || '3306'}`)
const DB_USER = `${process.env.DB_USER}`
const DB_PASSWORD = `${process.env.DB_PASSWORD}`
const DB_NAME = `${process.env.DB_NAME}`

if (!DB_HOST || !DB_USER || !DB_PASSWORD || !DB_NAME) {
    throw new Error('Database configuration not found in environment variables')
}

const pool = mysql.createPool({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

export const db = drizzle(pool)

// 测试数据库连接
export async function testConnection() {
    try {
        const connection = await pool.getConnection()
        console.log('Database connected successfully')
        connection.release()
        return true
    } catch (error) {
        console.error('Database connection failed:', error)
        return false
    }
} 