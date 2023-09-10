export default class GameState {
  constructor() {
    this.level = 1;
    this.allCell = [];
    this.player = true;
    this.selectedCell = null;
    this.selectedCharacter = '';
  }
}
