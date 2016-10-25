var queensAccident=0;
var manhattanAccident=0;
var siAccident=0;
var bronxAccident=0;
var brooklynAccident=0;
var accidentDate= new Array();
var time= new Array();
var latitude= new Array();
var longitude= new Array();
var zipCode= new Array();
var borough= new Array();
var onStreetName= new Array();
var number_of_persons_injured= new Array();
var number_of_persons_killed= new Array();
var contributing_factor_vehicle1= new Array();
var contributing_factor_vehicle2= new Array();
var output= new Array();
var totalPages=0;
var currentPage=1;
var perPage= 10;
var accidentReasons= new Object();
var reasons=[];
var killed= new Object();
var injured= new Object();
var outputLat= new Array();
var outputLong= new Array();
var outputLat2= new Array();
var outputLong2= new Array();
var spinner;
$( document ).ready(function() {
                   setTimeout(dothis, 1000);
	var spinner= new Spinner({
		lines: 12,
		length: 7,
		width: 3,
		radius: 10,
		color: '#000',
		speed: 1,
		trial: 100,
		shadow: true
	}).spin(document.getElementById("circle"));
});
        
        


function getData() {
	var currentDate= new Date();
	console.log(currentDate.getDate()+" "+currentDate.getMonth()+" "+currentDate.getFullYear()+" ");
	currentDate.setDate(currentDate.getDate()-30);
	console.log(currentDate.getUTCMonth());
	var month;
	if(currentDate.getMonth()<10)
		month= "0"+ currentDate.getMonth()+"";
	else
		month= 	currentDate.getMonth();
    $.ajax({
        type: "GET",
        dataType: "json",
        cache: false,
        url: "https://data.cityofnewyork.us/resource/h9gi-nx95.json?$limit=50000&$where=date > '"+
        currentDate.getFullYear()+"-"+month+"-"+currentDate.getDay()+"'",

        success: function (data) {
			console.log(data.length);
			//console.log(data);
			for (var i = 0; i < data.length; i++) {
			//	console.log(data[i].borough);
                if(data[i].borough=="BRONX")
                	bronxAccident++;
                else if(data[i].borough=="MANHATTAN")
                	manhattanAccident++;             
                else if(data[i].borough=="QUEENS")
                	queensAccident++;	
                else if(data[i].borough=="BROOKLYN")
                	brooklynAccident++;
                else if(data[i].borough=="STATEN ISLAND")
                	siAccident++;	
                 	
                accidentDate.push(data[i].date.substring(5,7)+"/"+data[i].date.substring(8,10)+"/"+data[i].date.substring(0,4));
                time.push(data[i].time);
                latitude.push(data[i].latitude);
                borough.push(data[i].borough);
                longitude.push(data[i].longitude);
                zipCode.push(data[i].zip_code);
                onStreetName.push(data[i].on_street_name);
                number_of_persons_injured.push(data[i].number_of_persons_injured);
                number_of_persons_killed.push(data[i].number_of_persons_killed);
                contributing_factor_vehicle1.push(data[i].contributing_factor_vehicle_1);
                contributing_factor_vehicle2.push(data[i].contributing_factor_vehicle_2);
               // console.log(onStreetName[i]);
                personsKilled(number_of_persons_killed[i], borough[i]);
				personsInjured(number_of_persons_injured[i], borough[i]);

            } 
            accidents();
     
        }
    });
    
}
getData();

function query(){
	var zip= document.getElementById("zip").value;
	var userborough= document.getElementById("borough").value;
	//console.log(userborough);
	var userDate= document.getElementById("date").value;
	var userAddr= document.getElementById("addr").value;
	currentPage= 1;
	$('#tableBody').empty();
	if (userAddr.length != 0){
		if (userDate.length != 0){
			addressAndDate(userAddr, userDate);			
		}
		else{
			
			justAddress(userAddr);
		}	
	}	
	else if(zip.length != 0){
		console.log(zip);
		if(userDate.length != 0){
			zipAndDate(zip, userDate);			
		}
		else{
			justZip(zip);
		}
	}
	else if(userborough.length != 0){
		console.log(userborough);
		if(userDate.length != 0){
			boroughAndDate(userborough, userDate);
		}
		else{
			justBorough(userborough);
		}
	}
	else if(userDate.length != 0){
			justDate(userDate);
	}
	
}

