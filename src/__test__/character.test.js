import Character from '../js/Character';
import Bowman from '../js/Characters/Bowman';

test('false', () => {
  // const character = new Character(1, 'Bowman');
  expect(() => new Character(1, 'Bowman')).toThrow('Такого персонажа не существует');
});

test('true', () => {
  expect(() => new Bowman(1, 'Bowman')).not.toThrow('Такого персонажа не существует');
});
