var readline = require('readline');
var fs = require('fs');

/*creating the readline stream variable*/
var f = readline.createInterface({
	input : fs.createReadStream('data/FoodFacts.csv')
});

function newFormatStack(country, sugar, salt){
	this.country = country;
	this.sugar = parseFloat(sugar)/stackCounter[country]['sugarCounter'];
	this.salt = parseFloat(salt)/stackCounter[country]['saltCounter'];
}

function newFormatLine(region, proteins, fat, carbohydrates){
	this.region = region;
	this.proteins = proteins / lineCounter[region]['proteinCounter'];
	this.fat = fat / lineCounter[region]['fatCounter'];
	this.carbohydrates = carbohydrates / lineCounter[region]['carbCounter'];
}

function reArrangeForStack(myObject){
	var keylist = Object.keys(myObject);
	var response = [];
	keylist.forEach(function(key){
		response.push(new newFormatStack(key, myObject[key]['sugar'], myObject[key]['salt']));
	})
	var stackLocal = {};
	stackLocal['data'] = response;
	return stackLocal;
}

function reArrangeForLine(category){
	var keylist = Object.keys(category);
	var response = {
		'fat' : [],
		'proteins' : [],
		'carbohydrates' : [],
	};
	keylist.forEach(function(key){
		var obj = new newFormatLine(key, category[key]['proteins'], category[key]['fat'], category[key]['carbohydrates']);
		var subkeys = Object.keys(response);
		subkeys.forEach(function(subkey){
			response[subkey].push({
				'region' : key,
				'value' : obj[subkey]
			})
		})
	})
	return response;
}

function addPfcStats(country, p, c, f){
	country = fStr(country);
	var key = getKey(country);
	if(key == "") return;
	category[key].add(key,p,c,f);
}

function fStr(str){
	str = str.trim();
	return str.replace(/\"/,'');
}

function addCountryData(country, sug, salt){
	country = fStr(country);
	if(stackCountries.indexOf(country) == -1){
		return;
	}
	else{
		if(finalObj[country] == undefined){
			finalObj[country] = new myObject();
		}
		finalObj[country].add(country, sug, salt);
	}
}

function getKey(country){
	//get the key from the country
	var res = "";
	for(keys in countryMap){
		if(countryMap.hasOwnProperty(keys) && countryMap[keys].indexOf(country)!=-1){
			res = keys;
			return res;
		}
	}
	return res;
}

function myObject(){
	this.sugar = 0;
	this.salt = 0;
	this.add = function(country, sugar, salt){
		sugar = toNumber(sugar);
		salt = toNumber(salt);
		if(sugar >= 0 ){
			stackCounter[country]['sugarCounter']++;
		}
		if(salt >= 0){
			stackCounter[country]['saltCounter']++;
		}
		sugar = (sugar < 0 ? 0 : sugar);
		salt = (salt < 0 ? 0 : salt);
		this.sugar += toNumber(sugar);
		this.salt += toNumber(salt);
	}
}

function toNumber(value){
	var ret = parseFloat(value);
	if(isNaN(ret)){
		return -1;
	}
	return ret;
}

var isFirst = true;
var finalObj = {};
var category = {};
var cIndex = 0;
var sugIndex = 0;
var saltIndex = 0;
var proteinIndex = 0;
var fatIndex = 0;
var carbIndex = 0;

var stackCountries = ["Netherlands", "Canada", "United Kingdom", "United States", "Australia", "France", "Germany", "Spain", "South Africa"];
var stackCounter = {};
var lineCounter = {};

var countryMap = {
	"North Europe" : ["United Kingdom", "Denmark", "Sweden", "Norway"],
	"Central Europe" : ["France", "Belgium", "Germany", "Switzerland", "Netherlands"],
	"South Europe" : ["Portugal", "Greece", "Italy", "Spain", "Croatia", "Albania"]
}

function fillStackCounter(){
	stackCountries.forEach(function(country){
		stackCounter[country] = {
			'sugarCounter' : 0,
			'saltCounter' : 0
		} ; //initialize it to a zero;
	});
}

function fillLineCounter(){
	var regions = Object.keys(countryMap);
	regions.forEach(function(region){
		lineCounter[region] = {
			'proteinCounter': 0,
			'fatCounter' : 0,
			'carbCounter' : 0
		}
	});
}

function stats(){
	this.proteins = 0; // p for add function
	this.fat = 0; // f fat add function
	this.carbohydrates = 0; //c for add function
	this.add = function(region, p, f, c){
		p = toNumber(p);
		f = toNumber(f);
		c = toNumber(c);
		if(p >= 0) {
			lineCounter[region]['proteinCounter']++;
		}
		if(c >= 0){
			lineCounter[region]['carbCounter']++;
		}
		if(f >= 0){
			lineCounter[region]['fatCounter']++;
		}
		p = ( p < 0 ? 0 : p);
		f = ( f < 0 ? 0 : f);
		c = ( c < 0 ? 0 : c);
		this.proteins += p;
		this.fat += f;
		this.carbohydrates += c;
	}
}

var category = {
	"North Europe" : new stats(),
	"Central Europe" : new stats(),
	"South Europe" : new stats()
}

f.on('line', function(line){
	if(isFirst == true){
		var arr = line.trim().split(',');
		qIndex = arr.indexOf('quantity');
		cIndex = arr.indexOf('countries_en');
		sugIndex = arr.indexOf('sugars_100g');
		saltIndex = arr.indexOf('salt_100g');
		proteinIndex = arr.indexOf('proteins_100g');
		fatIndex = arr.indexOf('fat_100g');
		carbIndex = arr.indexOf('carbohydrates_100g');
		isFirst = false;
		fillStackCounter(); //initialize the counter corresponding to each country for stack bar chart
		fillLineCounter(); //initialize the counter corresponding
	}
	else{
		var temp = line;
		var escape = /".*?"/g
		while((res = escape.exec(line))){
			temp = temp.replace(res[0], res[0].replace(/,/g,"@@"));
		}
		temp = temp.split(",");
		var country = temp[cIndex].trim();
		var regexReplace = /@@/g;
		country = country.split('@@');
		country.forEach(function(e){
			/*For the stack chart*/
			addCountryData(e, temp[sugIndex], temp[saltIndex]);
			/*For the line chart*/
			addPfcStats(e, temp[proteinIndex], temp[fatIndex], temp[carbIndex]);
		});
	}
});

f.on('close', function(){
	//Write data to the JSON files here
	//Re-arrange JSON to meet the D3 structure
	finalObjArr = reArrangeForStack(finalObj);
	categoryArr = reArrangeForLine(category);

	//make the folder json first
	fs.mkdir('output',"0777",function(err){
		if(err.code == "EEXIST" || err == null){
			fs.writeFileSync('output/stack.json', JSON.stringify(finalObjArr),'utf-8');
			fs.writeFileSync('output/line.json',JSON.stringify(categoryArr),'utf-8');
		}
	});
})
