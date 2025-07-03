'use server'

import { db } from './db'
import { snDataset, snLlmToken } from './db/schema'
import { eq, sql } from 'drizzle-orm'

export interface TokenUsage {
    total_price?: number
    total_tokens?: number
}

export interface MessageEndData {
    id: string
    metadata?: any // 使用 any 类型来兼容不同的 metadata 结构
}

export const checkTokenAvailability = async (inputs?: Record<string, any> | null) => {
    console.log('=== Token Availability Check ===')

    if (!inputs?.dataset_id) {
        console.log('No dataset_id found in inputs')
        return { hasToken: false, message: 'No dataset_id provided' }
    }

    const datasetId = inputs.dataset_id
    console.log('Checking token for dataset_id:', datasetId)

    try {
        // 1. 根据dataset_id查找site_id
        const dataset = await db.select({ siteId: snDataset.siteId })
            .from(snDataset)
            .where(eq(snDataset.id, datasetId))
            .limit(1)

        if (!dataset.length) {
            console.log('Dataset not found:', datasetId)
            return { hasToken: false, message: 'Dataset not found' }
        }

        const siteId = dataset[0].siteId

        // 2. 查询site的token余额
        const tokenRecord = await db.select({ tokens: snLlmToken.tokens })
            .from(snLlmToken)
            .where(eq(snLlmToken.siteId, siteId))
            .limit(1)

        // 3. 判断token是否足够（不为负数）
        if (!tokenRecord.length || tokenRecord[0].tokens < 0) {
            console.log('Insufficient tokens for site:', siteId)
            return { hasToken: false, message: 'Insufficient tokens' }
        }

        console.log('Token check passed for site:', siteId)
        console.log('Available tokens:', tokenRecord[0].tokens)
        return { hasToken: true, message: 'Token check passed' }
    } catch (error) {
        console.error('Error checking token availability:', error)
        return { hasToken: false, message: 'Error checking token availability' }
    }
}

export const deductTokens = async (messageEnd: MessageEndData, currInputs?: Record<string, any> | null) => {
    'use server'
    if (!currInputs?.dataset_id) {
        console.log('No dataset_id found, skipping token deduction')
        return
    }

    const datasetId = currInputs.dataset_id
    const totalPrice = messageEnd.metadata?.usage?.total_price
    const totalTokens = messageEnd.metadata?.usage?.total_tokens

    console.log('=== Token Deduction Logic ===')
    console.log('Total Price:', totalPrice)
    console.log('Total Tokens:', totalTokens)
    console.log('========================')
    console.log('Total Tokens to deduct:', totalTokens)

    try {
        // 1. 根据dataset_id查找site_id
        const dataset = await db.select({ siteId: snDataset.siteId })
            .from(snDataset)
            .where(eq(snDataset.id, datasetId))
            .limit(1)

        if (!dataset.length) {
            console.log('Dataset not found:', datasetId)
            return
        }

        const siteId = dataset[0].siteId

        // 2. 更新site的token余额
        await db.update(snLlmToken)
            .set({
                tokens: sql`tokens - ${totalTokens}`,
                updateTime: new Date()
            })
            .where(eq(snLlmToken.siteId, siteId))

        console.log('Tokens deducted successfully')
        console.log('==========================')
    } catch (error) {
        console.error('Error deducting tokens:', error)
    }
}
