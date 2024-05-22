
  function generateRandomNumber() {
    const randomNumber = Math.floor(Math.random() * 9000000) + 1000000;
    return randomNumber;
}

module.exports = generateRandomNumber;
