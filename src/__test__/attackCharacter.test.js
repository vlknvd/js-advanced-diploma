import Swordsman from '../js/Characters/Swordsman';
import GameController from '../js/GameController';

test('attack', () => {
  const gameController = new GameController();
  const char = new Swordsman(1);
  const attack = gameController.positionAttack(char, 9);
  expect([0, 1, 2, 8, 10, 16, 17, 18]).toEqual(attack);
});
