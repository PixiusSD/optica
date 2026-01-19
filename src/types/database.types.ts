export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    public: {
        Tables: {
            addresses: {
                Row: {
                    city: string
                    country: string | null
                    created_at: string | null
                    id: string
                    is_default: boolean | null
                    state: string
                    street: string
                    user_id: string
                    zip_code: string
                }
                Insert: {
                    city: string
                    country?: string | null
                    created_at?: string | null
                    id?: string
                    is_default?: boolean | null
                    state: string
                    street: string
                    user_id: string
                    zip_code: string
                }
                Update: {
                    city?: string
                    country?: string | null
                    created_at?: string | null
                    id?: string
                    is_default?: boolean | null
                    state?: string
                    street?: string
                    user_id?: string
                    zip_code?: string
                }
                Relationships: []
            }
            cart_items: {
                Row: {
                    created_at: string | null
                    id: string
                    product_id: string
                    quantity: number
                    user_id: string
                }
                Insert: {
                    created_at?: string | null
                    id?: string
                    product_id: string
                    quantity: number
                    user_id: string
                }
                Update: {
                    created_at?: string | null
                    id?: string
                    product_id?: string
                    quantity?: number
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "cart_items_product_id_fkey"
                        columns: ["product_id"]
                        isOneToOne: false
                        referencedRelation: "products"
                        referencedColumns: ["id"]
                    }
                ]
            }
            categories: {
                Row: {
                    created_at: string | null
                    id: string
                    name: string
                    slug: string
                    user_id: string
                }
                Insert: {
                    created_at?: string | null
                    id?: string
                    name: string
                    slug: string
                    user_id: string
                }
                Update: {
                    created_at?: string | null
                    id?: string
                    name?: string
                    slug?: string
                    user_id?: string
                }
                Relationships: []
            }
            inventory_movements: {
                Row: {
                    created_at: string | null
                    id: string
                    notes: string | null
                    product_id: string
                    quantity: number
                    type: Database["public"]["Enums"]["movement_type"]
                    user_id: string
                }
                Insert: {
                    created_at?: string | null
                    id?: string
                    notes?: string | null
                    product_id: string
                    quantity: number
                    type: Database["public"]["Enums"]["movement_type"]
                    user_id: string
                }
                Update: {
                    created_at?: string | null
                    id?: string
                    notes?: string | null
                    product_id?: string
                    quantity?: number
                    type?: Database["public"]["Enums"]["movement_type"]
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "inventory_movements_product_id_fkey"
                        columns: ["product_id"]
                        isOneToOne: false
                        referencedRelation: "products"
                        referencedColumns: ["id"]
                    }
                ]
            }
            invoices: {
                Row: {
                    cae: string | null
                    cae_expires_at: string | null
                    created_at: string | null
                    fiscal_snapshot: Json
                    id: string
                    invoice_number: number | null
                    invoice_type: Database["public"]["Enums"]["invoice_type"]
                    order_id: string
                    status: Database["public"]["Enums"]["invoice_status"] | null
                }
                Insert: {
                    cae?: string | null
                    cae_expires_at?: string | null
                    created_at?: string | null
                    fiscal_snapshot: Json
                    id?: string
                    invoice_number?: number | null
                    invoice_type: Database["public"]["Enums"]["invoice_type"]
                    order_id: string
                    status?: Database["public"]["Enums"]["invoice_status"] | null
                }
                Update: {
                    cae?: string | null
                    cae_expires_at?: string | null
                    created_at?: string | null
                    fiscal_snapshot?: Json
                    id?: string
                    invoice_number?: number | null
                    invoice_type?: Database["public"]["Enums"]["invoice_type"]
                    order_id?: string
                    status?: Database["public"]["Enums"]["invoice_status"] | null
                }
                Relationships: [
                    {
                        foreignKeyName: "invoices_order_id_fkey"
                        columns: ["order_id"]
                        isOneToOne: true
                        referencedRelation: "orders"
                        referencedColumns: ["id"]
                    }
                ]
            }
            order_items: {
                Row: {
                    created_at: string | null
                    id: string
                    order_id: string
                    price: number
                    product_id: string
                    quantity: number
                }
                Insert: {
                    created_at?: string | null
                    id?: string
                    order_id: string
                    price: number
                    product_id: string
                    quantity: number
                }
                Update: {
                    created_at?: string | null
                    id?: string
                    order_id?: string
                    price?: number
                    product_id?: string
                    quantity?: number
                }
                Relationships: [
                    {
                        foreignKeyName: "order_items_order_id_fkey"
                        columns: ["order_id"]
                        isOneToOne: false
                        referencedRelation: "orders"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "order_items_product_id_fkey"
                        columns: ["product_id"]
                        isOneToOne: false
                        referencedRelation: "products"
                        referencedColumns: ["id"]
                    }
                ]
            }
            orders: {
                Row: {
                    created_at: string | null
                    id: string
                    status: Database["public"]["Enums"]["order_status"] | null
                    total: number
                    user_id: string
                }
                Insert: {
                    created_at?: string | null
                    id?: string
                    status?: Database["public"]["Enums"]["order_status"] | null
                    total: number
                    user_id: string
                }
                Update: {
                    created_at?: string | null
                    id?: string
                    status?: Database["public"]["Enums"]["order_status"] | null
                    total?: number
                    user_id?: string
                }
                Relationships: []
            }
            payments: {
                Row: {
                    amount: number
                    created_at: string | null
                    currency: string | null
                    external_id: string | null
                    id: string
                    metadata: Json | null
                    order_id: string
                    provider: Database["public"]["Enums"]["payment_provider"]
                    status: Database["public"]["Enums"]["payment_status"] | null
                    user_id: string
                }
                Insert: {
                    amount: number
                    created_at?: string | null
                    currency?: string | null
                    external_id?: string | null
                    id?: string
                    metadata?: Json | null
                    order_id: string
                    provider: Database["public"]["Enums"]["payment_provider"]
                    status?: Database["public"]["Enums"]["payment_status"] | null
                    user_id: string
                }
                Update: {
                    amount?: number
                    created_at?: string | null
                    currency?: string | null
                    external_id?: string | null
                    id?: string
                    metadata?: Json | null
                    order_id?: string
                    provider?: Database["public"]["Enums"]["payment_provider"]
                    status?: Database["public"]["Enums"]["payment_status"] | null
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "payments_order_id_fkey"
                        columns: ["order_id"]
                        isOneToOne: false
                        referencedRelation: "orders"
                        referencedColumns: ["id"]
                    }
                ]
            }
            products: {
                Row: {
                    category_id: string | null
                    created_at: string | null
                    description: string | null
                    id: string
                    images: string[] | null
                    name: string
                    price: number
                    sku: string | null
                    status: Database["public"]["Enums"]["product_status"] | null
                    stock: number | null
                    updated_at: string | null
                    user_id: string
                }
                Insert: {
                    category_id?: string | null
                    created_at?: string | null
                    description?: string | null
                    id?: string
                    images?: string[] | null
                    name: string
                    price: number
                    sku?: string | null
                    status?: Database["public"]["Enums"]["product_status"] | null
                    stock?: number | null
                    updated_at?: string | null
                    user_id: string
                }
                Update: {
                    category_id?: string | null
                    created_at?: string | null
                    description?: string | null
                    id?: string
                    images?: string[] | null
                    name?: string
                    price?: number
                    sku?: string | null
                    status?: Database["public"]["Enums"]["product_status"] | null
                    stock?: number | null
                    updated_at?: string | null
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "products_category_id_fkey"
                        columns: ["category_id"]
                        isOneToOne: false
                        referencedRelation: "categories"
                        referencedColumns: ["id"]
                    }
                ]
            }
            profiles: {
                Row: {
                    business_name: string | null
                    created_at: string | null
                    email: string | null
                    full_name: string | null
                    id: string
                    phone: string | null
                    role: Database["public"]["Enums"]["app_role"]
                    tax_condition: string | null
                    tax_id: string | null
                }
                Insert: {
                    business_name?: string | null
                    created_at?: string | null
                    email?: string | null
                    full_name?: string | null
                    id: string
                    phone?: string | null
                    role?: Database["public"]["Enums"]["app_role"]
                    tax_condition?: string | null
                    tax_id?: string | null
                }
                Update: {
                    business_name?: string | null
                    created_at?: string | null
                    email?: string | null
                    full_name?: string | null
                    id?: string
                    phone?: string | null
                    role?: Database["public"]["Enums"]["app_role"]
                    tax_condition?: string | null
                    tax_id?: string | null
                }
                Relationships: []
            }
            shipments: {
                Row: {
                    created_at: string | null
                    id: string
                    order_id: string
                    provider: string | null
                    shipping_address: Json
                    status: Database["public"]["Enums"]["shipment_status"] | null
                    tracking_number: string | null
                }
                Insert: {
                    created_at?: string | null
                    id?: string
                    order_id: string
                    provider?: string | null
                    shipping_address: Json
                    status?: Database["public"]["Enums"]["shipment_status"] | null
                    tracking_number?: string | null
                }
                Update: {
                    created_at?: string | null
                    id?: string
                    order_id?: string
                    provider?: string | null
                    shipping_address?: Json
                    status?: Database["public"]["Enums"]["shipment_status"] | null
                    tracking_number?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "shipments_order_id_fkey"
                        columns: ["order_id"]
                        isOneToOne: false
                        referencedRelation: "orders"
                        referencedColumns: ["id"]
                    }
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            complete_checkout: {
                Args: {
                    p_user_id: string
                }
                Returns: string
            }
            complete_checkout_v2: {
                Args: {
                    p_user_id: string
                    p_address_id: string
                }
                Returns: string
            }
            get_sales_stats: {
                Args: {
                    start_date: string
                    end_date: string
                }
                Returns: {
                    date: string
                    total_sales: number
                    order_count: number
                }[]
            }
            get_top_products: {
                Args: {
                    limit_count?: number
                }
                Returns: {
                    product_name: string
                    total_quantity: number
                    total_revenue: number
                }[]
            }
        }
        Enums: {
            app_role: "admin" | "operator" | "viewer" | "customer"
            invoice_status: "draft" | "authorized" | "rejected" | "voided"
            invoice_type: "A" | "B" | "C" | "M" | "TBD"
            movement_type: "purchase" | "sale" | "adjustment" | "return"
            order_status: "pending" | "confirmed" | "cancelled" | "paid" | "shipped"
            payment_provider: "mercadopago" | "cash" | "transfer" | "mock"
            payment_status: "pending" | "approved" | "rejected" | "refunded"
            product_status: "active" | "draft" | "archived"
            shipment_status: "pending" | "prepared" | "shipped" | "delivered" | "failed"
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}
