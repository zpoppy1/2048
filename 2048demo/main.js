var board=new Array();
var score;
var hasConflicted=new Array();

var startx=0;
var starty=0;
var endx=0;
var endy=0;

$(document).ready(function(){
    prepareForMobile();
    newgame();
});
function prepareForMobile() {
    if(documentWidth>500){
        gridContainerWidth=500;
        cellSideLength=100;
        cellSpace=20;
    }

    $("#grid-container").css("width",gridContainerWidth-2*cellSpace);
    $("#grid-container").css("height",gridContainerWidth-2*cellSpace);
    $("#grid-container").css("padding",cellSpace);
    $("#grid-container").css("border-radius",0.02*gridContainerWidth);

    $(".grid-cell").css("width",cellSideLength);
    $(".grid-cell").css("height",cellSideLength);
    $(".grid-cell").css("border-radius",0.02*cellSideLength);
}

function newgame(){
    //初始化棋盘格
    init();
    //在随机两个格子生产数字
    generateOneNumber();
    generateOneNumber();
}

function init(){
    for(var i=0;i<4;i++)
        for(var j=0;j<4;j++){
            var gridCell=$("#grid-cell-"+i+"-"+j);
            gridCell.css('top',getPosTop(i,j));
            gridCell.css('left',getPosLeft(i,j));
        }

        for(var i=0;i<4;i++){
        board[i]=new Array();
        hasConflicted[i]=new Array();
        for(var j=0;j<4;j++){
            board[i][j]=0;
            hasConflicted[i][j]=false;
        }
      }  
    updateBoardview();
    score=0;
}


