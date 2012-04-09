/**
 * ryo matsuo
 */

// ----------------------------------------------------------
// 定数
// ----------------------------------------------------------
var BLOCK_SIZE = 30;
var SCREEN_CELL_X = 10;
var SCREEN_CELL_Y = 10;
var SCREEN_SIZE_HEIGHT = BLOCK_SIZE * SCREEN_CELL_Y;
var SCREEN_SIZE_WIDTH = BLOCK_SIZE * SCREEN_CELL_X;

var CONNECTOR_WIDTH = 10;

// ----------------------------------------------------------
// グローバル変数
// ----------------------------------------------------------
var game = null;
var screen = new Array();
var connector_path = new Array();

// ----------------------------------------------------------
// enchant関係
// ----------------------------------------------------------
enchant();

// ----------------------------------------------------------
// main
// ----------------------------------------------------------
window.onload = function()
{
	game = new Game(SCREEN_SIZE_HEIGHT,SCREEN_SIZE_WIDTH);
	game.fps = 30;
	game.onload = function() {
		var scene = game.rootScene;
		scene.backgroundColor = "black";

    // ゲーム開始処理
		scene.onenter = function() {
			game.frame = 0;
			initScreen(scene);
		};

    // 更新処理
		scene.onenterframe = function() {
//          console.log(game.frame);
		};

    // タッチ開始
    scene.addEventListener('touchstart', function(e){
      connector_path = new Array();
      connector_path.push(posToBlock(e.x, e.y));
<<<<<<< HEAD
      initConnectorLayer(scene);
      console.dir(connector_path);
=======
>>>>>>> コネクタ描画とか選択中コネクタの持ち方変えたりした
    });

    // タッチ移動中
    scene.addEventListener('touchmove', function(e){
      block = posToBlock(e.x, e.y);

      // 直前のブロックと同一？
      if (connector_path.slice(-1)[0] == block) {
        // 抜ける
        return;
      } 

      idx = connector_path.indexOf(block);
      // すでにコネクターがつながってるブロック？
      if (idx != -1)
      {
        // すでに登録されてるブロックまでコネクターを戻す
        connector_path = connector_path.slice(0, idx);
      }
      // 直近ブロックと隣接してる？
      else if (is_adjacent(connector_path.slice(-1)[0], block))
      {
        // コネクタ延長
        connector_path.push(block);
      }
    });

    // タッチ終了
    scene.addEventListener('touchend', function(e){
// TODO: connector_pathをもとにコネクター描画
console.dir(connector_path);
    });
	}


	game.debug();
}

// ----------------------------------------------------------
// 盤面初期化
// ----------------------------------------------------------
var initScreen = function(scene) {
  screen = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ];

  for (var i=0; i<SCREEN_CELL_X; ++i) {
    for (var j=0; j<SCREEN_CELL_Y; j++) {
      blockIndex = ((j*SCREEN_CELL_Y)+i)+1;
      var block = new Block(blockIndex);
      block.x = (i * BLOCK_SIZE);
      block.y = (j * BLOCK_SIZE);
      block.cell = blockToCell(block);
      screen[j][i] = block;
	    scene.addChild(block)
 	  }
  }

  // コネクタ用レイヤーを用意しておく
  var connectorLayer = new Connector();
}

// ----------------------------------------------------------
// コネクタ描画レイヤー
// ----------------------------------------------------------
var initConnectorLayer = function(scene) {
console.log("initConnectorLayer in");
  var connectorLayer = new ConnectorLayer(scene.width, scene.height);
  connectorLayer.x = 0;
  connectorLayer.y = 0;
  scene.addChild(connectorLayer)
}

// ----------------------------------------------------------
// x,y座標からセル位置返却
// ----------------------------------------------------------
var posToCell = function(x, y) {
  var cell = {};
  cell.x = Math.floor(x / BLOCK_SIZE);
  cell.y = Math.floor(y / BLOCK_SIZE);
  return cell;
}

// ----------------------------------------------------------
// x,y座標からブロック返却
// ----------------------------------------------------------
var posToBlock = function(x, y) {
  var cell = posToCell(x, y);
  return screen[cell.x][cell.y];
}
    
// ----------------------------------------------------------
// セルから中心点x,y座標返却
// ----------------------------------------------------------
var cellToCenterPointPos = function(x, y, line_width) {
  var pos = {};  
  pos.x = (x * BLOCK_SIZE) + (Math.floor((BLOCK_SIZE - CONNECTOR_WIDTH) / 2));
  pos.y = (y * BLOCK_SIZE) + (Math.floor((BLOCK_SIZE - CONNECTOR_WIDTH) / 2));
  return pos;
}

// ----------------------------------------------------------
// 指定ブロックのセル位置返却
// ----------------------------------------------------------
var blockToCell = function(block) {
  return posToCell(block.x, block.y);
}

