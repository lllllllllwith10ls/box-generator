function choose(array) {
	return array[Math.floor(Math.random()*array.length)];
}

function Rand(min,max) {
	return parseFloat(Math.floor(Math.random()*(max-min+1)))+parseFloat(min);
}
function chance(prob) {
	return Math.random() > prob ? 1 : 0;
}

function randomName(min,max) {
	let length = Rand(min,max);
	let consonantsInARow = 0;
	let vowelsInARow = 0;
	let consonants = ["b","c","d","f","g","h",'j','k','l','m','n','p','q','r','s','t','v','w','x','y','z'];
	let vowels = ['a','e','i','o','u',];
	let name = "";
	for(length; length >= 0; length--) {
		if((Math.random() > 0.5 || consonantsInARow >= 2) && vowelsInARow < 2) {
			name += choose(vowels);
			vowelsInARow ++;
			consonantsInARow = 0;
		} else {
			name += choose(consonants);
			consonantsInARow ++;
			vowelsInARow = 0;
		}
	}
	return name;
}

function makeFunction(func,...theArgs) {
	return function(){ return func(...theArgs); };
}
let things = {};
class GenericThing {
	constructor(id,name,contains,type) {
		this.name = name;
		if(!type) {
			this.type = this.name;
		} else {
			this.type = type;
		}
		this.contains = contains;
		this.getInstance = function() {

			return new Instance(this.name,contains,this.type);
		}
		things[id] = this;
	}
}

function newCosmology() {
	name = "altarca";
	let size = Rand(4,8);
	let type = "cosmology";
		
	let size2 = Rand(2,5);
	return new Instance(name,[{
		object: newVerse,
		otherVars: [size,size2],
		amount: makeFunction(Rand,10,20)
	},{
		object: newVerse,
		otherVars: [size,size2-1],
		amount: makeFunction(Rand,20,40)
	}],type);
}
let tierNames = ["uni","multi","mega","giga","tera","peta","exa","zetta","yotta"];

function newVerse(tier, clusterSize, civ, civLevel=0) {
	let name = tierNames[tier] + "verse";
	let clusterNames = [""," cluster"," supercluster"," hypercluster"," ultracluster"," cohort"];
	let sizeNames = ["","","dwarf ","medium ","giant ","supergiant "];
	let verse = false;
	let clusterSize2 = clusterSize;
	if(clusterSize < 1) {
		clusterSize2 = Rand(2,5) + 1;
		verse = true;
	}
	if(verse) {
		tier--;
	}
	let otherVars = [];
	if(civ) {
		if(civ instanceof Array) {
			if(Math.random() > 0.8 && civ.length > 0) {
				otherVars.push(civ[Math.floor(Math.random()*civ.length)],Math.random()*2);
			} else {
				otherVars.push(null,0);
			}
		} else {
			if(Math.random() < 1 - Math.pow(0.5,civLevel)) {
				otherVars.push(civ,civLevel*(Math.random()*2+1));
			} else {
				otherVars.push(null,0);
			}
		}
	} else {
		civ = generateCivs();
		otherVars.push(civ,0);
	}
	let civName = otherVars[0] instanceof Civ ? otherVars[0].name + "ian " : "";
	if(tier < 0) {
		return new Instance(civName + name,[{
			object: consolationBox,
			amount: 1
		}],name);
	} else if(clusterSize2 === 1) {
		return new Instance(civName + name + clusterNames[clusterSize],[{
			object: newVerse,
			otherVars: [tier,clusterSize2-1].concat(otherVars),
			amount: makeFunction(Rand,10,20)
		}],name);
	} else if(clusterSize2 > 1) {
		let stuff = [{
			object: newVerse,
			otherVars: [tier,clusterSize2-1].concat(otherVars),
			amount: makeFunction(Rand,10,20)
		},{
			object: newVerse,
			otherVars: [tier,clusterSize2-2].concat(otherVars),
			amount: makeFunction(Rand,20,40)
		}];
		if(tier > 0) {
			stuff.push({
			object: newVerse,
			otherVars: [tier-1,5].concat(otherVars),
			amount: makeFunction(Rand,20,40)
			});
		}
		return new Instance(civName + (verse ? sizeNames[clusterSize2-1] : "") + name + clusterNames[clusterSize],stuff,name);
	}
}
function generateCivs() {
	let civs = [];
	while(true) {
		let number = Math.random();
		if(number < 0.05) {
			break;
		}
		if(number > 0.99) {
			civs.push(new Civ());
		}
	}
	return civs;
}
class Civ {
	constructor() {
		this.name = randomName(4,10);
		this.type = "civ";
		civils.push(this);
	}
}
let civils = [];
let instances = [];
let instanceN = 0;
class Instance {
	constructor(name,children,type) {
		this.name=name;
		this.type=type;
		this.parent=null;
		this.children=children;
		this.n=instanceN;
		this.display=false;
		this.grown=false;
		instanceN++;
		instances.push(this);
	}
}

