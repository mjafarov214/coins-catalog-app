function randomString() {
  return Math.random().toString(32).substring(2) + Math.random().toString(32).substring(2) + Math.random().toString(32).substring(2);
}

module.exports = randomString;