function updateBoardview(){ 
    $(".number-cell").remove();
    for(var i=0;i<4;i++)
    for(var j=0;j<4;j++){
        $("#grid-container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>' );
        var theNumberCell=$('#number-cell-'+i+'-'+j);
        if( board[i][j] == 0 ){
            theNumberCell.css('width','0px');
            theNumberCell.css('height','0px');
            theNumberCell.css('top',getPosTop(i,j)+cellSideLength/2);
            theNumberCell.css('left',getPosLeft(i,j)+cellSideLength/2);
        }
        else{
            theNumberCell.css('width',cellSideLength);
            theNumberCell.css('height',cellSideLength);
            theNumberCell.css('top',getPosTop(i,j));//放在gridcell的中心
            theNumberCell.css('left',getPosLeft(i,j));
            theNumberCell.css('background-color',getNumberBackgroundColor(board[i][j]));
            theNumberCell.css('color',getNumberColor(board[i][j]));
            // theNumberCell.css('line-height',cellSideLength);
            // theNumberCell.css('font-size',0.6*cellSideLength);
            theNumberCell.text(board[i][j]);
        }
        hasConflicted[i][j]=false;
    }
    $('.number-cell').css('line-height',cellSideLength+'px');
    $('.number-cell').css('font-size',0.6*cellSideLength+'px');

}
function generateOneNumber(){
    if(nospace(board)) return false;
    //随机一个位置
    var randx=parseInt(Math.floor(Math.random()*4));
    var randy=parseInt(Math.floor(Math.random()*4));
    while(true){
        if(board[randx][randy]==0)
        break;
    randx=parseInt(Math.floor(Math.random()*4));
    randy=parseInt(Math.floor(Math.random()*4));
    }
    //随机一个数字,2or4
    var randNumber=Math.random()<0.5?2:4;
    //在随机位置显示随机数字
    board[randx][randy]=randNumber;
    showNumberWithAnimation(randx,randy,randNumber);
    return true;
}

function nospace(board){
    for(var i=0;i<4;i++)
        for(var j=0;j<4;j++){
            if (board[i][j]==0) return false;
        }
        return true;
}

$(document).keydown(function(event){
    switch(event.keyCode){
        case 37:
            if(moveleft()){
                event.preventDefault();//阻止默认效果（滚动条）
                 setTimeout("generateOneNumber()",300);
                 isgameover();
        }
            break;
        case 38:
            if(moveup()){
                event.preventDefault();//阻止默认效果（滚动条）
                setTimeout("generateOneNumber()",300);
                 isgameover();
                }
            break;
        case 39:
            if(moveright()){
                event.preventDefault();//阻止默认效果（滚动条）
                setTimeout("generateOneNumber()",300);
                isgameover();
            }
                break;
        case 40:
            if(movedown()){
                event.preventDefault();//阻止默认效果（滚动条）
                setTimeout("generateOneNumber()",300);
                isgameover();
            }
                break;
        default:
            break;
    }
});

document.addEventListener("touchstart",function (event){
        startx= event.touches[0].pageX;
        starty=event.touches[0].pageY;
});
document.addEventListener("touchend",function (event){
        endx= event.changedTouches[0].pageX;
        endy= event.changedTouches[0].pageY;

        var deltax=endx-startx;
        var deltay=endy-starty;

        if(Math.abs(deltax)>Math.abs(deltay)){
            if(deltax>0){
            //move right
                if(moveright()){
                    setTimeout("generateOneNumber()",300);
                    isgameover();
                }
             }else {
            //move left
                if(moveleft()){
                    setTimeout("generateOneNumber()",300);
                    isgameover();
                }
              }}
        else {
            if(deltay>0){
                //movedown
                if(movedown()){
                    setTimeout("generateOneNumber()",300);
                    isgameover();
                }
                 }else if(deltay<0){
                //moveup
                if(moveup()){
                    setTimeout("generateOneNumber()",300);
                    isgameover();
                }
             }
        }
});



function isgameover(){
    for(var i=0;i<4;i++)
        for(var j=0;j<4;j++){
            if(canmoveup()||canmovedown()||canmoveleft()||canmoveright()) break;
            alert("Game Over!!");
        }
}

function moveleft(){
    if(!canmoveleft(board)) return false;
    else {
        for(var i=0;i<4;i++)
        for(var j=1;j<4;j++){
            if (board[i][j]!=0){
                for(var k=0;k<j;k++){
                    if(board[i][k]==0&&noBlockHorizontal(i,k,j,board,true)){
                        showMoveAnimation(i,j,i,k);
                        board[i][k]=board[i][j];
                        board[i][j]=0;
                        continue;
                    }
                    else if(board[i][k]==board[i][j]&&noBlockHorizontal(i,k,j,board,true)&&hasConflicted[i][k]==false){
                        showMoveAnimation(i,j,i,k) ;
                        board[i][k]+=board[i][j];
                        board[i][j]=0;

                        hasConflicted[i][k]=true;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardview()",200);
    return true;
}

function canmoveleft(board){
        for(var i=0;i<4;i++)
        for(var j=1;j<4;j++){
            if(board[i][j]!=0){
            if( (board[i][j-1]==0)||(board[i][j]==board[i][j-1]))
                 return true;
            }
        }
        return false;
    }


function moveup(){
    if(!canmoveup(board)) return false;
    else {
        for(var i=1;i<4;i++)
            for(var j=0;j<4;j++){
                if (board[i][j]!=0){
                    for(var k=0;k<i;k++){
                        if(board[k][j]==0&&noBlockHorizontal(j,k,i,board,false)){
                            showMoveAnimation(i,j,k,j);
                            board[k][j]=board[i][j];
                            board[i][j]=0;
                            continue;
                        }
                        else if(board[k][j]==board[i][j]&&noBlockHorizontal(j,k,i,board,false)&&hasConflicted[k][j]==false){
                            showMoveAnimation(i,j,k,j) ;
                            board[k][j]+=board[i][j];
                            board[i][j]=0;

                            hasConflicted[k][j]=true;
                            continue;
                        }
                    }
                }
            }
    }
    setTimeout("updateBoardview()",200);
    return true;
}

function canmoveup(board){
    for(var i=1;i<4;i++)
        for(var j=0;j<4;j++){
            if(board[i][j]!=0){
                if( (board[i-1][j]==0)||(board[i][j]==board[i-1][j]))
                return true;
            }
        }
    return false;
}

function canmoveright(board){
    for(var i=0;i<4;i++)
        for(var j=0;j<3;j++){
            if(board[i][j]!=0){
                if((board[i][j+1]==0)||(board[i][j+1]==board[i][j]))
                return true;
            }
        }
    return false;
}

function moveright(){
    if(!canmoveright(board)) return false;
    else{
        for(var i=0;i<4;i++)
            for(var j=2;j>=0;j--){
                if(board[i][j]!=0){
                    for(var k=3;k>j;k--){
                        if(board[i][k]==0&&noBlockHorizontal(i,j,k,board,true)){
                            showMoveAnimation(i,j,i,k);
                            board[i][k]=board[i][j];
                            board[i][j]=0;
                            continue;
                        }
                        else if(board[i][k]==board[i][j]&&noBlockHorizontal(i,j,k,board,true)&&hasConflicted[i][k]==false){
                            showMoveAnimation(i,j,i,k);
                            board[i][k]+=board[i][j];
                            board[i][j]=0;
                            hasConflicted[i][k]=true;
                            continue;
                        }
                    }
                }
            }
        setTimeout("updateBoardview()",200);
        return true;
    }
}

function movedown(){
    if(!canmovedown(board)) return false;
    else {
        for(var i=2;i>=0;i--)
            for(var j=0;j<4;j++){
                if (board[i][j]!=0){
                    for(var k=3;k>i;k--){
                        if(board[k][j]==0&&noBlockHorizontal(j,i,k,board,false)){
                            showMoveAnimation(i,j,k,j);
                            board[k][j]=board[i][j];
                            board[i][j]=0;
                            continue;
                        }
                        else if(board[k][j]==board[i][j]&&noBlockHorizontal(j,i,k,board,false)&&hasConflicted[k][j]==false){
                            showMoveAnimation(i,j,k,j) ;
                            board[k][j]+=board[i][j];
                            board[i][j]=0;

                            hasConflicted[i][j]=true;
                            continue;
                        }
                    }
                }
            }
    }
    setTimeout("updateBoardview()",200);
    return true;
}

function canmovedown(board){
    for(var i=0;i<3;i++)
        for(var j=0;j<4;j++){
            if(board[i][j]!=0){
                if( (board[i+1][j]==0)||(board[i][j]==board[i+1][j]))
                return true;
            }
        }
    return false;
}