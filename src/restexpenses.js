const select = document.getElementById(`select`);
const cont_show = document.getElementById(`container-add`);
const cont_add = document.getElementById(`container-show`);
const expense_name = document.getElementById(`expense-name`);
const expense_number = document.getElementById(`expense-number`);
const expense_price = document.getElementById(`expense-price`);
const tbody = document.getElementById(`tbody`);
const form = document.getElementById(`form`);
const date = document.getElementById(`dates`);
const select2 = document.getElementById(`select-shw`);
const total = document.getElementById(`Total`);
const time = new Date();

let totalexpense;

date.value = `${time.getFullYear()}-${String(time.getMonth() + 1).padStart(2, '0')}-${String(time.getDate()-1).padStart(2, '0')}`;
cont_add.style.rowGap = `10px`;

select.addEventListener(`change`,()=>{
    if (select.value === `inp`){
        cont_show.style.display = `block`;
        cont_add.style.display = `none`;
    }
    else if(select.value === `shw` ) {
        cont_show.style.display = `none`;
        cont_add.style.display = `block`;
    }
})

form.addEventListener(`submit`,(x)=>{
    const iname = expense_name.value;
    const inumber = expense_number.value;
    const iprice = expense_price.value;

    if (iname === ``|| inumber === `` || inumber ===`0`|| iprice === `0`|| iprice === ``){
        x.preventDefault();
        window.alert(`please inter a valid form`);
    }
    else {
        fetch(`/resturantexpanses`,{
            method:"POST",
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({name:iname,number:Number(inumber),price:Number(iprice)}),
        },(err)=>{
            if (err){
                console.log(`error sending data`);
            }
        })
    }
})

showAll();

select2.addEventListener(`change`,()=>{
    if (select2.value === `all`){
        dates.style.display = `none`;
        showAll();
    }
    else {
        dates.style.display = `block`;
        showAllDate();
    }
})

function showAll(){
    tbody.innerHTML = ``
    expensesData.forEach((x)=>{
        const tr = document.createElement(`tr`);
        const td1 = document.createElement(`td`);
        const td2 = document.createElement(`td`);
        const td3 = document.createElement(`td`);
        const td4 = document.createElement(`td`);
        const td5 = document.createElement(`td`);
        td1.textContent = `#${x.id}`;
        td2.textContent = x.item_name;
        td3.textContent = x.item_number;
        td4.textContent = x.item_cost;
        td5.textContent = x.total_cost;
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tr.appendChild(td5);
        tbody.appendChild(tr);

        totalexpense = expensesData.reduce((sum , item)=> sum + Number(item.total_cost),0).toFixed(2);
        total.textContent =`total expenses: ${totalexpense}`;
    })
}

function showAllDate(){
    tbody.innerHTML = ``
    expensesData.forEach((x)=>{
        if(x.e_time.slice(0,10) === date.value){
            const tr = document.createElement(`tr`);
            const td1 = document.createElement(`td`);
            const td2 = document.createElement(`td`);
            const td3 = document.createElement(`td`);
            const td4 = document.createElement(`td`);
            const td5 = document.createElement(`td`);
            td1.textContent = `#${x.id}`;
            td2.textContent = x.item_name;
            td3.textContent = x.item_number;
            td4.textContent = x.item_cost;
            td5.textContent = x.total_cost;
            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            tr.appendChild(td4);
            tr.appendChild(td5);
            tbody.appendChild(tr);
    
            totalexpense = expensesData.reduce((sum , item)=> sum + Number(item.total_cost),0).toFixed(2);
            total.textContent =`total expenses: ${totalexpense}`;
        }
    })
}