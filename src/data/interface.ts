import { SetStateAction } from 'react'
import { OrderStatus, TBitFieldValue } from './type'

export interface IRole {
  id: number
  role_name: string
  is_active: string
  user_count: number
}

export interface IMenuItem {
  id: number
  id_parent_menu: number
  is_active: string
  menu_location: number
  name: string
  nav_path: string
  sort_order: number
}

export interface IAction {
  id: number
  action_name: string
  is_active: string
}

export interface IRoleConfiguration {
  role_name: string
  role_permission_access: IRolePermissionAccess[]
}

export interface IRolePermissionAccess {
  id_menu_item: number
  access: number[]
}

export interface ICommonPagination {
  per_page_rows?: number
  current_page?: number
  order_by?: string
  sort_by?: string
  is_active?: TBitFieldValue
  total_pages?: number
  total_items?: number
  search_text?: string
}

export interface ICommonDiamondGroupPagination {
  per_page_rows?: number
  current_page?: number
  order_by?: string
  sort_by?: string
  is_active?: TBitFieldValue
  total_pages?: number
  total_items?: number
  search_text?: string
  stone: any
  shape: any
  color: any
  carat: any
  clarity: any
  min_price: any
  max_price: any
}
export interface ICommonOrderPagination {
  start_date?: any
  end_date?: any
  per_page_rows?: number
  current_page?: number
  order_by?: string
  sort_by?: string
  is_active?: TBitFieldValue
  total_pages?: number
  total_items?: number
  order_status?: OrderStatus
}

export interface ICommonReportPagination {
  start_date?: Date | null
  end_date?: Date | null
}
export interface IBusinessUser {
  image_path: SetStateAction<string>
  id: number
  email: string
  id_role: string
  is_active: string
  name: string
  phone_number: string
}

export interface IUserAccessMenuItems {
  id: number
  name: string
  id_parent_menu: number | null
  nav_path: string | null
  sort_order: number
  icon?: string
  menu_location: number
}

export interface companyInfo {
  favicon_image_path: string
  company_name: string
  dark_image_path: string
}
