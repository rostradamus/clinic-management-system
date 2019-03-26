const UserType = {
  PATIENT: "Patient",
  STAFF: "Staff",
  ADMIN: "Administrator"
}

const MenuTitle = {
  APPOINTMENTS: "APPOINTMENTS",
  REPORTS: "REPORTS",
  USERS: "USERS"
}

const TherapyType = {
  PT: "PT",
  PTRA: "PTRA",
  OT: "OT",
  OTRA: "OTRA",
  SLP: "SLP",
  SLPA: "SLPA",
  SW: "SW",
  SWA: "SWA",
  MUSIC: "Music",
  REC: "Rec",
  RD: "RD",
  RN: "RN",
  MD: "MD",
  PSYCH: "Psych",
  PSYCHIATRY: "Psychiatry",
  VOC: "Voc",
  SH: "S&H",
  PHARMACY: "Pharmacy",
  WOUND: "Wound",
  CML: "CML",
  TST: "TST",
  OTHER: "Other"
}

if (Object.freeze) {
  Object.freeze(UserType);
  Object.freeze(MenuTitle);
  Object.freeze(TherapyType);
}

module.exports = {
  UserType: UserType,
  MenuTitle: MenuTitle,
  TherapyType: TherapyType
}