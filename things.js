function choose(array) {
	return array[Math.floor(Math.random()*array.length)];
}

function Rand(min,max) {
	return parseFloat(Math.floor(Math.random()*(max-min+1)))+parseFloat(min);
}

function randomName(min,max) {
	var length = Rand(min,max);
	var consonantsInARow = 0;
	var vowelsInARow = 0;
	var consonants = ["b","c","d","f","g","h",'j','k','l','m','n','p','q','r','s','t','v','w','x','y','z'];
	var vowels = ['a','e','i','o','u',];
	var name = "";
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

class GenericThing {
	constructor(name,contains) {
		this.name = name;
		this.contains = contains;
		this.getInstance = function() {

			return new Instance(this.name,contains,this);
		}
	}
}

class Cosmology {
	constructor(name) {
		this.verseName = name + "verse";
		this.name = name + " altarca";
		this.size = Rand(4,8);
		var size = this.size;
		this.type = "cosmology";
		this.verses = [];
		this.size2 = Rand(2,4);
		for(size; size >= 0; size--) {
			this.verses[size] = new Verse(size,this.verseName,this);
		}
		this.getInstance = function() {

			return new Instance(this.name,[{
				object: this.verses[this.size],
				otherVars: [this.size2],
				amount: makeFunction(Rand,10,20)
			},{
				object: this.verses[this.size],
				otherVars: [this.size2-1],
				amount: makeFunction(Rand,25,40)
			}],this);
		}
	}
}

class Verse {
	constructor(tier,name,cosmology) {
		this.cosmology = cosmology;
		var tierNames = ["","multi-","mega-","giga-","tera-","peta-","exa-","zetta-","yotta-"];
		this.name = tierNames[tier] + name;
		this.type = "verse";
		this.tier = tier;
		this.getInstance = function(clusterSize) {
			var clusterNames = [""," cluster"," supercluster"," hypercluster"," ultracluster"]
			if(clusterSize > 0) {
				if(clusterSize === 1) {
					return new Instance(this.name + clusterNames[clusterSize],[{
						object: this,
						otherVars: [0],
						amount: makeFunction(Rand,10,20)
					}],this);
				} else {
					return new Instance(this.name + clusterNames[clusterSize],[{
						object: this,
						otherVars: [clusterSize-1],
						amount: makeFunction(Rand,10,20)
					},{
						object: this,
						otherVars: [clusterSize-2],
						amount: makeFunction(Rand,25,40)
					}],this);
				}
			} else {
				if(tier === 0) {
					return new Instance(this.name + clusterNames[clusterSize],[{
						object: consolationBox,
						amount: 1
					}],this);
				} else {
					var size = Rand(2,4);
					return new Instance(this.name + clusterNames[clusterSize],[{
						object: this.cosmology.verses[this.tier-1],
						otherVars: [size],
						amount: makeFunction(Rand,10,20)
					},{
						object: this.cosmology.verses[this.tier-1],
						otherVars: [size-1],
						amount: makeFunction(Rand,25,40)
					}],this);
				}
			}
		}
	}
}
var instances = [];
var instanceN = 0;
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
		var children = [];
		for (var i in this.children) {
			
			var makeAmount;
			if(this.children[i].amount instanceof Function) {
				makeAmount = this.children[i].amount();
			} else {
				makeAmount = this.children[i].amount;
			}
			for (var ii=0;ii<makeAmount;ii++) {
				var toMake=this.children[i].object;
			
				if (toMake === "Cosmology") {
					toMake = new Cosmology(randomName(3,10)).getInstance();;
				} else if (this.children[i].otherVars) {
					toMake = toMake.getInstance(...this.children[i].otherVars);
				} else {
					toMake = toMake.getInstance();
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
	var str="";
	for (var i in this.children)
	{
		str+='<div id="div'+this.children[i].n+'">'+this.children[i].name+'</div>';
	}
	if (this.children.length>0) {
		document.getElementById("div"+this.n).innerHTML='<a href="javascript:toggle('+this.n+');" style="padding-right:8px;" alt="archetype : '+(this.type.name)+'" title="archetype : '+(this.type.name)+'"><span class="arrow" id="arrow'+this.n+'">+</span> '+this.name+'</a><div id="container'+this.n+'" class="thing" style="display:none;'+'">'+str+'</div>';
	}
	else document.getElementById("div"+this.n).innerHTML='<span class="emptyThing">'+this.name+'</span>';
}

function toggle(id)
{
	if (instances[id].display==false)
	{

		for (var i in instances[id].children)
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

var box = new GenericThing("box",[{
	object: "Cosmology",
	amount: makeFunction(Rand,10,20)
}]);
var consolationBox = new GenericThing("sorry, have a box",[{
	object: "Cosmology",
	amount: makeFunction(Rand,10,20)
}]);

function launchNest(what) {
	var Seed=what.getInstance();
	Seed.Grow();
	Seed.List();
}