// ----------------------------------------------------------
// 指定ブロック1に2は隣接しているか判定
// ----------------------------------------------------------
var is_adjacent = function(block1, block2) {
  // 種別違う
  if     (block1.type != block2.type) 
  	return false;
  // 上隣接
  else if (block1.cell.x == block2.cell.x    && block1.cell.y == block2.cell.y -1)
    return true;
  // 完全同一セル
  else if (block1.cell.x == block2.cell.x    && block1.cell.y == block2.cell.y   )
    return true;
  // 下隣接
  else if (block1.cell.x == block2.cell.x    && block1.cell.y == block2.cell.y -1)
    return true;
  // 左上隣接
  else if (block1.cell.x == block2.cell.x -1 && block1.cell.y == block2.cell.y -1)
    return true;
  // 左隣接
  else if (block1.cell.x == block2.cell.x -1 && block1.cell.y == block2.cell.y   )
    return true;
  // 左下隣接
  else if (block1.cell.x == block2.cell.x -1 && block1.cell.y == block2.cell.y +1)
    return true;
  // 右上隣接
  else if (block1.cell.x == block2.cell.x +1 && block1.cell.y == block2.cell.y -1)
    return true;
  // 右隣接
  else if (block1.cell.x == block2.cell.x +1 && block1.cell.y == block2.cell.y   )
    return true;
   // 右下隣接
  else if (block1.cell.x == block2.cell.x +1 && block1.cell.y == block2.cell.y +1)
    return true;
   // それ以外
  else 
  	return false; 
}

// ----------------------------------------------------------
// ブロック破壊
// ----------------------------------------------------------
var shotBlock = function(block) {
  console.dir(block);
  // 指定ブロックをまず消す
  block.parentNode.removeChild(block);
  console.dir(block);
  console.log("block.cell.y " + block.cell.y);
  // 指定ブロックの上に乗っているブロックを下に下げる
  for(i=block.cell.y; i>=0; --i) {
    screen[i][block.cell.x].y += BLOCK_SIZE;
  }
}

// ----------------------------------------------------------
// コネクタ描画
// ---------------------------------------f-------------------
var drawPath = function(scene, path_blocks) {
    // スプライト生成
    var sprite  = new Sprite(SPRITE_WIDTH, SPRITE_HEIGHT);  // スプライト生成
    var surface = new Surface(SPRITE_WIDTH, SPRITE_HEIGHT); // サーフェス生成
    
    // canvas 描画
    surface.context.strokeStyle = "red";
    surface.context.lineWidth = LINE_WIDTH;
    surface.context.lineJoin = 'round';
    surface.context.lineCap = 'round';
    surface.context.beginPath();
    
    for (var i =0; i < path_blocks.length; i++) {
      pos = cellToCenterPointPos(path_blocks[i][0], pathes[i][1], LINE_WIDTH);
      if (i == 0)
        surface.context.moveTo(pos.x,pos.y);
      else
        surface.context.lineTo(pos.x,pos.y);
    }

    surface.context.stroke();
    sprite.image = surface; // サーフェスを画像としてセット
    scene.addChild(sprite); // シーンに追加
}


// ----------------------------------------------------------
// ブロッククラス
// ----------------------------------------------------------
var Block = Class.create(Group, {
	initialize: function(blockIndex) {
		Group.call(this);
    this.type  = 1;
    this.index = blockIndex;

		var sprite  = new Sprite(BLOCK_SIZE, BLOCK_SIZE);
		var surface = new Surface(BLOCK_SIZE, BLOCK_SIZE);
		var context = surface.context;
		context.fillStyle = "white";
		context.strokeStyle = "black";
		context.fillRect(0, 0, BLOCK_SIZE, BLOCK_SIZE);
		context.stroke();
		sprite.image = surface;
		this.addChild(sprite);

		var label = new Label();
		label.text = blockIndex;
		label.color = "black";
		label.font = "15px 'Consolas'";
		label.height = BLOCK_SIZE;
		label.width = BLOCK_SIZE;
		label.x = 0;
		label.y = 12;
		this.addChild(label);

		this.sprite = sprite;
		this.surface = surface;
	},

//	ontouchstart: function() {
//		shotBlock(this)
//	}

});

// ----------------------------------------------------------
// コネクタ描画レイヤークラス
// ----------------------------------------------------------
<<<<<<< HEAD
var ConnectorLayer = Class.create(Group, {
  initialize: function(width, height) {
    Group.call(this);
    var sprite  = new Sprite(width, height);
    var surface = new Surface(width, height);
    var context = surface.context;
    context.fillStyle = "black";
    context.opacity = 1.0;
    sprite._element.style.zIndex = 4;
    sprite.image = surface;
    this.addChild(sprite);
    this.sprite = sprite;
    this.surface = surface;
  },
=======
var Connector = Class.create(Sprite, {
  initialize: function() {
    var sprite  = new Sprite(SCREEN_SIZE_HEIGHT, SCREEN_SIZE_WIDTH);
    var surface = new Surface(SCREEN_SIZE_HEIGHT, SCREEN_SIZE_WIDTH);
    var context = surface.context;
    context.fillStyle = "black";
    context.fillRect(0, 0, SCREEN_SIZE_HEIGHT, SCREEN_SIZE_WIDTH);
    context.stroke();
    sprite.opacity = 0.5;
    sprite.image = surface;
    this.addChild(sprite);
  },

//  ontouchstart: function() {
//    shotBlock(this)
//  }

>>>>>>> コネクタ描画とか選択中コネクタの持ち方変えたりした
});