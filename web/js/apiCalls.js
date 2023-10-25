if(!localStorage.getItem("auth") || !localStorage.getItem("auth").indexOf("**")){
    window.location.href = "./index.html";
}

let apiUrl = "http://localhost:3456";
let meter = JSON.parse(localStorage.getItem("meter")).meterNumber;

let powerHolder = document.getElementById("powerHolder");
let meterNoHolder = document.getElementById("meterNoHolder");
let tableBody = document.querySelector(".table-body");
const rechargeBtn = document.querySelector("#recharge-btn");
const amountToRecharge = document.querySelector("#amountToRecharge");

meterNoHolder.innerText = meter;

const createNewTransaction = async () => {
    try {
        if(amountToRecharge.value < 100) {
            alert("The minimum amount to charge is 100.");
            return;
        }
        let req = await fetch(apiUrl + `/new-transaction?meter=${meter}&amount=${amountToRecharge.value}`,);
        let response = await req.json();
        if(response.status === 201){
            alert("Recharge successful. You have got new "+response.data.power + " Kwh.");
            window.location.reload();
            modal.style.display = "none";
        }
    } catch (error) {
        console.log(error.message);
    }
}

function formatDate(d){
    let year = new Date(d).getFullYear();
    let month = new Date(d).getMonth();
    let day = new Date(d).getDate();

    let hour = new Date(d).getHours();
    let minutes = new Date(d).getMinutes();

    return `${year}-${month}-${day} ${hour}:${minutes}`
}

const fetchPower = async() => {
    try {
        const res = await fetch(apiUrl+`/get-power?meter=${meter}`);
        const data = await res.json();
        powerHolder.innerHTML = data?.data?.power;
    } catch (error) {
        console.log(error.message);
    }
}

const fetchTransactions = async() => {
    try {
        const res = await fetch(apiUrl+`/transactions?meter=${meter}`);
        const data = await res.json();
        console.log(data.data);

        if(data.data.length === 0) document.getElementById("noData").innerText = "No transactions found.";

        data.data.length > 0 && data?.data.map((transaction, index) => {
            let tr = document.createElement('tr');

            let num = document.createElement('td');
            let dateField = document.createElement('td');
            let amount = document.createElement('td');
            let power = document.createElement('td');

            num.innerText = index + 1;
            dateField.innerText = formatDate(transaction.createdAt);
            amount.innerText = transaction.amount;
            power.innerText = transaction.power;

            tr.appendChild(num);
            tr.appendChild(dateField);
            tr.appendChild(amount);
            tr.appendChild(power);

            tableBody.appendChild(tr);

        })
    } catch (error) {
        console.log(error.message);
    }
}


fetchPower();
fetchTransactions();

rechargeBtn.addEventListener("click", function(e) {
    e.preventDefault();
    createNewTransaction();
})

