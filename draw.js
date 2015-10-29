//向<ul>标签中添加细胞个数的<li>小格表示细胞
function add_cell(){
	for (var i = 0; i < span1 + 4; i++) {
		status1[i] = new Array();
		status2[i] = new Array();
		living_cells_around[i] = new Array();
		for (var j = 0; j < span2 + 4; j++) {
			living_cells_around[i][j] = 0;
			status1[i][j] = 0;
			status2[i][j] = 0;
			var single_cell = $('<li>');
			if(i <= 1 || i >= span1 + 2 || j <= 1 || j >= span2 + 2){
				single_cell.attr({
					"class":"row" + i + "_column" + j +" cell",
					"style":"position:absolute;left:"+(j * 8)+"px;top:"+(i * 8)+"px;display:none;"
				});
			}else{
				single_cell.attr({
					"class":"row" + i + "_column" + j +" cell",
					"style":"position:absolute;left:"+(j * 8)+"px;top:"+(i * 8)+"px;",
					"onclick":"build_wall(" + i + "," + j + ")"
				});
			}		
			single_cell.appendTo('.cells');
		}
	}
}

//通过细胞状态的值改变格子的颜色
function draw_cell(status){
	for (var i = 2; i < span1 + 4; i++) {
		for (var j = 2; j < span2 + 4; j++) {
			if (wall[i][j] == 1) {
				$('.row'+ i + '_column' + j).css('background', 'red');
			}else{
				if(status[i][j] == 1) {
					$('.row'+ i + '_column' + j).css('background', 'black');
				}else{
					$('.row'+ i + '_column' + j).css('background', 'white');
				};
			};
			
		};
	};
}

function remove_cell(){
	$('.cells').remove();
	var all_cells = $('<ul>');
	all_cells.attr('class','cells');
	all_cells.appendTo('.container');
}