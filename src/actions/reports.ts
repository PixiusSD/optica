'use server'

import { createClient } from '@/lib/supabase/server'
import { protectAction } from '@/lib/permissions'

export async function getDashboardStats() {
    await protectAction(['admin', 'operator', 'viewer'])
    const supabase = await createClient()

    // 1. Sales Stats (Last 30 days)
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 30)

    const { data: salesStats } = await supabase.rpc('get_sales_stats', {
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString()
    })

    // 2. Top Products
    const { data: topProducts } = await supabase.rpc('get_top_products', { limit_count: 5 })

    // 3. Low Stock 
    const { data: lowStock } = await supabase
        .from('products')
        .select('id, name, stock')
        .lt('stock', 10)
        .order('stock', { ascending: true })
        .limit(10)

    // 4. Totals (For simple KPI cards - rough estimate or aggregated from salesStats)
    // We can sum up salesStats on client, or do separate query.
    // Let's also get total orders count (all time) for fun?
    const { count: totalOrders } = await supabase.from('orders').select('*', { count: 'exact', head: true })

    return {
        salesStats: salesStats || [],
        topProducts: topProducts || [],
        lowStock: lowStock || [],
        totalOrders: totalOrders || 0
    }
}
