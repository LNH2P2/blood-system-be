import { BloodType, BloodComponent } from '../../../constants/hospital.constant'

export interface ContactInfo {
  phone: string
  email?: string
}

export interface Coordinates {
  latitude: number
  longitude: number
}

export interface BloodInventoryItem {
  bloodType: BloodType
  component: BloodComponent
  quantity: number
  expiresAt: Date
}

export interface MedicalFacility {
  _id?: string
  name: string
  address: string
  province: string
  district: string
  ward: string
  contactInfo: ContactInfo
  operatingHours: string
  services: string[]
  bloodInventory: BloodInventoryItem[]
  emergencyContact: string
  description: string
  coordinates: Coordinates
  isActive: boolean
  status?: string
  licenseNumber?: string
  establishedDate?: Date
  createdAt?: Date
  updatedAt?: Date
}
