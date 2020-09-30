//In this project, we apply to connect to real time database and create a virtual pet app to feed the dog.

//Creatng the variables 
var dog, happyDog, database, foodS, foodStock;
var dogsprite,dogsprite1;
var database;
var feeddog,addfood;
var fedTime,lastFed;
var foodobj;
var timeHour;
var bedroom, garden,washroom;
var hungry=1;
 var sadDog;
var readState;
var gameState=0;

function preload()
{
bedroom= loadImage("images/Bed Room.png")
garden=loadImage("images/Garden.png")
washroom= loadImage("images/Wash Room.png")
  //load images here 
  dog= loadImage("images/dogImg.png");
  happyDog = loadImage("images/dogImg1.png");
  sadDog=loadImage("images/Lazy.png")
}

function setup() {

  createCanvas(950, 720);
  
  //geting the firebase database
  database = firebase.database();

  readState=database.ref('gameState')
  readState.on("value", readStock);

  //Get food value from database
  foodStock=database.ref('Food')
  foodStock.on("value", function(data){
    gameState=data.val();
  });

  dogsprite=createSprite(600,360,5,5);
  dogsprite.addImage(dog);

  //Initialzing the food stock
  writeStock(21);
 
  feeddog=createButton("Feed the dog");
  feeddog.position(450,65)
  feeddog.mousePressed(feedDog);

  addfood=createButton("Add Food");
  addfood.position(550,65)
  addfood.mousePressed(addFoods);         
  
  var today = new Date();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  timeHour = today.getHours();

  foodobj=new Food();
  foodobj.updateFoodStock(foodS);
 
 }

function draw() {  

  background(46, 139, 87);

  fedTime=database.ref('FeedTime')
  fedTime.on("value",function(data){
  lastFed=data.val(); 
  });

  readState=database.ref('gameState')
  readState.on("value",function(data){
    gameState=data.val();
  } );

  fill(255,255,254);
  textSize(20);
  fill("blue");

  if(lastFed>12){
    text("Last Feed: "+lastFed%12+" PM",150,80)
  }else if(lastFed==12){
    text("Last Feed: 12 PM",150,80)
  }else if(lastFed==0){
    text("Last Feed: 12 AM",150,80)
  }else{
    text("Last Feed: "+lastFed+" AM",150,80)
  }
  
  textSize(20);
  fill("blue");
  text("Food Stock="+foodS,150, 110);  

  foodobj.updateFoodStock(foodS);
  foodobj.display();

  // if(gameState!=hungry){
  //   feeddog.hide();
  //   addFoods.hide();
  //   dogsprite.remove();
  //   console.log("in not hungry")
  // }else{
  //   feeddog .show();
  //   addFood.show();
  //   dog.addImage(sadDog)
  // }


  drawSprites();
 if(timeHour==(lastFed+0.01)){
 // update("playing")
  foodobj.garden();
  console.log("garden")
 }else if(timeHour==(lastFed+2)){
 //update("sleeeping")
foodobj.bedroom();
 }else if(timeHour>(lastFed+2)&& timeHour<=(lastFed+4)){
  //update("playing")
  foodobj.washroom();
}else{
  //update("playing")
  foodobj.display(); 
}

}


//funtion to read  the food stock from databaae
function readStock(data){
   foodS=data.val();
   //foodS.getfoodstock()
   
}

//funtion to write  the food stock to database
function writeStock(x){
 
  if (x<=0)
  {
    x=0;
  }
  else{
    x=x-1;
  }

  database.ref('/').update({  
    Food:x
  })
}

function addFoods(){
 
  foodS++;
  database.ref('/').update({
    Food:foodS
  });
  
}


function feedDog(){

  console.log("feedDog "+foodS);

  dogsprite.addImage(happyDog);

  if(foodS>=1){
    foodS=foodS-1
  }
    database.ref('/').update({
    Food:foodS
  });

  database.ref('/').update({  
    FeedTime:timeHour
    });

}
