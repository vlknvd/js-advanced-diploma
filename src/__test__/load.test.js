import GamePlay from '../js/GamePlay';
import GameStateService from '../js/GameStateService';

test('check load', () => {
  const stateService = new GameStateService(null);
  expect(() => stateService.load()).toThrowError(new Error('Invalid state'));
});

test('check showError', () => {
  const stateService = new GameStateService(null);
  const mock = jest.fn(() => GamePlay.showError('Ошибка загрузки'));

  try {
    stateService.load();
  } catch (err) {
    mock();
  }

  expect(mock).toHaveBeenCalled();
});