function addressAndDate(addr, date){
	$('#tableBody').empty();
	outputLat= [];
	outputLong= [];	
	output= [];
	console.log(date);
	for (var i=0; i<onStreetName.length; i++){
		var s= ""+onStreetName[i]+"";
		var b= addr.toUpperCase();
		var a= s.indexOf(""+b+"");
		if(a > -1 && date==accidentDate[i]){
		output.push("<tr id=\""+i+"\"+style=\"display:none\"><td>"+accidentDate[i]+"</td><td>"+time[i]+"</td><td>"+onStreetName[i]+
			"</td><td>"+zipCode[i]+"</td><td>"+borough[i]+"</td><td>"+number_of_persons_injured[i]+"</td><td>"+number_of_persons_killed[i]
			+"</td><td>"+contributing_factor_vehicle1[i]+"</td><td>"+contributing_factor_vehicle2[i]+"</td><td>"+"</tr>");
			outputLat.push(latitude[i]);
			outputLong.push(longitude[i]);	
	
		}
	}
	changePage(1);
}

function justAddress(addr){
	output= [];
	outputLat= [];
	outputLong= [];
	for (var i=0; i<onStreetName.length; i++){
		var s= ""+onStreetName[i]+"";
		var b= addr.toUpperCase();
		var a= s.indexOf(""+b+"");
		if(a > -1){

			output.push("<tr id=\""+i+"\"+style=\"display:none\"><td>"+accidentDate[i]+"</td><td>"+time[i]+"</td><td>"+onStreetName[i]+
			"</td><td>"+zipCode[i]+"</td><td>"+borough[i]+"</td><td>"+number_of_persons_injured[i]+"</td><td>"+number_of_persons_killed[i]
			+"</td><td>"+contributing_factor_vehicle1[i]+"</td><td>"+contributing_factor_vehicle2[i]+"</td><td>"+"</tr>");
			outputLat.push(latitude[i]);
			outputLong.push(longitude[i]);	
		}
	}
	changePage(1);
}



