module.exports = [
  {
    context: [
      "/auth",
      "/api",
    ],
    target: "http://localhost:3000",
    secure: false,
  },
];
