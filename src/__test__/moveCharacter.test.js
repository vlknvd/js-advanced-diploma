import GameController from '../js/GameController';
import Magician from '../js/Characters/Magician';

test('move', () => {
  const gameController = new GameController();
  const char = new Magician(1);
  const move = gameController.positionMove(char, 9);
  expect([0, 1, 2, 8, 10, 16, 17, 18]).toEqual(move);
});