function zipAndDate(zip, date){
	output= [];
	outputLat= [];
	outputLong= [];
	for (var i=0; i<zipCode.length; i++){
		var s= ""+zipCode[i]+"";
		var b= zip.toUpperCase();
		var a= s.indexOf(""+b+"");
		if(a > -1 && date==accidentDate[i]){
			output.push("<tr id=\""+i+"\"+style=\"display:none\"><td>"+accidentDate[i]+"</td><td>"+time[i]+"</td><td>"+onStreetName[i]+
			"</td><td>"+zipCode[i]+"</td><td>"+borough[i]+"</td><td>"+number_of_persons_injured[i]+"</td><td>"+number_of_persons_killed[i]
			+"</td><td>"+contributing_factor_vehicle1[i]+"</td><td>"+contributing_factor_vehicle2[i]+"</td><td>"+"</tr>");
			outputLat.push(latitude[i]);
			outputLong.push(longitude[i]);	
		}
	}
	changePage(1);

}
function justZip(zip){
	output= [];
	outputLat= [];
	outputLong= [];
	for (var i=0; i<zipCode.length; i++){
		var s= ""+zipCode[i]+"";
		var b= zip.toUpperCase();
		var a= s.indexOf(""+b+"");
		if(a > -1){

			output.push("<tr id=\""+i+"\"+style=\"display:none\"><td>"+accidentDate[i]+"</td><td>"+time[i]+"</td><td>"+onStreetName[i]+
			"</td><td>"+zipCode[i]+"</td><td>"+borough[i]+"</td><td>"+number_of_persons_injured[i]+"</td><td>"+number_of_persons_killed[i]
			+"</td><td>"+contributing_factor_vehicle1[i]+"</td><td>"+contributing_factor_vehicle2[i]+"</td><td>"+"</tr>");
			outputLat.push(latitude[i]);
			outputLong.push(longitude[i]);	
	
		}
	}
	changePage(1);

}
function boroughAndDate(userBorough, date){
	output= [];
	outputLat= [];
	outputLong= [];
	for (var i=0; i<borough.length; i++){
		var s= ""+borough[i]+"";
		var b= userBorough.toUpperCase();
		var a= s.indexOf(""+b+"");
		if(a > -1 && date==accidentDate[i]){
			output.push("<tr id=\""+i+"\"+style=\"display:none\"><td>"+accidentDate[i]+"</td><td>"+time[i]+"</td><td>"+onStreetName[i]+
			"</td><td>"+zipCode[i]+"</td><td>"+borough[i]+"</td><td>"+number_of_persons_injured[i]+"</td><td>"+number_of_persons_killed[i]
			+"</td><td>"+contributing_factor_vehicle1[i]+"</td><td>"+contributing_factor_vehicle2[i]+"</td><td>"+"</tr>");
			outputLat.push(latitude[i]);
			outputLong.push(longitude[i]);	
		}
		
	}
	changePage(1);
}
function justBorough(userBorough){
	output=[];
	outputLat= [];
	outputLong= [];
	var b= userBorough.toUpperCase();
	console.log(b);
	for (var i=0; i<borough.length; i++){
		var s= ""+borough[i]+"";
		
		var a= s.indexOf(""+b+"");
		
		if(a > -1){

			output.push("<tr id=\""+i+"\"+style=\"display:none\"><td>"+accidentDate[i]+"</td><td>"+time[i]+"</td><td>"+onStreetName[i]+
			"</td><td>"+zipCode[i]+"</td><td>"+borough[i]+"</td><td>"+number_of_persons_injured[i]+"</td><td>"+number_of_persons_killed[i]
			+"</td><td>"+contributing_factor_vehicle1[i]+"</td><td>"+contributing_factor_vehicle2[i]+"</td><td>"+"</tr>");
			outputLat.push(latitude[i]);
			outputLong.push(longitude[i]);	
	
		}
	}
	changePage(1);

}
function justDate(date){
	output= [];
	outputLat= [];
	outputLong= [];
	for (var i=0; i<accidentDate.length; i++){
			if(date==accidentDate[i]){

			output.push("<tr id=\""+i+"\"+style=\"display:none\"><td>"+accidentDate[i]+"</td><td>"+time[i]+"</td><td>"+onStreetName[i]+
			"</td><td>"+zipCode[i]+"</td><td>"+borough[i]+"</td><td>"+number_of_persons_injured[i]+"</td><td>"+number_of_persons_killed[i]
			+"</td><td>"+contributing_factor_vehicle1[i]+"</td><td>"+contributing_factor_vehicle2[i]+"</td><td>"+"</tr>");
			outputLat.push(latitude[i]);
			outputLong.push(longitude[i]);	
	
		}
	}
	changePage(1);

}

function changePage(pageNum){
	$('#tableBody').empty();

	currentPage= pageNum;
	if(output.length>0){
		totalPages= parseInt(output.length/10);
		if((output.length % 10) !=0 )
			totalPages++;
	}	
	else
		totalPages= 0;
	if(output.length >9){	
		for(var i=currentPage*10-10; i<currentPage*10; i++){
			if(i>=output.length)
				break;
			$("#tableBody").append(output[i]);
			outputLat2.push(outputLat[i]);
			outputLong2.push(outputLong[i]);
		}
	}
	else{
		for(var i=0; i<output.length; i++){
			$("#tableBody").append(output[i]);
			outputLat2.push(outputLat[i]);
			outputLong2.push(outputLong[i]);

		}	
	}
	dothis();
		
	paginate();

}



