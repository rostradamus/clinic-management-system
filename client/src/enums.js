// UserType

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

if (Object.freeze) {
  Object.freeze(UserType);
  Object.freeze(MenuTitle);
}

module.exports = {
  UserType: UserType,
  MenuTitle: MenuTitle
}