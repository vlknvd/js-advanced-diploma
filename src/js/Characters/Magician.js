import Character from '../Character';

export default class Magician extends Character {
  constructor(level, health, type = 'magician') {
    super(level, health);
    this.attack = 10;
    this.defence = 40;
    this.type = type;
  }
}
