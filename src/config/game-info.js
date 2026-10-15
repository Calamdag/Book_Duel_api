// What the Library Game Hub shows about YOUR game (Hub Contract, rule 1).
// Lab Step 6: replace every CHANGE_ME value with your own.
const pkg = require('../../package.json');

module.exports = {
  slug: 'Book-duel',            // your group's game, lower case with hyphens, for example shelf-climb
  name: 'Book duel',            // the name players will see
  team: 'Group 1(BSCS 3-1',            // your group's name and section, for example Bookworms (3-1)
  developer: 'Calamdag',       // YOUR GitHub username: this build is yours
  description: 'Players join using a 6-digit code, answer timed quiz questions to earn points and protect their HP, and compete until one player remains as the winner.',     // one sentence about how the game is played
  min_players: 1,               // change to the limits your game is designed for
  max_players: 30,
  version: pkg.version,         // read from package.json, do not edit here
};
