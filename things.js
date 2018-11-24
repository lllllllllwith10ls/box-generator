function choose(array) {
	return arr[Math.floor(Math.random()*arr.length)];
}

function Rand(min,max) {
	return parseFloat(Math.floor(Math.random()*(max-min+1)))+parseFloat(min);
}

var things = {};
var thingsN = 0;

class Thing {
	constructor(name,contains,namegen) {
		this.name=name;
		this.contains=contains;
		this.namegen=namegen;
		if (this.namegen==undefined) this.namegen=this.name;

		things[name]=this;
		thingsN++;
	}
}

function cleanThings()
{
	for (var iT in things)
	{
		var thisT=things[iT];

		var toConcat=[];
		for (var i in thisT.contains)
		{
			if (typeof(thisT.contains[i])=="string")
			{
				if (thisT.contains[i].charAt(0)==".")
				{
					if (things[thisT.contains[i].substring(1)]!=undefined)
					{
						toConcat=toConcat.concat(things[thisT.contains[i].substring(1)].contains);
					}
					thisT.contains[i]="";
				}
			}
		}

		if (toConcat.length>0)
		{
			for (var i in toConcat)
			{
				thisT.contains.push(toConcat[i]);
			}
		}

		var newContains=[];
		for (var i in thisT.contains)
		{
			if (thisT.contains[i]!="") newContains.push(thisT.contains[i]);
		}
		thisT.contains=newContains;
	}
}

var instances = [];
var instanceN = 0;
class Instance {
	constructor(what) {
		this.name="thing";
		this.type=things[what];
		this.parent=0;
		this.children=[];
		this.n=instanceN;
		this.display=false;
		this.grown=false;
		instanceN++;
		instances.push(this);
	}
}

Instance.prototype.Name = function() {
	this.name=this.type.namegen;

	if (typeof(this.name)!="string") {
		var str="";
		if (typeof(this.name[0])=="string") str+=Choose(this.name);
		else {
			for (var i in this.name) {
				str+=Choose(this.name[i]);
			}
		}
		this.name=str;
	}

	nameParts=this.name.split("|");
	this.name=nameParts[0];
	
	if (nameParts[1]!=undefined) this.name=this.name+nameParts[1];

}

Instance.prototype.Grow = function() {
	if (this.grown==false) {
		this.Name();
		for (var i in this.type.contains) {
			var toMake=this.type.contains[i];
			if (typeof(toMake)!="string") {
				toMake=Choose(toMake);
			}
			toMake=toMake.split(",");
			var makeAmount=1;
			var makeProb=100;
			if (toMake[1]==undefined) toMake[1]=1;
			else {
				
				for(var j = 0; j<toMake.length;j++) {
					var makeAmountArray=toMake[j].split("-");
					if (makeAmountArray[j]==undefined) makeAmount=makeAmountArray[0];
					else {
						makeAmount=Rand(makeAmountArray[0],makeAmountArray[1]);
					}
					var makeProbArray=(toMake[1]+"?").split("%");
					if (makeProb[1]!=undefined) {
						makeProb=makeProb[0];
					}
				}
			}

			if (things[toMake[0]]!=undefined) {
				if (Math.random()*100<=makeProb) {
					for (var ii=0;ii<makeAmount;ii++) {
						var New=Make(things[toMake[0]].name);
						New.parent=this;
						this.children.push(New);
					}
				}
			}

		}
		this.grown=true;
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
		document.getElementById("div"+this.n).innerHTML='<a href="javascript:Toggle('+this.n+');" style="padding-right:8px;" alt="archetype : '+(this.type.name)+'" title="archetype : '+(this.type.name)+'"><span class="arrow" id="arrow'+this.n+'">+</span> '+this.name+'</a><div id="container'+this.n+'" class="thing" style="display:none;'+addStyle+'">'+str+'</div>';
	}
	else document.getElementById("div"+this.n).innerHTML='<span class="emptyThing">'+this.name+'</span>';
}

function make(thing)
{
	return new Instance(thing);
}

function toggle(id)
{
	if (Instances[id].display==false)
	{

		for (var i in Instances[id].children)
		{
			if (Instances[id].children[i].grown==false) {
				Instances[id].children[i].Grow(0);
				Instances[id].children[i].List(0);
			}
		}


		Instances[id].display=false;
		document.getElementById("container"+id).style.display="block";
		document.getElementById("arrow"+id).innerHTML="-";
	}
	else if (Instances[id].display==true)
	{
		Instances[id].display=false;
		document.getElementById("container"+id).style.display="none";
		document.getElementById("arrow"+id).innerHTML="+";
	}
}

cleanThings();

new Thing("box",["altarca,25-30"]);
new Thing("altarca",["later"]);

new Thing("error",["rip"],"sorry, your object is not defined");
new Thing("later",["rip"],"not yet defined");
new Thing("rip",["consolation box"],"rip");
new Thing("consolation box",[".box"]);

function launchNest(what) {
	if (!things[what]) what="error";
	var Seed=make(what);
	Seed.Grow(0);
	Seed.List();
}

