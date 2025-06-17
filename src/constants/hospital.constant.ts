export enum HospitalStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  SUSPENDED = 'suspended'
}

export enum BloodType {
  A_POSITIVE = 'A+',
  A_NEGATIVE = 'A-',
  B_POSITIVE = 'B+',
  B_NEGATIVE = 'B-',
  AB_POSITIVE = 'AB+',
  AB_NEGATIVE = 'AB-',
  O_POSITIVE = 'O+',
  O_NEGATIVE = 'O-'
}

export enum BloodComponent {
  WHOLE_BLOOD = 'whole_blood',
  RED_CELLS = 'red_cells',
  PLATELETS = 'platelets',
  PLASMA = 'plasma'
}

export enum HospitalStaffRole {
  ADMIN = 'admin',
  STAFF = 'staff'
}

export const DEFAULT_OPERATING_HOURS = '07:00 - 17:00'