Instance.prototype.Grow = function() {
	if (this.grown==false) {
		let children = [];
		for (let i in this.children) {
			
			let makeAmount;
			if(this.children[i].amount instanceof Function) {
				makeAmount = this.children[i].amount();
			} else {
				makeAmount = this.children[i].amount;
			}
			for (let ii=0;ii<makeAmount;ii++) {
				let toMake=this.children[i].object;

				if (toMake instanceof Function) {
					if(this.children[i].otherVars) {
						let otherVars = this.children[i].otherVars
						toMake = toMake(...otherVars);
					} else {
						toMake = toMake();
					}
				} else if(typeof toMake === "string") {
					toMake = getInstanceById(toMake);
				}
				children.push(toMake);
				toMake.parent = this;
			}
		}
		this.grown=true;
		this.children = children;
	}
}

Instance.prototype.List=function()
{
	let str="";
	for (let i in this.children)
	{
		str+='<div id="div'+this.children[i].n+'">'+this.children[i].name+'</div>';
	}
	if (this.children.length>0) {
		document.getElementById("div"+this.n).innerHTML='<a href="javascript:toggle('+this.n+');" style="padding-right:8px;" alt="archetype : '+(this.type)+'" title="archetype : '+(this.type)+'"><span class="arrow" id="arrow'+this.n+'">+</span> '+this.name+'</a><div id="container'+this.n+'" class="thing" style="display:none;'+'">'+str+'</div>';
	}
	else document.getElementById("div"+this.n).innerHTML='<span class="emptyThing">'+this.name+'</span>';
}

function toggle(id)
{
	if (instances[id].display==false)
	{

		for (let i in instances[id].children)
		{
			if (instances[id].children[i].grown==false) {
				instances[id].children[i].Grow(0);
				instances[id].children[i].List(0);
			}
		}


		instances[id].display=true;
		document.getElementById("container"+id).style.display="block";
		document.getElementById("arrow"+id).innerHTML="-";
	}
	else if (instances[id].display==true)
	{
		instances[id].display=false;
		document.getElementById("container"+id).style.display="none";
		document.getElementById("arrow"+id).innerHTML="+";
	}
}

function getInstanceById(thing) {
	return things[thing].getInstance();
}

let box = new GenericThing("box","box",[{
	object: "schemafield",
	amount: makeFunction(Rand,10,20)
}]);
let consolationBox = new GenericThing("consolationBox","not implemented, have a box",[{
	object: "schemafield",
	amount: makeFunction(Rand,10,20)
}],"consolation box");

let schemafield = new GenericThing("schemafield","schemafield",[{
	object: "stableSchemafield",
	amount: makeFunction(Rand,10,20)
},{
	object: "unstableSchemafield",
	amount: makeFunction(Rand,10,20)
},{
	object: "chaoticSchemafield",
	amount: makeFunction(Rand,10,20)
}]);
let stableSchemafield = new GenericThing("stableSchemafield","organized schemafield region",[{
	object: "patacosmology",
	amount: makeFunction(Rand,10,20)
},{
	object: "binaryfield",
	amount: makeFunction(Rand,10,20)
}],"schemafield section");
let unstableSchemafield = new GenericThing("unstableSchemafield","disorganized schemafield region",[{
	object: schemafieldThing,
	amount: makeFunction(Rand,20,30)
}],"schemafield section");

function schemafieldThing() {
	let make = choose(schemafieldContents);
	if(make === "altarca") {
		return newCosmology();
	} else if(make === "verse") {
		return newVerse(Rand(0,8),Rand(0,5));
	} else {
		return make.getInstance();
	}
}

let chaoticSchemafield = new GenericThing("chaoticSchemafield","chaotic schemafield region",[{
	object: "conceptSoup",
	amount: makeFunction(Rand,20,30)
}],"schemafield section");
let binaryfield = new GenericThing("binaryfield","binaryfield",[{
	object: schemafieldThing,
	amount: makeFunction(Rand,10,20)
},{
	object: "potatoverse",
	amount: 1
}]);



let patacosmology = new GenericThing("patacosmology","patacosmology",[{
	object: "patacosmology",
	amount: makeFunction(Rand,10,20)
},{
	object: "metacosmology",
	amount: makeFunction(chance,0.2)
}]);
let metacosmology = new GenericThing("metacosmology","metacosmology",[{
	object: newCosmology,
	amount: makeFunction(Rand,10,20)
},{
	object: "maiorverse",
	amount: makeFunction(Rand,0,4)
},{
	object: "metacosmology",
	amount: makeFunction(chance,0.2)
}]);

let maiorverse = new GenericThing("maiorverse","maiorverse",[{
	object: "selfverse",
	amount: makeFunction(Rand,10,20)
}]);

let selfverse = new GenericThing("selfverse","selfverse",[{
	object: "selfverse",
	amount: makeFunction(Rand,1,5)
},{
	object: newCosmology,
	amount: makeFunction(chance,0.2)
}]);


let conceptSoup = new GenericThing("conceptSoup","conceptual soup",[{
	object: "consolationBox",
	amount: 1
}]);
let potatoverse = new GenericThing("potatoverse","potatoverse",[{
	object: "potato",
	amount: makeFunction(Rand,10,20)
}]);
let potato = new GenericThing("potato","potato",[{
	object: "consolationBox",
	amount: 1
}],);



let schemafieldContents = [patacosmology, metacosmology, "altarca", "verse", "verse", binaryfield, maiorverse, selfverse];



function launchNest(what) {
	let Seed=what.getInstance();
	Seed.Grow();
	Seed.List();
}














