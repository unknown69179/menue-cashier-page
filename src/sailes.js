const date = document.getElementById(`date`);
const tbody = document.getElementById(`tbody`);
const cont = document.getElementById(`show-sales`);
const total = document.getElementById(`total`);
const select = document.getElementById(`options`);

const time = new Date();
let totalsales = 0;
date.value = `${time.getFullYear()}-${String(time.getMonth() + 1).padStart(2, '0')}-${String(time.getDate()-1).padStart(2, '0')}`;
date.style.display = `none`;


select.addEventListener(`change`,()=>{
    if(select.value === `all`){
        tbody.innerHTML = ``;
        insertall();
    }
    else if(select.value === `bydate`){
    date.style.display = `block`;
    tbody.innerHTML = ``;
    inserting(date.value);        
    }
})


function inserting(v){
        salesData.forEach(item => {
        if(item.date_time.slice(0,10) === v){
            const tr = document.createElement(`tr`);
            const td1 = document.createElement(`td`);
            const td2 = document.createElement(`td`);
            const td3 = document.createElement(`td`);
            const td4 = document.createElement(`td`);
            td1.textContent = `#${item.id}`;
            td2.textContent = `${item.order_name}`;
            td3.textContent = `${item.price}`;
            td4.textContent = `${item.date_time.slice(0,10)}`;
            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            tr.appendChild(td4);
            tbody.appendChild(tr);
        }
    })
}

date.style.display = `block`;

date.addEventListener(`change`,()=>{
        list.innerHTML = ``;
        inserting(date.value)
    })

function insertall(){
            date.style.display = `none`;
            tbody.innerHTML = ``
            salesData.forEach(item => {
            const tr = document.createElement(`tr`);
            const td1 = document.createElement(`td`);
            const td2 = document.createElement(`td`);
            const td3 = document.createElement(`td`);
            const td4 = document.createElement(`td`);
            td1.textContent = `#${item.id}`;
            td2.textContent = `${item.order_name}`;
            td3.textContent = `${item.price}`;
            td4.textContent = `${item.date_time.slice(0,10)}`;
            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            tr.appendChild(td4);
            tbody.appendChild(tr);
    })
}

insertall();

totalsales = salesData.reduce((sum,item)=> sum + Number(item.price),0).toFixed(2);
total.textContent = `total sales: ${totalsales} $`;