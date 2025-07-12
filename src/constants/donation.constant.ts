export enum DonationRequestStatus {
  SCHEDULED,
  COMPLETED,
  CANCELLED
}

export enum DonationComponent {
  WHOLE_BLOOD,
  PLASMA,
  PLATELETS,
  OTHER
}

export enum BloodType {
  A_POSITIVE,
  A_NEGATIVE,
  B_POSITIVE,
  B_NEGATIVE,
  AB_POSITIVE,
  AB_NEGATIVE,
  O_POSITIVE,
  O_NEGATIVE
}

export enum DonationRequestPriority {
  NORMAL = 'normal',
  URGENT = 'urgent'
}
