function navActive(val2){
  let navAct = document.querySelector('.nav-container').getElementsByTagName('a')
  for(let i=0; i<navAct.length; i++){
    navAct[i].classList.remove('active')
  }
  document.getElementById(val2).classList.add('active')

  if(val2 == 'nav-map'){
   location.reload()
  }
  else if(val2 == 'nav-airports'){
    onlyAirports()
  }
  else if(val2 == 'nav-restaurants'){
    onlyRestaurants()
  }

}

let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

let br = document.createElement('br')


let img = new Image();
img.src = './india2.png'


img.onload = () =>{
    
    console.log(img.width);
    console.log(img.height);
    ctx.drawImage(img, 0, 0)
}


const minLongitude = 68.161897;
const maxLongitude = 97.495394;
const maxLatitude = 4.931881;
const minLatitude = 37.462509;

let relativeX
let relativeY

canvas.addEventListener('click', function(e) {

  document.getElementById('pick').style.display = 'none'

  const rect = canvas.getBoundingClientRect();
  relativeX = e.clientX - rect.left;
  relativeY = e.clientY - rect.top;
  const percentageX = relativeX / canvas.width;
  const percentageY = relativeY / canvas.height;
  const longitude = (1 - percentageX) * minLongitude + percentageX * maxLongitude;
  const latitude = (1 - percentageY) * minLatitude + percentageY * maxLatitude;
  // console.log(`Clicked at (${relativeX}, ${relativeY}) on the canvas corresponds to (${latitude}, ${longitude}) on the map`);

  let coord = document.getElementById('coord')
  coord.innerHTML = 'Latitude: '+latitude.toFixed(6)+', Longitude: '+longitude.toFixed(6)


  let x = relativeX;
  let y = relativeY.toFixed(0);


  const data = ctx.getImageData(x, y, 1, 1).data;
  console.log(data);

 let rbgVal = rgbToHex(data[0], data[1], data[2])

 console.log(rbgVal);

 if(rbgVal == '#f3f0ee' || rbgVal == '#acd4eb'){
  alert('Please click on a State only !!')
 } 
 else{

  createCookie('stateColor', rbgVal, 1)

  var url = 'http://localhost/map/getStateDetails.php'
    var req = new XMLHttpRequest();
    req.open('GET', url, true);

    req.onload = function(){
      var data = JSON.parse(req.responseText);
      console.log("Selected",data)
      showData(data)
    }

    req.send()
    
  }

  drawCircle(x,y)


});


