var canvas = document.getElementById('canvas'); // 取得畫布元素
var ctx = canvas.getContext('2d'); // 使用2D繪圖

var toshow = document.getElementById('toshow'); // 按鈕產生圖
var show = document.getElementById('show'); 	// 顯示圖
var clear = document.getElementById('clear'); // 按鈕清除
var drawing = false;	//判斷是否正在繪圖
var queue = [];		//佇列結構依序產生筆畫
const color = document.getElementById("color");		//顏色
const lineWidth = document.getElementById("lineWidth");	//拉桿
const value = document.getElementById("value");	//顯示拉桿值欄位
value.textContent = lineWidth.value;			//取得拉桿值
ctx.strokeStyle = color.value;			//預設顏色

// 設定顏色
color.addEventListener("input", (e) => {
    ctx.strokeStyle = e.target.value;
  }); 
// 設定粗細
lineWidth.addEventListener("input", (e) => {
    value.textContent = e.target.value;
    ctx.lineWidth = e.target.value;
});

//自訂繪圖函式，x,y起始、x1,y1結束
function drawLine(ctx,x,y,x1,y1) {
    ctx.beginPath();
    ctx.moveTo(x,y);
    ctx.lineTo(x1,y1);
    ctx.closePath();
    ctx.stroke();
}


//滑鼠左鍵按下
canvas.addEventListener('mousedown', function(e) {
    if(!drawing) { 		//預設為false，加!變相反
        drawing = true;	//繪圖狀態啟動true
	  // e為事件者(游標)的當下位置，偏移位置讓落點好看
        let x = e.pageX - canvas.offsetLeft;
        let y = e.pageY - canvas.offsetTop;
        drawLine(ctx,x,y,x,y);	//起始位置繪圖
        queue.push([x,y]);	//依序將經過的路徑放入佇列
    }
});
//滑鼠移動
canvas.addEventListener('mousemove', function(e) {
    if(drawing) {	//按著滑鼠時為true
        let old = queue.shift();	//依序移除佇列，取得剛剛路徑
        let x = e.pageX - canvas.offsetLeft;
        let y = e.pageY - canvas.offsetTop;
        drawLine(ctx,old[0],old[1],x,y);	//持續繪圖(舊>新)
        queue.push([x,y]);	//持續更新新位置
    }
});
//滑鼠左鍵起來
canvas.addEventListener('mouseup', function(e) {
    if(drawing) {
        let old = queue.shift();		//依序移除佇列
        let x = e.pageX - canvas.offsetLeft+1;
        let y = e.pageY - canvas.offsetTop+1;
        drawLine(ctx,old[0], old[1], x, y);	//最後位置繪圖
        drawing = false;	//結束繪圖狀態
    }
});

// 生成圖片按鈕事件
toshow.addEventListener('click', function() {
    // 把 canvas 轉成 DataURL（base64 圖片）
    let url = canvas.toDataURL("image/png");

    // 設定 <img> 的來源
    show.src = url;

    // 🔹 確保圖片會顯示（避免被 CSS 隱藏）
    show.style.display = "block";

     // === 🔹 新增：自動下載 PNG 檔案 ===
    const link = document.createElement('a');   // 建立暫時的 <a> 元素
    link.href = url;                            // 指向圖片
    link.download = 'my_drawing.png';           // 預設檔名
    document.body.appendChild(link);            // 加入文件（必要步驟）
    link.click();                               // 模擬使用者點擊
    document.body.removeChild(link);            // 移除 <a>
});

//清除畫布按鈕
clear.addEventListener('click', function() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
});
