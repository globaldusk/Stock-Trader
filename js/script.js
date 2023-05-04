let cash = document.getElementById("cash");
let invCash = 2000;
let fullStockList = []
fullStockList.length = 5;

if(localStorage.getItem("storedCash")){
    invCash = localStorage.getItem("storedCash");
}

for (let index = 0; index < fullStockList.length; index++) {
    if(localStorage.getItem("storedStockList")){
        fullStockList = JSON.parse(localStorage.getItem("storedStockList"));
        if(fullStockList[index] == null){
            fullStockList[index] = 0;
            document.getElementById(`stock${index}`).textContent = "0";
        }
        document.getElementById(`stock${index}`).textContent = fullStockList[index];
    }
    else{
        document.getElementById(`stock${index}`).textContent = "0";
    }
    
}



console.log(invCash);
updateCash();
function updateCash(){
    cash.textContent = "Cash: USD $" + invCash;
    localStorage.setItem("storedCash", invCash);
}

let stocks = ['AAPL', 'TSLA', 'MSFT', 'WMT', 'MCD'];
let counter = 0;
async function getPriceData(symbol) {
    const response = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=G2FQMKRLTOR1ZGIP`),
    result = await response.json(),
    metaData = result['Meta Data'],
    lastRefresh = metaData['3. Last Refreshed'],
    currentTime = result['Time Series (5min)'],
    prices = currentTime[lastRefresh],
    price = prices['1. open'];
    
    console.log(lastRefresh);
    console.log(price);
    roundedPrice = Math.round(price);

    document.querySelector('.last-refresh').textContent = "Last Refresfed: " + lastRefresh;
    let stockNum = document.getElementById(`stock-wrapper${counter}`);
    stockNum.querySelector('.symbol').textContent = stocks[counter];
    stockNum.querySelector('.current-price').textContent = roundedPrice;
    counter++;
};


const minus = document.querySelector(".minus"),
number = document.querySelector(".number"),
plus = document.querySelector(".plus");

let num = 1;

plus.addEventListener("click", function(){
    num++;
    number.innerText = num;
})

minus.addEventListener("click", function(){
    if(num > 1){
        num--;
        number.innerText = num;
    }
})

stocks.forEach(stock => {
    getPriceData(stock);
});
setInterval(stocks.forEach(stock => {
    getPriceData(stock);
}), 300000);//update every 300 seconds

let buyBtns = document.querySelectorAll('.buy');
for (i of buyBtns) {
    i.addEventListener('click', function() {
        let parent = this.parentNode,
        itemPrice = parent.querySelector('.current-price').textContent,
        stockID = parent.id.charAt(parent.id.length - 1),
        currentStock = document.getElementById(`stock${stockID}`);

        if(invCash - itemPrice*num >= 0){
            currentStock.textContent = parseInt(currentStock.textContent) + num;
            fullStockList[stockID] = currentStock.textContent;
            localStorage.setItem("storedStockList", JSON.stringify(fullStockList));
            console.log(fullStockList);
            console.log(JSON.parse(localStorage.getItem("storedStockList")));

            invCash = invCash - (itemPrice*num);
            updateCash();
        }
    });
};

let sellBtns = document.querySelectorAll('.sell');
for (i of sellBtns) {
    i.addEventListener('click', function() {
        let parent = this.parentNode,
        itemPrice = parent.querySelector('.current-price').textContent,
        stockID = parent.id.charAt(parent.id.length - 1),
        currentStock = document.getElementById(`stock${stockID}`);
            
        if(parseInt(currentStock.textContent) >= num){
            currentStock.textContent = parseInt(currentStock.textContent) - num;
            fullStockList[stockID] = currentStock.textContent;
            localStorage.setItem("storedStockList", JSON.stringify(fullStockList));
            console.log(fullStockList);
            console.log(JSON.parse(localStorage.getItem("storedStockList")));

            invCash = (parseInt(invCash) + (itemPrice*num));
            updateCash();
        }
    });
};
