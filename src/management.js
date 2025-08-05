const file = document.getElementById('img');
const url = document.getElementById('image');
const urlu = document.getElementById('image-update');
const pname = document.getElementById(`name`);
const price = document.getElementById(`price`);
const puname = document.getElementById(`name-u`);
const uprice = document.getElementById(`price-u`);
const form = document.getElementById(`rbtn`);
const select = document.getElementById(`type`);
const select2 = document.getElementById(`method`);
const select3 = document.getElementById(`type-u`)
const container = document.getElementById(`container`);
const container2 = document.getElementById(`container2`);
const container3 = document.getElementById(`container3`);
const container4 = document.getElementById(`container4`);
const upl = document.getElementById(`update-list`);
const dl = document.getElementById(`delete-list`);
const deletebtn = document.getElementById(`delete`);
const updatebtn = document.getElementById(`update`);
const updatesec = document.getElementById(`update-sector`);
const file2 = document.getElementById(`img-u`);

let id;
let type;
let val = select.value;
let deleted = [];
let deletedtype = [];

async function fetching(){
    const itembox = await fetch('items.json')
    const response = await itembox.json();
    const { chicken, meat, extras } = response;
    const chickenlength = Object.keys(chicken).length ;
    const meatlength = Object.keys(chicken).length + Object.keys(meat).length;
    const allitems = [...chicken,...meat,...extras];
    for (let i = 0;i <allitems.length;i++){
       const label = document.createElement(`label`);
       label.style.backgroundColor = `white`;
       label.style.fontFamily = `arial`;
       label.style.fontWeight = `bolder`;
       const labeld = document.createElement(`label`);
       labeld.style.backgroundColor = `white`;
       labeld.style.fontFamily = `arial`;
       labeld.style.fontWeight = `bolder`;
       let j = i+1;
       if (i === 0){
        label.textContent = `==this is the chicken section==`;
        labeld.textContent = `==this is the chicken section==`;
        upl.appendChild(label);
        dl.appendChild(labeld);
       }
       if (i === chickenlength){
        j = i-chickenlength + 1;
        label.textContent = `==this is the meat section==`;
        labeld.textContent = `==this is the meat section==`;
        upl.appendChild(label);
        dl.appendChild(labeld);
       }
       if (i === meatlength){
        j = i - meatlength + 1;
        label.textContent = `==this is the extras section==`;
        labeld.textContent = `==this is the extras section==`;
        upl.appendChild(label);
        dl.appendChild(labeld);
       }
       const newi = document.createElement(`input`);
       const newil = document.createElement(`label`);
       const di = document.createElement(`input`);
       const dil = document.createElement(`label`);
       const udiv = document.createElement(`div`);
       const ddiv = document.createElement(`div`);
        newi.type = `radio`;
        newil.textContent = `${j} - name:${allitems[i].name} - price:${allitems[i].price}`;
        newi.id = i;
        newi.name = `x`;
        newil.htmlFor = `i${i}`;
        di.type = `checkbox`;
        dil.textContent = `${j} - name:${allitems[i].name} - price:${allitems[i].price}`;
        di.id = i;
        newil.htmlFor = `i${i}`;
        newil.appendChild(newi);
        udiv.appendChild(newil);
        upl.appendChild(udiv);
        dil.appendChild(di);
        ddiv.appendChild(dil);
        dl.appendChild(ddiv);    

di.addEventListener(`change`, () => {
    const idNum = Number(di.id);
    let itemindex = [];
    let itemtype = [];

    if (idNum < chickenlength) {
            itemindex = idNum;
            itemtype = `chicken`;
        
    } else if (idNum < meatlength) {
            itemindex = idNum - chickenlength;
            itemtype = `meat`;
    } else {
            itemindex = idNum - meatlength;
            itemtype = `extras`;
    }

    
    if (di.checked) {
        const duplicated = deleted.some((val,indx) => val === itemindex && deletedtype[indx] === itemtype);
        if(!duplicated){
            deleted.push(itemindex);
            deletedtype.push(itemtype);
        }
    } else {
        for (let k = 0; k < deleted.length;k++){
            if (deleted[k] === itemindex && deletedtype[k] === itemtype){
                deleted.splice(k,1);
                deletedtype.splice(k,1);
                break;
            }
        }
    }

    console.log(deleted, deletedtype);
});



updatebtn.addEventListener(`change`,(event)=>{

    let tempo;
    event.preventDefault();

    container2.style.display = `none`;
    container4.style.display = `block`;

    tempo = allitems[i].image;
    
    if (newi.checked){
            if(newi.id < Number(chickenlength)){
        select3.value = `chicken`;
        type = `chicken`;
        id = i;
    }
    else if (newi.id < Number(meatlength)){
        select3.value = `meat`;
        type = `meat`;
        id = i - chickenlength;
    }
    else {
        select3.value = `extras`;
        type = `extras`;
        id = i - meatlength;
    }
        console.log(tempo);
        urlu.src = tempo;
        urlu.style.display = `block`;
        puname.value = allitems[newi.id].name;
        uprice.value = allitems[newi.id].price;        
    }
    
})
    }
}

