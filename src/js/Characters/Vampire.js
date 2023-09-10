import Character from '../Character';

export default class Vampire extends Character {
  constructor(level, health, type = 'vampire') {
    super(level, health);
    this.attack = 25;
    this.defence = 25;
    this.type = type;
  }
}
