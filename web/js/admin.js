if(!localStorage.getItem("auth-admin") || !localStorage.getItem("auth-admin").indexOf("##")){
    window.location.href = "./index.html";
}

let apiUrl = "http://localhost:3456";
let meter = JSON.parse(localStorage.getItem("meter")).meterNumber;

let tableBody = document.querySelector(".table-body");
let meterN = document.querySelector("#meterN");
let meterPass = document.querySelector("#meterPass");
let meterAddBtn = document.querySelector("#meterAddBtn");

let meterNoHolder = document.getElementById("meterNoHolder");

meterNoHolder.innerText = meter;

const fetchMeters = async() => {
    try {
        const res = await fetch(apiUrl+`/meters`);
        const data = await res.json();
        console.log(data.data);

        if(data.data.length === 0) document.getElementById("noData").innerText = "No meters found.";

        data.data.length > 0 && data?.data.map((meter, index) => {
            let tr = document.createElement('tr');

            let num = document.createElement('td');
            let meterNumber = document.createElement('td');

            num.innerText = index + 1;
            meterNumber.innerText = meter.meterNumber;

            tr.appendChild(num);
            tr.appendChild(meterNumber);

            tableBody.appendChild(tr);

        })
    } catch (error) {
        console.log(error.message);
    }
}

const addMeter = async (meterNumber, password) => {
    try {
        if(!meterNumber || !password) {
            alert("Please enter all information!");
            return;
        }
        const res = await fetch(apiUrl+`/add-meter?meterNumber=${meterNumber}&password=${password}&power=${0}`, {
            method: 'POST',
        });
        const data = await res.json();
        console.log(data);
        if(data.status === 201){
            
            alert("Successfully added new meter!");
            window.location.reload();
        }else{
            alert("Error")
        }
    } catch (error) {
        console.log(error.message);
    }
}

fetchMeters();

meterAddBtn.addEventListener("click", function(e){
    e.preventDefault();
    addMeter(meterN.value, meterPass.value);
})