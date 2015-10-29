var status1 = new Array();    //细胞的状态数组1
var status2 = new Array();   //细胞的状态数组2
var present_time = 0;         //当前进行次数，初始为0
var interval = 50;          //时间间隔
var span1 = 100;               //行数
var span2 = 100;				//列数
var probability = 0.5;          //开始时活细胞产生的概率
var living_cells_around = []; //用来记录每个细胞周围的活细胞数的数组
var game_status = 0;		//记录游戏状态，0表示未开始，1表示进行中，2表示暂停, 3表示正在建墙
var wall = new Array();

//初始化生成记录墙壁的数组
function init_wall(){
	for(var i = 0; i < span1 + 4; i++){
		wall[i] = new Array();
		for(var j = 0; j < span2 + 4; j++){
			wall[i][j] = 0;
		}
	}
}

//初始化细胞布局数组
function init_cells(){
	var rand;                 //随机数
	//初始化细胞布局，0~span/2的范围内随机生成细胞，其他范围没有细胞
	for(var i = 0; i < span1 + 4; i++){		
		for(var j = 0; j < span2 + 4; j++){
			if(i < span1 + 2 && j < span2 + 2 && i > 1 && j > 1 && wall[i][j] == 0){
				rand = Math.random();
				if(rand < probability){
					status1[i][j] = 1;
					status2[i][j] = 1;
				}
				else{
					status1[i][j] = 0;
					status2[i][j] = 0;
				}
			}
			else{
				status1[i][j] = 0;
				status2[i][j] = 0;
			}
		}
	}
	present_time = 1;
	draw_cell(status1);
}

//计算细胞的周围的活细胞数
function calcu_living(status){
	for(var i = 2; i < span1 + 2; i++){
		for(var j = 2; j < span2 + 2; j++){
			if(wall[i][j] == 0){
				living_cells_around[i][j] = status[i - 2][j] + status[i - 1][j] + status[i + 1][j] + status[i + 2][j] + 
											status[i][j - 2] + status[i][j - 1] + status[i][j + 1] + status[i][j + 2];
			}else{
				living_cells_around[i][j] = 0;
			}
		}
	}
}

//细胞的单次演变，返回值是改变后的状态数组
function single_change(){
	//如果present_time是奇数，则根据status2计算status1
	if(present_time % 2 == 1){
		calcu_living(status2);
		for(var i = 2; i < span1 + 2; i++){
			for(var j = 1; j < span2 + 2; j++){
				if(living_cells_around[i][j] == 3){
					status1[i][j] = 1;
				}else if(living_cells_around[i][j] == 2){
					status1[i][j] = status2[i][j];
				}else{
					status1[i][j] = 0;
				}
			}
		}
		present_time++;
		draw_cell(status1);
	}
	//如果presnet_time是偶数，则根据status1计算status2
	else{
		calcu_living(status1);
		for(var i = 2; i < span1 + 2; i++){
			for(var j = 2; j < span2 + 2; j++){
				if(living_cells_around[i][j] == 3){
					status2[i][j] = 1;
				}else if(living_cells_around[i][j] == 2){
					status2[i][j] = status1[i][j];
				}else{
					status2[i][j] = 0;
				}
			}
		}
		present_time++;
		draw_cell(status2);
	}
}

function build_wall(i, j){
	if (game_status == 3) {
		wall[i][j] = 1;
		$('.row'+ i + '_column' + j).css('background', 'red');
	};
}



//start按键的按键响应函数
function game_start(){
	if(game_status == 0){
		init_cells();
		game_status = 1;
		changing = setInterval('single_change()', interval);
	}else if(game_status == 1){
		alert("游戏已经开始");
	}else if(game_status == 2){
		alert("游戏已暂停");
	}else{
		alert("请先关闭建墙模式");
	}
}

//pause的按键响应
function game_pause(){
	if (game_status == 1) {
		game_status = 2;
		clearInterval(changing);
	}else if (game_status == 2) {
		game_status = 1;
		changing = setInterval('single_change()', interval);
	}else if(game_status == 0){
		alert("游戏还未开始");
	}else{
		alert("游戏处于建墙模式");
	}
}

//end的按键响应
function game_end(){
	if (game_status == 1 || game_status == 2) {
		game_status = 0;
		present_time = 0;
		clearInterval(changing);
		for (var i = 0; i < span1 + 4; i++) {
			for (var j = 0; j < span2 + 4; j++) {
				status1[i][j] = 0;
				status2[i][j] = 0;
			};
		};
		draw_cell(status1);
	}else if(game_status == 0) {
		alert("游戏还未开始");
	}else{
		alert("游戏处于建墙模式");
	}
}

function game_buildwall(){
	if(game_status == 0) {
		game_status = 3;
	}else if(game_status == 3){
		game_status = 0;
	}else{
		alert("游戏已经开始");
	}
}

function game_clearwall(){
	if (game_status == 0) {
		for(var i = 0; i < span1 + 4; i++){
			for(var j = 0; j < span2 + 4; j++){
				wall[i][j] = 0;
			}
		}
		draw_cell(status1);
	}else if(game_status == 1 || game_status == 2){
		alert("游戏已开始");
	}else{
		alert("游戏处于建墙模式");
	}
}

function game_setting(){
	var temp_row = $('.row').val();
	var temp_column = $('.column').val(); 
	var temp_interval = $('.interval').val();
	var temp_probability = $('.probability').val();
	if (game_status == 0) {
		if (temp_row > 0 && temp_row <= 100 && temp_column > 0 && temp_column <= 100) {
			remove_cell();
			game_clearwall();
			span1 = parseInt(temp_row);
			span2 = parseInt(temp_column);
			status1 = new Array();
			status2 = new Array();
			living_cells_around = new Array();
			wall = new Array();
			add_cell();
			init_wall();
		};
		if(temp_interval >= 100 && temp_interval <= 1000){
			interval = parseInt(temp_interval);
		};
		if (temp_probability > 0 && temp_probability <= 100){
			probability = parseInt(temp_probability) / 100;
		};
	}else{
		alert('请在游戏开始前设置');
	}
}
