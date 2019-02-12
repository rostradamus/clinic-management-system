const mockUsers = [
  {
    userId: 0,
    name: "Ro Lee",
    email: "rolee0429@gmail.com",
    type: "Staff",
    role: "Mental Therapist"
  }, {
    userId: 1,
    name: "Dennis Yi",
    email: "dennis.joonsuk.yi@gmail.com",
    type: "Staff",
    role: "Practitioner"
  }, {
    userId: 2,
    name: "Gwang Chul (David) Kim",
    email: "gc.kim93@gmail.com",
    type: "Patient"
  }, {
    userId: 3,
    name: "Kwang Hee Park",
    email: "parkubc@gmail.com",
    type: "Admin",
    role: "Head Practitioner"
  }, {
    userId: 4,
    name: "Jamie Jeon",
    email: "jamie@gmail.com",
    type: "Patient"
  }
];

export default Array(30).fill().map((_, i) =>
  Object.assign({...mockUsers[i % mockUsers.length]}, {userId: i}));