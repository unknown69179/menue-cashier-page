const topic = document.querySelectorAll(`.topic`);
const chickenm = document.getElementById(`container-chicken`);
const meatm = document.getElementById(`container-meat`);
const extrasm = document.getElementById(`container-extras`);
const orderm = document.getElementById(`container-order`);
const settings = document.getElementById(`settings`);
const show = document.getElementById(`the-s`);
const choice = document.querySelectorAll(`.s-topics`);
const ordercontainer = document.getElementById(`order-container`);
const form = document.getElementById(`order-form`)

let i = 0;
let ordername = [];
let orderprice = [];


    const getting = await fetch(`items.json`);
    const response = await getting.json();
    const {chicken , meat , extras} = response;

    function adding(item,containerx){
    for (let i = 0; i < item.length;i++){
        const cont = document.createElement(`div`);
        cont.classList.add(`items`);
        const image = document.createElement(`img`);
        image.classList.add(`images-menue`);
        image.src = item[i].image;
        const name = document.createElement(`p`);
        name.classList.add(`items-text-n`);
        name.textContent = item[i].name;
        const price = document.createElement(`p`);
        price.classList.add(`items-text-p`);
        price.textContent = `${item[i].price} $`;
        cont.appendChild(image);
        cont.appendChild(name);
        cont.appendChild(price);
        containerx.appendChild(cont);
    }
}

    adding(chicken,chickenm);
    adding(meat,meatm);
    adding(extras,extrasm);





settings.addEventListener(`click`,(event)=>{
    if (event.button === 0){
        show.style.transform = `translateX(0)`;
        setTimeout(()=>{

            document.addEventListener(`click`,function hide(x){
                   show.style.transform = `translateX(-100%)`; 
                document.removeEventListener(`click`,hide)
            })
        },0)
    }
})



function chickens(){
    if (i === 1 || i === 2 || i === 3){
        chickenm.style.transform = `translateX(0vw)`;
        meatm.style.transform = `translateX(100vw)`;
        extrasm.style.transform = `translateX(200vw)`;
        orderm.style.transform = `translateX(300vw)`;
        document.body.style.background = ` rgb(225, 225, 95)`;
        i = 0;
    }
}

function meats(){
    if (i === 0 || i === 2 || i === 3){
        chickenm.style.transform = `translateX(-100vw)`;
        meatm.style.transform = `translateX(0vw)`;
        extrasm.style.transform = `translateX(200vw)`;
        orderm.style.transform = `translateX(300vw)`;
        document.body.style.backgroundColor = ` hsl(0, 100%, 70%)`;
        i = 1;
    }
}

function extrass(){
    if (i === 0 || i === 1 || i === 3){
        chickenm.style.transform = `translateX(-200vw)`;
        meatm.style.transform = `translateX(-100vw)`;
        extrasm.style.transform = `translateX(0vw)`;
        orderm.style.transform = `translateX(100vw)`;
        document.body.style.backgroundColor = `hsl(240, 100%, 70%)`;
        i = 2;
    }
}
function orders(){
    if (i === 0 || i === 1 || i === 2){
        chickenm.style.transform = `translateX(-300vw)`;
        meatm.style.transform = `translateX(-200vw)`;
        extrasm.style.transform = `translateX(-100vw)`;
        orderm.style.transform = `translateX(0vw)`;
        document.body.style.backgroundColor = `hsl(0, 0%, 100%)`;
        i = 3;
    }
}

topic.forEach((x)=>{
    x.addEventListener(`click`,(event)=>{
        if(event.button === 0){
            const id = x.id;
            switch (id){
                case `chicken`:
                    chickens();
                    break;
                    case `meat`:
                        meats();
                        break;
                        case `extras`:
                            extrass();
                            break;
                            case `order`:
                                orders();
                                break;
            }
        }
    })
})

choice.forEach((x)=>{
    x.addEventListener(`click`,(event)=>{
        if(event.button === 0){
            switch (x.id) {
                case `item-management`:
                    window.location.href = `/postitem`;
                    break;
                    case `sales`:
                        window.location.href = `/sales`;
                        break;
                             case `the-coustes`:
                                window.location.href = `/resturantexpanses`;
                default:
                    break;
            }
        }
    })
})

    const items = document.querySelectorAll(`.items`);
    
    items.forEach(oneItem =>{
        oneItem.addEventListener(`mousedown`,()=>{
            const Iteminfo = oneItem.querySelectorAll(`.items-text-n,.items-text-p`);
            ordername.push(Iteminfo[0].textContent);
            orderprice.push(Iteminfo[1].textContent);
            console.log(ordername,orderprice);  
            
            const label = document.createElement(`label`);
            label.classList.add(`items-text-o`);
            label.textContent = (`${Iteminfo[0].textContent} ${Iteminfo[1].textContent}`);
            const check = document.createElement(`input`);
            check.type = `radio`;
            check.classList.add(`checks`);
            label.appendChild(check);
            ordercontainer.appendChild(label);
                check.addEventListener(`change`,(x)=>{
                    if(check.checked){
                        const name = `${Iteminfo[0].textContent.trim()} ${Iteminfo[1].textContent.trim()}`
                        const index =   Array.from(ordercontainer.children).findIndex(child => child.textContent.trim() === name);
                        
                        if (index !== -1)
                        {
                            ordername.splice(index,1);
                            orderprice.splice(index,1);
                            check.parentElement.remove();
                            console.log(ordername);
                        }    
                        
                    }
                })
            })
        })

form.addEventListener(`submit`,(x)=>{

    if (ordercontainer.innerHTML = ``){
        x.preventDefault();
        window.alert(`please select items and then submit`);
    }
    else{
        fetch(`/`,{
            method:`POST`,
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({ordername,orderprice})
        }).then(res => res.json()).catch((err)=>{
            console.log(`error sending order`,err);      
        })
    }
})