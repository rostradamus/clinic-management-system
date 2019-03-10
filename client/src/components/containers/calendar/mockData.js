const users = {
  david: {
    "id": 1,
    "username": "davidkim",
    "email": "sample7@gmail.com",
    "phone_number": "778-627-2829",
    "first_name": "David",
    "last_name": "Kim",
    "type": "Patient",
    "permission_level": "Low"
  },
  dennis: {
    "id": 2,
    "username": "dennisyi",
    "email": "dennis.joonsuk.yi@gmail.com",
    "phone_number": "778-288-4498",
    "first_name": "Dennis",
    "last_name": "Yi",
    "type": "Administrator",
    "permission_level": "High"
  },
  jamie: {
    "id": 3,
    "username": "jamiejeon",
    "email": "sample4@gmail.com",
    "phone_number": "778-161-7181",
    "first_name": "Jamie",
    "last_name": "Jeon",
    "type": "Patient",
    "permission_level": "Low"
  },
  kenny: {
    "id": 4,
    "username": "kennypark",
    "email": "sample5@gmail.com",
    "phone_number": "778-920-2122",
    "first_name": "Kenny",
    "last_name": "Park",
    "type": "Administrator",
    "permission_level": "High"
  },
  mike: {
    "id": 5,
    "username": "mikeyoon",
    "email": "sample3@gmail.com",
    "phone_number": "778-213-1415",
    "first_name": "Mike",
    "last_name": "Yoon",
    "type": "Staff",
    "permission_level": "Medium"
  },
  ro: {
    "id": 6,
    "username": "rolee",
    "email": "sample6@gmail.com",
    "phone_number": "778-232-4252",
    "first_name": "Ro",
    "last_name": "Lee",
    "type": "Staff",
    "permission_level": "Medium"
  },
  sc: {
    "id": 7,
    "username": "seongchanlee",
    "email": "sample1@gmail.com",
    "phone_number": "778-123-4567",
    "first_name": "Seongchan",
    "last_name": "Lee",
    "type": "Patient",
    "permission_level": "Low"
  }
};

export default [
  {
    id: 1,
    // title: "Patient: Kenny - Therapist: Ro",
    patient: users.sc,
    staff: users.ro,
    start: new Date(2019, 1, 13, 14, 0, 0),
    end: new Date(2019, 1, 13, 16, 0, 0),
    repeat: "Never",
    location: "Room A 104",
    notes: ""
  },
  {
    id: 2,
    // title: "Patient: Kenny - Therapist: Ro",
    patient: users.sc,
    staff: users.ro,
    start: new Date(2019, 1, 11, 15, 0, 0),
    end: new Date(2019, 1, 11, 16, 0, 0),
    repeat: "Weekly",
    location: "Room A 102",
    notes: "Great improvement"
  },
  {
    id: 3,
    // title: "Patient: SeongChan - Therapist: Mike",
    patient: users.jamie,
    staff: users.mike,
    start: new Date(2019, 1, 11, 15, 0, 0),
    end: new Date(2019, 1, 11, 16, 0, 0),
    repeat: "Weekly",
    location: "Room C 1022",
    notes: "Sprained ankle."
  },
  {
    id: 4,
    // title: "Patient: David - Therapist: Dennis",
    patient: users.david,
    staff: users.ro,
    start: new Date(2019, 1, 11, 9, 0, 0),
    end: new Date(2019, 1, 11, 11, 0, 0),
    repeat: "Never",
    location: "Room A 1023",
    notes: "David is in good health"
  },
  {
    id: 5,
    // title: "Patient: Swings - Therapist: Jamie",
    patient: users.david,
    staff: users.mike,
    start: new Date(2019, 1, 12, 12, 0, 0),
    end: new Date(2019, 1, 12, 13, 0, 0),
    repeat: "Weekly",
    location: "Room A 102",
    notes: "Swings needs to exercise regulary."
  },
  {
    id: 6,
    // title: "Patient: Ricky - Therapist: Jamie",
    patient: users.sc,
    staff: users.mike,
    start: new Date(2019, 1, 14, 13, 0, 0),
    end: new Date(2019, 1, 14, 14, 0, 0),
    repeat: "Never",
    location: "Room A 102",
    notes: "Ricky has fully recovered."
  },
  {
    id: 7,
    // title: "Patient: Chris - Therapist: Ro",
    patient: users.jamie,
    staff: users.ro,
    start: new Date(2019, 1, 15, 11, 0, 0),
    end: new Date(2019, 1, 15, 12, 0, 0),
    repeat: "Weekly",
    location: "Room B 222",
    notes: "Chris did not come today."
  },
  {
    id: 8,
    // title: "Patient: Kenny - Therapist: Ro",
    patient: users.sc,
    staff: users.ro,
    start: new Date(2019, 1, 12, 10, 0, 0),
    end: new Date(2019, 1, 12, 11, 0, 0),
    repeat: "Monthly",
    location: "Room C 742",
    notes: "Kenny is lacking vitamins."
  },
  {
    id: 9,
    // title: "Patient: Chris - Therapist: SeongChan",
    patient: users.jamie,
    staff: users.mike,
    start: new Date(2019, 1, 14, 12, 0, 0),
    end: new Date(2019, 1, 14, 13, 0, 0),
    repeat: "Weekly",
    location: "Room B 222",
    notes: "Chris is recovering."
  }
];