file2.addEventListener(`change`,async (event)=>{
    const x = await event.target.files[0];
    if(x){
        urlu.src = URL.createObjectURL(x);
    }
})

fetching();

file.addEventListener('change', async (event) => {
    const x = await event.target.files[0];
    if (x) {
        url.src = URL.createObjectURL(x);
    }

    const label = document.getElementById(`imq-box`);
    
    url.style.display = `block`;
    label.style.display = `none`;
});

select.addEventListener(`change`,(event)=>{
    val = select.value;
});
form.addEventListener(`submit`,(event)=>{

    const formdata = new FormData();
    const image = document.getElementById(`img`);

    const file = image.files[0];

    if (pname.value === `` || price.value === `` || price.value === `0`|| image.files.length === 0){
        window.alert(`please enter a valid form`);
        event.preventDefault();
    }
    else {
        formdata.append(`image`,file);
        formdata.append(`type`,val);
        formdata.append(`name`,pname.value);
        formdata.append(`price`,price.value);
    
                fetch(`/postitem`,{
                method: `POST`,
                body:formdata
    })
    .then(res => res.json())
    .then(data => {
      console.log('Success:', data);
    })
    .catch(err => {
      console.error('Sending failed:', err.message);
    });
    }
});

select2.addEventListener(`change`,()=>{
    if (select2.value == `insert`){
        container.style.display = `block`;
        container2.style.display = `none`;
        container3.style.display = `none`;
        container4.style.display = `none`;
    }
    else if (select2.value == `update`){
        container.style.display = `none`;
        container2.style.display = `block`;
        container3.style.display = `none`;
        container4.style.display = `none`;
    }
    else{
        container.style.display = `none`;
        container2.style.display = `none`;
        container3.style.display = `block`; 
        container4.style.display = `none`;
    }
});
deletebtn.addEventListener(`submit`,(event)=>{
    event.preventDefault();
    console.log('deleted:', deleted);


    fetch(`/postitem`,{
        method:`DELETE`,
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({deleted,deletedtype})
    }).then((x)=>{
       return x.json();
    }).then(data=>{
        if(data.success){
            console.log(`success`);
        }
        else{
            console.log(`falure`);
        }
    }).catch(err =>{
        console.log(`ERROR`,err.message);
    })
});


updatesec.addEventListener(`submit`,(event)=>{

    event.preventDefault();
    
    const formdatau = new FormData();
    const image = document.getElementById(`img-u`);

    const file = image.files[0];

    console.log('PUT data:', {id, type, name: puname.value, price: uprice.value, file});

    formdatau.append(`id`,id);
    formdatau.append(`image-u`,file);
    formdatau.append(`type`,type);
    formdatau.append(`name`,puname.value);
    formdatau.append(`price`,uprice.value);

            fetch(`/postitem`,{
            method: `PUT`,
            body:formdatau
})
.then(res => res.json())
.then(data => {
  console.log('Success:', data);
})
.catch(err => {
  console.error('Sending failed:', err.message);
});
    container2.style.display = `block`;
    container4.style.display = `none`;
})