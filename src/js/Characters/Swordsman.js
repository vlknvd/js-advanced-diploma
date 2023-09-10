import Character from '../Character';

export default class Swordsman extends Character {
  constructor(level, health, type = 'swordsman') {
    super(level, health);
    this.attack = 40;
    this.defence = 10;
    this.type = type;
  }
}
