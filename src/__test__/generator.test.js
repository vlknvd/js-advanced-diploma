import Bowman from '../js/Characters/Bowman';
import Magician from '../js/Characters/Magician';
import Swordsman from '../js/Characters/Swordsman';
import { generateTeam, characterGenerator } from '../js/generators';

test('characteristic', () => {
  const character = generateTeam([Bowman], 1, 1);
  const expected = [{
    level: 1,
    attack: 25,
    defence: 25,
    health: 100,
    type: 'bowman',
  }];
  expect(character).toEqual(expected);
});

test('generation character', () => {
  const generator = characterGenerator([Bowman, Swordsman, Magician], 4);
  const character = generator.next().value;
  expect(['bowman', 'swordsman', 'magician']).toContain(character.type);
  expect([1, 2, 3, 4]).toContain(character.level);
});

test('generation team', () => {
  const team = generateTeam([Bowman, Swordsman, Magician], 4, 3);
  expect(team.length).toBe(3);
});