function paginate(){
	$('#pages').empty();
	if(totalPages<11){
		for( var i=1; i<=totalPages; i++){ 
			if(i==currentPage)
				$("#pages").append("<li class=\"disabled\" ><a href=\"#/\">"+i+"</a></li>");
			else
				$("#pages").append("<li onclick=\"changePage("+i+")\"><a href=\"#/\">"+i+"</a></li>");
		}	
	}
	else{
		if(currentPage<5){
			for( var i=1; i<=10; i++){ 
				if(i==currentPage)
					$("#pages").append("<li class=\"disabled\" ><a href=\"#/\">"+i+"</a></li>");
				else
					$("#pages").append("<li onclick=\"changePage("+i+")\"><a href=\"#/\">"+i+"</a></li>");
			}
		}	
		else if(currentPage+5>totalPages){
			for( var i=totalPages-9; i<=totalPages; i++){ 
				if(i==currentPage)
					$("#pages").append("<li class=\"disabled\" ><a href=\"#/\">"+i+"</a></li>");
				else
					$("#pages").append("<li onclick=\"changePage("+i+")\"><a href=\"#/\">"+i+"</a></li>");
			}

		}
		else{
			for( var i=currentPage-4; i<=currentPage+5; i++){ 
				if(i==currentPage)
					$("#pages").append("<li class=\"disabled\" ><a href=\"#/\">"+i+"</a></li>");
				else
					$("#pages").append("<li onclick=\"changePage("+i+")\"><a href=\"#/\">"+i+"</a></li>");
			}
		}
	}
}

function nextClick(){
	if(currentPage<totalPages)
		changePage(currentPage+1);
}
function prevClick(){
	if(currentPage>1)
		changePage(currentPage-1)
}
function firstClick(){
	changePage(1);
}
function lastClick(){
	changePage(totalPages);
}

function personsKilled(num, location)
 {
	if(killed.length == 0 || !killed[location])
	{
		killed[location]= parseInt(num); 
	}
	else if(killed[location])
	{
		killed[location]+= parseInt(num);
	}
 
 }

function personsInjured(num, location)
{
	if(injured.length == 0 || !injured[location])
	{
		injured[location]= parseInt(num); 
	}
	else if(injured[location])
	{
		injured[location]+= parseInt(num);
	}
} 
function accidents()
{
	for(var i=0; i < accidentDate.length; i++)
	{
		if(contributing_factor_vehicle1[i] == "undefined")
				{
					continue;
				}
				if(contributing_factor_vehicle2[i] == "undefined")
				{
					continue;
				}
				if(Object.keys(accidentReasons).length == 0)
				{
					accidentReasons[contributing_factor_vehicle1[i]]= 1;
					continue;
				}
				if(!accidentReasons.hasOwnProperty(contributing_factor_vehicle1[i]))
				{
					accidentReasons[contributing_factor_vehicle1[i]]= 1;
				}
				if(!accidentReasons.hasOwnProperty(contributing_factor_vehicle2[i]))
				{
					accidentReasons[contributing_factor_vehicle2[i]]= 1;
				}
				else if(accidentReasons.hasOwnProperty(contributing_factor_vehicle1[i]))
				{
					accidentReasons[contributing_factor_vehicle1[i]] +=1;
				}
				else if(accidentReasons.hasOwnProperty(contributing_factor_vehicle2[i]))
				{
					accidentReasons[contributing_factor_vehicle2[i]] +=1;
				}
			}
					sortJSON(accidentReasons);
	
}
function sortJSON(object) {
	var sortable=[];
  for (var element in object)
      sortable.push([element, object[element]])
	
	reasons= sortable.sort(function(a, b) {return a[1] - b[1]}).reverse();
}