const rgbToHex = (r, g, b) => {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
const componentToHex = (c) => {
  const hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function drawCircle(a,b){
  ctx.drawImage(img, 0, 0)

  ctx.beginPath();
  ctx.arc(a, b, 5, 0, 2 * Math.PI, false);
  ctx.fillStyle = 'green';
  ctx.fill();
  ctx.lineWidth = 5;
  ctx.strokeStyle = '#003300';
  ctx.stroke();
}


function showAirports(detail){

  let airportData = detail
  let getAir = document.getElementById('showAirports')
  getAir.innerHTML = ''
  
  let airT = document.createElement('h3')
  airT.style.cssText = 'font-size: 40px; margin-top:20px;'
  airT.innerHTML = "Airports"
  getAir.appendChild(airT)
  getAir.appendChild(br.cloneNode(true))
  

  for(let i=0; i<airportData.length;i++){
   let c1 = document.createElement('p')
   c1.setAttribute('class', 'dataName')
   c1.style.cssText = 'font-size:25px'
   c1.innerHTML = airportData[i].name
   
   let c2 = document.createElement('p')
   c2.setAttribute('class', 'dataLocation')
   c2.innerHTML = airportData[i].address

   getAir.appendChild(c1)
   getAir.appendChild(c2)
   getAir.appendChild(br.cloneNode(true))
  }
}


function showRestaurants(detail){

  let restaurantData = detail
  let getRes = document.getElementById('showRestaurants')
  getRes.innerHTML = ''

  let resT = document.createElement('h3')
  resT.style.cssText = 'font-size: 40px; margin-top:20px;'
  resT.innerHTML = "Restaurants"
  getRes.appendChild(resT)
  getRes.appendChild(br.cloneNode(true))

  for(let i=0; i<restaurantData.length; i++){
    let d1 = document.createElement('p')
    d1.setAttribute('class', 'dataName')
    d1.style.cssText = 'font-size:25px'
    d1.innerHTML = restaurantData[i].name
    
    let d2 = document.createElement('p')
    d2.setAttribute('class', 'dataLocation')
    d2.innerHTML = restaurantData[i].address
 
    getRes.appendChild(d1)
    getRes.appendChild(d2)
    getRes.appendChild(br.cloneNode(true))
   }
}
  
let airportData
let restaurantData

function showData(d){
  let data2 = d
  let state = data2[0].state

  airportData = JSON.parse(data2[0].data)["airport_details"]
  restaurantData = JSON.parse(data2[0].data)["restaurant_details"]
  console.log("AD", airportData);
  console.log("RD", restaurantData);


  document.getElementById('buttons').style.display = 'flex'

  let stateTitle = document.getElementsByClassName('state')[0]
  stateTitle.innerHTML = "State: "+state

  let act = document.getElementById('buttons').getElementsByTagName('button')
  for(let i=0; i<act.length; i++){
    act[i].classList.remove('active')
  }


  let getAir = document.getElementById('showAirports')
  getAir.innerHTML = ''
  let getRes = document.getElementById('showRestaurants')
  getRes.innerHTML = ''

  // showActive()
  // showAirports(airportData)
  // showRestaurants(restaurantData)

}

let newId

function showActive(){
  let whichAct = document.getElementById('buttons').children
  for(let i=0; i<whichAct.length; i++){
    if(whichAct[i].hasAttribute('class')){
      newId = whichAct[i].id
    }
  }

  if(newId=='btn-air'){
    document.getElementById('showRestaurants').style.display = 'none'
    document.getElementById('showAirports').style.display = 'block'
    showAirports(airportData)
    newId = null
  }
  else if(newId == 'btn-res'){
    document.getElementById('showRestaurants').style.display = 'block'
    document.getElementById('showAirports').style.display = 'none'
    showRestaurants(restaurantData)
    newId = null
  }
}



function makeActive(val){

  let act = document.getElementById('buttons').getElementsByTagName('button')
  for(let i=0; i<act.length; i++){
    act[i].classList.remove('active')
  }

  document.getElementById(val).classList.add("active")

  if(val=='btn-air'){
    document.getElementById('showRestaurants').style.display = 'none'
    document.getElementById('showAirports').style.display = 'block'
    showAirports(airportData)
  }
  else if(val == 'btn-res'){
    document.getElementById('showRestaurants').style.display = 'block'
    document.getElementById('showAirports').style.display = 'none'
    showRestaurants(restaurantData)
  }

}



function onlyAirports(){

  document.getElementsByClassName('canvas-container')[0].style.display = 'none'
  document.getElementsByClassName('only-restaurants')[0].style.display = 'none'
  
  document.getElementsByClassName('only-airports')[0].style.display = 'block'


  var url = 'http://localhost/map/getAllDetails.php'
  var req = new XMLHttpRequest();
  let data
  req.open('GET', url, true);

  req.onload = function(){
    data = JSON.parse(req.responseText);
    console.log("Selected",data[1].state)
    console.log("Selected",JSON.parse(data[1].data)["airport_details"])
    airportsDataOnly(data)
  }

  req.send()
 
}

function airportsDataOnly(dInfo){
  let info = dInfo
  console.log("info", info);

  let putAirport = document.querySelector('.only-airports')

  for(let i=0; i<info.length; i++){
    let div = document.createElement('div')
    div.style.cssText = 'display: flex; gap:5rem;justify-content: center;'

    let h4 = document.createElement('h4')
    h4.style.cssText = 'width: 250px; font-size: 20px'
    h4.innerHTML = info[i].state
    
    let div2 = document.createElement('div')
    div2.style.cssText = 'width: 500px'
    let pRows = JSON.parse(info[i].data)["airport_details"]
    
    for(let j=0; j<pRows.length; j++){
      let p = document.createElement('li')
      p.style.cssText = 'list-style: numeric'
      p.innerHTML = pRows[j].name+' ('+pRows[j].address+')'
      div2.appendChild(p)
    }

    div.appendChild(h4)
    div.appendChild(div2)

    putAirport.appendChild(div)

    putAirport.appendChild(br.cloneNode(true))
  }

}


function onlyRestaurants(){

  document.getElementsByClassName('canvas-container')[0].style.display = 'none'
  document.getElementsByClassName('only-airports')[0].style.display = 'none'
  
  document.getElementsByClassName('only-restaurants')[0].style.display = 'block'


  var url = 'http://localhost/map/getAllDetails.php'
  var req = new XMLHttpRequest();
  let data
  req.open('GET', url, true);

  req.onload = function(){
    data = JSON.parse(req.responseText);
    // console.log("Selected",data[1].state)
    // console.log("Selected",JSON.parse(data[1].data)["restaurant_details"])
    restaurantsDataOnly(data)
  }

  req.send()
 
}

function restaurantsDataOnly(rInfo){
  let info = rInfo
  console.log("info", info);

  let putRestaurant = document.querySelector('.only-restaurants')

  for(let i=0; i<info.length; i++){
    let div = document.createElement('div')
    div.style.cssText = 'display: flex; gap:5rem;justify-content: center;'

    let h4 = document.createElement('h4')
    h4.style.cssText = 'width: 250px; font-size: 20px'
    h4.innerHTML = info[i].state
    
    let div2 = document.createElement('div')
    div2.style.cssText = 'width: 400px'
    let pRows = JSON.parse(info[i].data)["restaurant_details"]
    
    for(let j=0; j<pRows.length; j++){
      let p = document.createElement('li')
      p.style.cssText = 'list-style: numeric'
      p.innerHTML = pRows[j].name+' ('+pRows[j].address+')'
      div2.appendChild(p)
    }

    div.appendChild(h4)
    div.appendChild(div2)

    putRestaurant.appendChild(div)

    putRestaurant.appendChild(br.cloneNode(true))
  }

}


function createCookie(name, value, days) {
  var expires;
    
  if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toGMTString();
  }
  else {
      expires = "";
  }

  document.cookie = escape(name)+ "=" + escape(value) + expires + "; path=/";

}



