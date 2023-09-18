import themes from './themes';
import GameState from './GameState';
import Bowman from './Characters/Bowman';
import Swordsman from './Characters/Swordsman';
import Magician from './Characters/Magician';
import Vampire from './Characters/Vampire';
import Undead from './Characters/Undead';
import Daemon from './Characters/Daemon';
import { generateTeam } from './generators';
import PositionedCharacter from './PositionedCharacter';
import cursors from './cursors';
import GamePlay from './GamePlay';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.gameState = new GameState();
    this.hero = [Bowman, Swordsman, Magician];
    this.computer = [Vampire, Undead, Daemon];
    this.startPositionHero = [];
    this.startPositionComputer = [];
    this.heroTeam = [];
    this.computerTeam = [];
    this.startPosition = [];
    this.seceltedCell = null;
    this.selectCharacter = '';
  }

  init() {
    this.startNewGame();

    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));

    this.gamePlay.addNewGameListener(this.startNewGame.bind(this));
    this.gamePlay.addSaveGameListener(this.save.bind(this));
    this.gamePlay.addLoadGameListener(this.load.bind(this));
  }

  positionUser(team) {
    const size = this.gamePlay.boardSize;
    const userPosition = [];
    if (team === this.heroTeam) {
      for (let i = 0; i <= size * (size - 1); i += size) {
        userPosition.push(i);
        userPosition.push(i + 1);
      }
      return userPosition;
    }
    for (let i = 0; i <= size * (size - 1); i += size) {
      userPosition.push(i + (size - 1));
      userPosition.push(i + (size - 2));
    }
    return userPosition;
  }

  startPositionGenerate(team, positionTeam) {
    const start = [];
    for (let i = 0; i < team.length; i += 1) {
      let position = positionTeam[Math.floor(Math.random() * positionTeam.length)];
      while (start.includes(position)) {
        position = positionTeam[Math.floor(Math.random() * positionTeam.length)];
      }
      this.startPosition.push(new PositionedCharacter(team[i], position));
    }
  }

  selectedCharactar(start, index) {
    for (let i = 0; i < start.length; i += 1) {
      if (start[i].position === index) {
        const char = start[i];
        if (char.character.type === 'bowman' || char.character.type === 'swordsman' || char.character.type === 'magician') {
          if (this.seceltedCell !== null) {
            this.gamePlay.deselectCell(this.seceltedCell);
          }
          this.gamePlay.selectCell(index, 'yellow');
          this.seceltedCell = index;
          this.selectCharacter = char.character;
          this.gameState.player = true;
        }
      }
    }
  }

  playAttack(range, index) {
    const rangeList = [];
    const limitRow = [];
    const limitColumn = [];
    let position;

    for (let i = (index % 8) - range; i <= (index % 8) + range; i += 1) {
      if (i >= 0 && i < 8) {
        limitRow.push(i);
      }
    }

    for (let i = Math.floor(index / 8) - range; i <= Math.floor(index / 8) + range; i += 1) {
      if (i >= 0 && i < 8) {
        limitColumn.push(i);
      }
    }

    for (let i = -range; i < range + 1; i += 1) {
      for (let j = -range; j < range + 1; j += 1) {
        position = index + i * 8 + j;
        if (position !== index && !rangeList.includes(position) && position >= 0 && position < 64 && limitRow.indexOf(position % 8) >= 0 && limitColumn.indexOf(Math.floor(position / 8)) >= 0) {
          rangeList.push(position);
        }
      }
    }
    return rangeList;
  }

  positionAttack(char, index) {
    let positionAttack = [];
    if (char.type === 'swordsman' || char.type === 'undead') {
      positionAttack = this.playAttack(1, index);
    }
    if (char.type === 'bowman' || char.type === 'vampire') {
      positionAttack = this.playAttack(2, index);
    }
    if (char.type === 'magician' || char.type === 'daemon') {
      positionAttack = this.playAttack(4, index);
    }
    return positionAttack;
  }

  playMove(range, index, startPosition) {
    const usedPositions = startPosition.map((item) => item.position);
    const rangeList = [];
    const limitRow = [];
    const limitColumn = [];
    let position = 0;
    for (let i = (index % 8) - range; i <= (index % 8) + range; i += 1) {
      if (i >= 0 && i < 8) {
        limitRow.push(i);
      }
    }
    for (let i = Math.floor(index / 8) - range; i <= Math.floor(index / 8) + range; i += 1) {
      if (i >= 0 && i < 8) {
        limitColumn.push(i);
      }
    }
    for (let i = -range; i < range + 1; i += 1) {
      const x = i === 0 ? range : Math.abs(i);
      const y = i === 0 ? 1 : Math.abs(i);
      for (let j = -x; j < x + 1; j += y) {
        position = index + i * 8 + j;
        if (position !== index
        && !usedPositions.includes(position)
        && Math.floor(position / 8) === Math.floor(index / 8) + i
        && position >= 0
        && position < 64
        && limitRow.indexOf(position % 8) >= 0
        && limitColumn.indexOf(Math.floor(position / 8)) >= 0) {
          rangeList.push(position);
        }
      }
    }
    return rangeList;
  }

  positionMove(char, index) {
    let positionMove = [];
    if (char.type === 'swordsman' || char.type === 'undead') {
      positionMove = this.playMove(4, index, this.startPosition);
    }
    if (char.type === 'bowman' || char.type === 'vampire') {
      positionMove = this.playMove(2, index, this.startPosition);
    }
    if (char.type === 'magician' || char.type === 'daemon') {
      positionMove = this.playMove(1, index, this.startPosition);
    }
    return positionMove;
  }

  computerAttack() {
    const playerTeam = [];
    const computerTeam = [];
    const maxDamage = {
      damage: 0,
    };
    for (const player of this.startPosition) {
      if (player.character.type === 'bowman' || player.character.type === 'swordsman' || player.character.type === 'magician') {
        playerTeam.push(player);
      }
      if (player.character.type === 'undead' || player.character.type === 'vampire' || player.character.type === 'daemon') {
        computerTeam.push(player);
      }
      for (const computer of computerTeam) {
        const attacker = computer.character;
        const attackerPosition = computer.position;
        const positionsToAttack = this.positionAttack(computer.character, computer.position);
        for (const char of playerTeam) {
          if (positionsToAttack.indexOf(char.position) >= 0) {
            const target = char.character;
            let damage = Math.max((attacker.attack - target.defence) * 0.2, attacker.attack * 0.1);
            damage = Math.floor(damage);
            if (damage > maxDamage.damage) {
              maxDamage.damage = damage;
              maxDamage.attackerPosition = attackerPosition;
              maxDamage.defenderPosition = char.position;
            }
          }
        }
      }
    }
    if (maxDamage.damage > 0) {
      const target = this.startPosition.find((item) => item.position === maxDamage.defenderPosition);
      target.character.health -= maxDamage.damage;
      if (target.character.health < 1) {
        this.seceltedCell = null;
        this.selectedCharacter = '';
        this.gamePlay.deselectCell(target.position);
        this.startPosition = this.startPosition.filter((item) => item.position !== target.position);
      }
      this.gamePlay.showDamage(target.position, maxDamage.damage).then(() => setTimeout(() => {
        this.gamePlay.redrawPositions(this.startPosition);
        if (this.heroTeam.length === 0) {
          this.gameState.player = false;
          this.seceltedCell = null;
          this.selectedCharacter = '';
        }
      }, 10));
      this.gameState.player = true;
      return;
    }
    let random = Math.floor(Math.random() * computerTeam.length);
    const char = computerTeam[random];
    const positionsToMove = this.positionMove(char.character, char.position);
    random = Math.floor(Math.random() * positionsToMove.length);
    char.position = positionsToMove[random];
    this.gamePlay.redrawPositions(this.startPosition);
    this.gameState.player = true;
  }

  levelUp() {
    for (const item of this.startPosition) {
      const char = item.character;
      char.level += 1;
      char.attack = Math.floor(Math.max(char.attack, (char.attack * (80 + char.health)) / 100));
      char.defence = Math.floor(Math.max(char.defence, (char.defence * (80 + char.health)) / 100));
      if (char.health + 80 <= 100) {
        char.health += 80;
      } else {
        char.health = 100;
      }
      item.character = char;
    }
  }

  startLevel() {
    this.computerTeam = generateTeam(this.computer, this.gameState.level, 2);
    this.startPositionHero = this.positionUser(this.startPositionHero);
    this.startPositionGenerate(this.computerTeam, this.startPositionComputer);
    this.gamePlay.redrawPositions(this.startPosition);
  }

  clear() {
    this.startPosition = [];
    this.seceltedCell = null;
    this.selectCharacter = [];
    this.gameState.level = 1;
    this.gameState.player = true;
  }

  startNewGame() {
    this.clear();
    this.gamePlay.drawUi(themes[this.gameState.level]);
    this.heroTeam = generateTeam(this.hero, 1, 2);
    this.computerTeam = generateTeam(this.computer, 1, 2);

    this.startPositionHero = this.positionUser(this.heroTeam);
    this.startPositionComputer = this.positionUser(this.computerTeam);

    this.startPositionGenerate(this.heroTeam, this.startPositionHero);
    this.startPositionGenerate(this.computerTeam, this.startPositionComputer);

    this.gamePlay.redrawPositions(this.startPosition);
  }

  save() {
    const state = {};
    state.player = this.gameState.player;
    state.level = this.gameState.level;
    state.selectedCell = this.seceltedCell;
    state.selectedCharacter = this.selectCharacter;
    state.startPosition = this.startPosition;
    this.stateService.save(state);
    GamePlay.showMessage('Игра сохранена');
  }

  createCharacter(level, type) {
    if (type === 'bowman') {
      return new Bowman(level, 'bowman');
    }
    if (type === 'swordsman') {
      return new Swordsman(level, 'swordsman');
    }
    if (type === 'magician') {
      return new Magician(level, 'magician');
    }
    if (type === 'undead') {
      return new Undead(level, 'undead');
    }
    if (type === 'vampire') {
      return new Vampire(level, 'vampire');
    }
    if (type === 'daemon') {
      return new Daemon(level, 'daemon');
    }
    return false;
  }

  load() {
    try {
      const state = this.stateService.load();
      this.gameState.player = state.player;
      this.gameState.level = state.level;
      this.gameState.selectedCell = state.selectedCell;
      this.gameState.selectedCharacter = state.selectedCharacter;
      if (this.gameState.selectedCell) {
        this.gamePlay.selectCell(this.gameState.selectedCell, 'yellow');
      }
      this.gameState.selectedCharacter = state.selectedCharacter;
      this.startPosition = [];
      const array = state.startPosition;
      array.forEach((char) => {
        const character = this.createCharacter(char.character.level, char.character.type);
        character.attack = char.character.attack;
        character.defence = char.character.defence;
        character.health = char.character.health;
        const positionedCharacter = new PositionedCharacter(character, char.position);
        this.startPosition.push(positionedCharacter);
      });
      this.gamePlay.drawUi(themes[this.gameState.level]);
      this.gamePlay.redrawPositions(this.startPosition);
      GamePlay.showMessage('Игра загружена');
    } catch (err) {
      GamePlay.showError('Нет сохранённой игры');
    }
  }

  characterInformation(character) {
    return `\u{1F396}${character.level} \u{2694}${character.attack} \u{1F6E1}${character.defence}  \u{2764}${character.health}`;
  }

  onCellClick(index) {
    if (this.gameState.player === true) {
      this.selectedCharactar(this.startPosition, index);
      const positionToMove = this.positionMove(this.selectCharacter, this.seceltedCell);
      if (positionToMove.indexOf(index) >= 0) {
        this.startPosition.map((item) => {
          if (item.position === this.seceltedCell) {
            item.position = index;
            this.gamePlay.deselectCell(this.seceltedCell);
            this.seceltedCell = index;
            this.gamePlay.selectCell(index, 'yellow');
          }
          return item;
        });
        this.gamePlay.redrawPositions(this.startPosition);
        this.computerAttack();
      }
      const positionToAttack = this.positionAttack(this.selectCharacter, this.seceltedCell);
      if (positionToAttack.indexOf(index) >= 0) {
        const char = this.startPosition.find((item) => item.position === index);
        if (char) {
          const damage = Math.floor(Math.max((this.selectCharacter.attack - char.character.defence) * 0.2, this.selectCharacter.attack * 0.1));
          char.character.health -= damage;
          if (char.character.health < 1) {
            this.startPosition = this.startPosition.filter((item) => item.position !== index);
            for (const computer of this.computerTeam) {
              this.computerTeam.splice(computer, 1);
            }
          }
          this.gamePlay.redrawPositions(this.startPosition);
          if (this.computerTeam.length === 0) {
            if (this.gameState.level === 4) {
              this.gameState.player = false;
              GamePlay.showMessage('Вы выиграли');
              return;
            }
            this.gameState.level += 1;
            this.levelUp();
            this.startLevel();
            this.gamePlay.drawUi(themes[this.gameState.level]);
          }
          this.gamePlay.showDamage(index, damage).then(() => {
            setTimeout(() => {
              this.gameState.player = false;
              this.computerAttack();
            }, 10);
          });
        }
      }
    }
  }

  onCellEnter(index) {
    const attack = this.positionAttack(this.selectCharacter, this.seceltedCell);
    for (let i = 0; i < this.startPosition.length; i += 1) {
      const char = this.startPosition[i];
      if (char.position === index) {
        this.gamePlay.setCursor(cursors.pointer);
        const message = this.characterInformation(char.character);
        this.gamePlay.showCellTooltip(message, index);
        if ((char.character.type === 'undead' || char.character.type === 'vampire' || char.character.type === 'daemon') && char.position === index) {
          if (attack.indexOf(index) >= 0) {
            this.gamePlay.setCursor(cursors.crosshair);
            this.gamePlay.selectCell(index, 'red');
          } else {
            this.gamePlay.setCursor(cursors.notallowed);
            this.gamePlay.deselectCell(index);
          }
        }
      }
    }
    const move = this.positionMove(this.selectCharacter, this.seceltedCell);
    if (move.includes(index) && this.seceltedCell !== null) {
      this.gamePlay.selectCell(index, 'green');
    }
  }

  onCellLeave(index) {
    if (index !== this.seceltedCell || this.seceltedCell === null) {
      this.gamePlay.deselectCell(index);
    }
  }
}
