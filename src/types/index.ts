import { Database } from './database.types'

export type Category = Database['public']['Tables']['categories']['Row']
export type CategoryInsert = Database['public']['Tables']['categories']['Insert']
export type CategoryUpdate = Database['public']['Tables']['categories']['Update']

export type Product = Database['public']['Tables']['products']['Row']
export type ProductInsert = Database['public']['Tables']['products']['Insert']
export type ProductUpdate = Database['public']['Tables']['products']['Update']

export type InventoryMovement = Database['public']['Tables']['inventory_movements']['Row']
export type InventoryMovementInsert = Database['public']['Tables']['inventory_movements']['Insert']
export type InventoryMovementType = Database['public']['Enums']['movement_type']

export type CartItem = Database['public']['Tables']['cart_items']['Row'] & { products?: Product }
export type Order = Database['public']['Tables']['orders']['Row']
export type OrderStatus = Database['public']['Enums']['order_status']
export type OrderItem = Database['public']['Tables']['order_items']['Row'] & { products?: Product }

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Address = Database['public']['Tables']['addresses']['Row']
export type AppRole = Database['public']['Enums']['app_role']

export type Payment = Database['public']['Tables']['payments']['Row']
export type PaymentStatus = Database['public']['Enums']['payment_status']
export type PaymentProvider = Database['public']['Enums']['payment_provider']

export type Shipment = Database['public']['Tables']['shipments']['Row']
export type ShipmentStatus = Database['public']['Enums']['shipment_status']

export type Invoice = Database['public']['Tables']['invoices']['Row']
export type InvoiceStatus = Database['public']['Enums']['invoice_status']
export type InvoiceType = Database['public']['Enums']['invoice_type']
