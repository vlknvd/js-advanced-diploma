import GameController from '../js/GameController';
import Bowman from '../js/Characters/Bowman';

test('check information', () => {
  const gameController = new GameController();
  const character = new Bowman(1);
  const message = gameController.characterInformation(character);
  expect(message).toBe(`\u{1F396}${character.level} \u{2694}${character.attack} \u{1F6E1}${character.defence}  \u{2764}${character.health}`);
});
