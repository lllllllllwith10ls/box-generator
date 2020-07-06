function choose(array) {
	return array[Math.floor(Math.random()*array.length)];
}
function chooseWeighted(array) {
	let thing = array[Math.floor(Math.random()*array.length)];
  if(Math.random() > thing[1]) {
    return chooseWeighted(array);
  } else {
    thing.splice(1,2);
    return thing;
  }
}
function coin(chance) {
	return Math.random() < chance;
}
function Rand(min,max) {
	return parseFloat(Math.floor(Math.random()*(max-min+1)))+parseFloat(min);
}
function chance(prob) {
	return Math.random() < prob ? 1 : 0;
}
function rename(object, name) {
  object.name = name;
  return object;
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
	/*if(civ) {
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
	}*/
	let civName = /*otherVars[0] instanceof Civ ? otherVars[0].name + "ian " :*/ "";
	if(tier < 0) {
		return newUniverse();
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
/*function generateCivs() {
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
*/
function newUniverse() {
	name = "universe";
	let size = Rand(3,5);
	let type = "universe";
	
	return new Instance(name,[{
		object: galaxyCluster,
		otherVars: [size],
		amount: makeFunction(Rand,10,20)
	},{
    object: galaxyCluster,
    otherVars: [size,true],
    amount: makeFunction(Rand,15,30)
  },{
		object: galaxyCluster,
		otherVars: [size-1],
		amount: makeFunction(Rand,20,40)
	}],type);
}

function galaxyCluster(tier,dwarf) {
	let clusterNames = [""," cluster"," supercluster"," hypercluster"," ultracluster"," turtlie"];
	let name = "galaxy" + clusterNames[tier];
	if(name === "galaxy turtlie") {
		name = "turtlie";
	}
  name = (dwarf ? "dwarf " : "") + name;
	let type = "galaxy cluster";
	if(tier === 0 || Math.random() > 0.9) {
		return newSupergalaxy(tier,dwarf);
	}
	let stuff = [{
		object: galaxyCluster,
		otherVars: [tier-1],
		amount: makeFunction(Rand,dwarf ? 2 : 5,dwarf ? 5 : 10)
	},{
    object: galaxyCluster,
    otherVars: [tier-1,true],
    amount: makeFunction(Rand,dwarf ? 5 : 10,dwarf ? 10 : 20)
  }];
	if(tier > 1) {
		stuff.push({
      object: galaxyCluster,
      otherVars: [tier-2],
      amount: makeFunction(Rand,dwarf ? 5 : 10,dwarf ? 20 : 30)
    });
	}
	return new Instance(name,stuff,type);
}

function newSupergalaxy(tier,dwarf=false) {
	let galaxyNames = ["","super","hyper","ultra","meta","fractal "];
	let name = (dwarf ? "dwarf " : "") + galaxyNames[tier] + "galaxy";
	let type = "supergalaxy";
	if(tier === 0) {
		return newGalaxy(dwarf);
	}
	
	let stuff = [{
		object: galaxyCluster,
		otherVars: [tier-1],
		amount: makeFunction(Rand,dwarf ? 5 : 10,dwarf ? 10 : 20)
	},{
    object: galaxyCluster,
    otherVars: [tier-1,true],
    amount: makeFunction(Rand,dwarf ? 10 : 30,dwarf ? 20 : 40)
  }];
	if(tier > 1) {
		stuff.push({
			object: galaxyCluster,
			otherVars: [tier-2],
			amount: makeFunction(Rand,dwarf ? 10 : 20,dwarf ? 20 : 40)
		});
	}
	return new Instance(name,stuff,type);
}

function newGalaxy(dwarf) {
	let type = choose(["elliptical","spiral"]);
	if(dwarf) {
		type = choose(["irregular","elliptical","elliptical"]);
	}
	let name = (dwarf && type !== "irregular" ? "dwarf " : "") + type + " " + "galaxy";
	let type2 = (dwarf ? "dwarf " : "") + "galaxy";
	let startype = type == "spiral" ? "medium" : (type == "irregular" ? "young" : "old")
	let stuff = [{
		object: "galaxyCore",
		amount: 1
	}];
	if(type == "spiral") {
		stuff.push({
			object: "spiralArm",
			amount: makeFunction(Rand,2,5)
		},{
			object: galaxyHalo,
			amount: 1,
			otherVars: ["big"]
		});
	} else if(type == "elliptical" && !dwarf) {
		if(Math.random() > 2/3) {
			stuff.push({
				object: starBelt,
				amount: makeFunction(Rand,50,100),
				otherVars: [type]
			},{
				object: galaxyHalo,
				amount: 1,
				otherVars: ["huge"]
			});
		} else {
			stuff.push({
				object: starBelt,
				amount: makeFunction(Rand,10,20),
				otherVars: [type]
			},{
				object: galaxyHalo,
				amount: 1,
				otherVars: ["big"]
			});
		}
	} else if(dwarf) {
		stuff.push({
			object: starBelt,
			amount: makeFunction(Rand,2,5),
			otherVars: [type]
		});
		if(type == "elliptical") {
			stuff.push({
				object: galaxyHalo,
				amount: 1,
				otherVars: ["small"]
			});
		}
	}
	return new Instance(name,stuff,type2);
}
function starBelt(type) {
	return new Instance("star belt",[{
		object: starBubble,
		amount: makeFunction(Rand,5,10),
		otherVars: [type]
	}],"star belt");
}

function starBubble(type) {
	return new Instance("star bubble",[{
		object: starCloud,
		amount: makeFunction(Rand,10,20),
		otherVars: [type]
	}],"star bubble");
}
function starCloud(type) {
	return new Instance("star cloud",[{
		object: solarSystem,
		amount: makeFunction(Rand,20,50),
		otherVars: [type]
	}],"star cloud");
}
function galaxyHalo(size) {
	let rand = function() {};
	let rand2 = function() {};
	if(size == "small") {
		rand = makeFunction(Rand,2,5);
		rand2 = makeFunction(Rand,10,20);
	} else if(size == "big") {
		rand = makeFunction(Rand,5,10);
		rand2 = makeFunction(Rand,30,40);
	} else if(size == "huge") {
		rand = makeFunction(Rand,10,20);
		rand2 = makeFunction(Rand,50,75);
	} else if(size == "huge") {
		rand = makeFunction(Rand,1,1);
		rand2 = makeFunction(Rand,1,1);
	}	
	return new Instance("galactic halo",[{
		object: "globularCluster",
		amount: rand
	},{
		object: solarSystem,
		amount: rand2,
		otherVars: ["elliptical"]
	}],"galactic halo");
}

function solarSystem(galaxy) {
	let types =       ["O","B","A","F","G","K","M","red giant","red supergiant","brown dwarf","planemo","stellar remnant"];
	let proportions = [0  ,0  ,0  ,0  ,0  ,0  ,0  ,0          ,0               ,0            ,0        ,0];
	if(galaxy == "spiral") {
		proportions =   [0  ,1  ,3  ,5  ,10 ,20 ,30 ,55         ,59              ,60           ,75       ,95];
	} else if(galaxy == "elliptical") {
		proportions =   [0  ,0.2,1  ,2  ,5  ,7  ,15 ,20         ,50              ,70           ,80       ,90];
	} else if(galaxy == "irregular") {
		proportions =   [0  ,2  ,5  ,10 ,15 ,20 ,30 ,59         ,59.9            ,60           ,75       ,99];
	}
	let type = "";
	let num = Math.random()*100;
	for(let i = 0; i < types.length; i++) {
		if(i == types.length-1) {
			type = types[i];
			break;
		} else if(num < proportions[i+1] && num >= proportions[i]) {
			type = types[i];
			break;
		}
	}
	if(type == "stellar remnant") {
		let chance = Math.random();
		if(chance > 0.9) {
			type = "black hole";
		} else if(chance > 0.7) {
			type = "neutron star";
		} else {
			type = "white dwarf";
		}
	}
  let planets = generatePlanets(type);
	if(type.length == 1) {
		type += " main sequence star";
	}
  let stuff = [{
		object: star,
		amount: 1,
		otherVars: [type]
	}];
  stuff = stuff.concat(planets);
  if(type == "planemo") {
    return generatePlanet("far","planemo");
  } else {
    return new Instance(type + " solar system",stuff,"solar system");
  }
}

function star(type) {
	if(type == "brown dwarf") {
    return rename(gasGiant(Math.random()> 0.9 ? "cool" : "cold"), "brown dwarf");
  }
  if(type == "neutron star") {
    return new Instance(type,[{
      object: "neutronStarCrust",
      amount: 1
    },{
      object: "neutronStarMantle",
      amount: 1
    },{
      object: "neutronStarCore",
      amount: 1
    }],"star");
  }
  if(type == "white dwarf") {
    return new Instance(type,[{
      object: "electronDegenerateMatter",
      amount: makeFunction(Rand,200,300)
    }],"star");
  }
  if(type == "black hole") {
    return new Instance(type,[{
      object: "consolationBox",
      amount: 1
    }],"star");
  }
  return new Instance(type,[{
    object: "starCorona",
    amount: 1
  },{
    object: starLayer,
    amount: 1,
    otherVars: ["convective zone"]
  },{
    object: starLayer,
    amount: 1,
    otherVars: ["radiative zone"]
  },{
    object: starLayer,
    amount: 1,
    otherVars: ["core"]
  }],"star");
}
function starLayer(name) {
  return new Instance(name,[{
    object: "plasma",
    amount: makeFunction(Rand,80,100),
  }],"star layer");
}
function generatePlanets(star) {
  let systems =      ["inner","outer"    ,"far"];
	let proportions =  [0      ,0          ,0];
  switch(star) {
    case "O":
      proportions =  [0      ,Rand(80,85),Rand(85,90)];
      break;
    case "B":
      proportions =  [0      ,Rand(50,75),Rand(75,80)];
      break;
    case "A":
      proportions =  [0      ,Rand(40,50),Rand(60,75)];
      break;
    case "F":
      proportions =  [0      ,Rand(30,45),Rand(55,65)];
      break;
    case "G":
      proportions =  [0      ,Rand(20,35),Rand(50,55)];
      break;
    case "K":
      proportions =  [0      ,Rand(10,25),Rand(40,50)];
      break;
    case "M":
      proportions =  [0      ,Rand(2,5)  ,Rand(25,40)];
      break;
    case "red giant":
      proportions =  [0      ,Rand(60,65),Rand(70,80)];
      break;
    case "red supergiant":
      proportions =  [0      ,Rand(80,90),Rand(95,99)];
      break;
    case "brown dwarf":
      proportions =  [0      ,0          ,1];
      break;
    case "planemo":
      proportions =  [0      ,0          ,0];
      break;
    case "white dwarf":
      proportions =  [0      ,0          ,Rand(5,10)];
      break;
    case "neutron star":
      proportions =  [0      ,0          ,Rand(2,5)];
      break;
    case "black hole":
      proportions =  [0      ,Rand(2,5)  ,Rand(10,15)];
      break;
  }
  let planets = [];
  let planetNum = Rand(0,10);
  for(let i = 0; i < planetNum; i++) { 
    let system = "";
    let num = Math.random()*100;
    for(let i = 0; i < systems.length; i++) {
      if(i == systems.length-1) {
        system = systems[i];
        break;
      } else if(num < proportions[i+1] && num >= proportions[i]) {
        system = systems[i];
        break;
      }
    }
    planets.push({
      object: generatePlanet,
      amount: 1,
      otherVars: [system,star]
    });
  }
  return planets;
}
function generatePlanet(system,star) {
  let num = Math.random()*100;
  switch(star) {
    case "O":
      num += 30;
      break;
    case "B":
      num += 20;
      break;
    case "A":
      num += 10;
      break;
    case "K":
      num -= 10;
      break;
    case "M":
      num -= 15;
      break;
    case "red giant":
      num += 25;
      break;
    case "red supergiant":
      num += 40;
      break;
    case "brown dwarf":
      num -= 10;
      break;
    case "planemo":
      num -= 30;
      break;
    case "white dwarf":
      num -= 10;
      break;
    case "neutron star":
      num += 10;
      break;
    case "black hole":
      num += 20;
      break;
  }
  let temp = "null";
  let types =      ["asteroid","dwarf","terrestrial","superterrestrial","jovial"];
	if(system == "inner") {
		proportions =  [0          ,10    ,30           ,80                ,90];
    if(num > 70) {
      temp = "scorched";
    } else if(num > 50) {
      temp = "hot";
    } else if(num > 30) {
      temp = "warm";
    } else {
      temp = "temperate";
    }
	} else if(system == "outer") {
		proportions =  [0          ,10    ,30           ,40                ,60];
    if(num > 60) {
      temp = "cool";
    } else if(num > 20) {
      temp = "cold";
    } else {
      temp = "frozen";
    }
  } else if(system == "far") {
		proportions =  [0          ,20    ,60           ,70                ,90]
    if(num > 90) {
      temp = "cold";
    } else {
      temp = "frozen";
    };
	}
  let type = "";
  num = Math.random()*100;
  for(let i = 0; i < types.length; i++) {
    if(i == types.length-1) {
      type = types[i];
      break;
    } else if(num < proportions[i+1] && num >= proportions[i]) {
      type = types[i];
      break;
    }
  }
  if(type === "asteroid") {
    return new Instance(temp + " asteroid belt",[{
      object: asteroid,
      amount: makeFunction(Rand,100,200),
      otherVars: [temp],
    }],"asteroid belt");
  } else if(type === "dwarf") {
    return dwarf(temp);
  } else if(type === "terrestrial") {
    return terraPlanet(temp);
  } else if(type === "superterrestrial") {
    return superEarth(temp);
  } else if(type === "jovial") {
    return gasGiant(temp);
  }
}
function asteroid(temp, moon) {
  let types =       ["molten","metallic","rocky","icy"];
	let proportions = [0       ,0         ,0      ,0];
	switch(temp) {
    case "scorched":
      proportions = [0       ,60        ,90     ,100];
      break;
    case "hot":
      proportions = [0       ,40        ,80     ,100];
      break;
    case "warm":
    case "temperate":
      proportions = [0       ,0         ,30     ,100];
      break;
    case "cool":
      proportions = [0       ,0         ,30     ,90];
      break;
    case "cold":
      proportions = [0       ,0         ,20     ,40];
      break;
    case "frozen":
      proportions = [0       ,0         ,10     ,20];
      break;
	}
  let type = "";
  let num = Math.random()*100;
  for(let i = 0; i < types.length; i++) {
    if(i == types.length-1) {
      type = types[i];
      break;
    } else if(num < proportions[i+1] && num >= proportions[i]) {
      type = types[i];
      break;
    }
  }
  amount = Rand(50,100);
  let stuff = [];
  for(let i = 0; i < amount; i++) {
    if(type === "metallic") {
      stuff.push({
        object: Math.random() > 0.5 ? "ironChunk" : "nickelChunk",
        amount: 1,
      });
    } else if(type === "molten") {
      stuff.push({
        object: Math.random() > 0.1 ? "lava" : (Math.random() > 0.5 ? "ironChunk" : "nickelChunk"),
        amount: 1,
      });
    } else if(type === "rocky") {
      stuff.push({
        object: "rock",
        amount: 1,
      });
    } else if(type === "icy") {
      stuff.push({
        object: Math.random() > 0.1 ? "ice" : "rock",
        amount: 1,
      });
    }
  }
	return new Instance(temp + " asteroid" + (moon ? " moon" : ""),stuff,"asteroid");
}
function dwarf(temp, moon) {
  let hasAtmosphere = false;
  if(Math.random() * 100 > 30 && temp !== "frozen") {
    hasAtmosphere = true;
  }
  let lifeStuff = oceansAndLife(temp,hasAtmosphere);
  let lifeType = lifeStuff[1];
  let species = lifeStuff[2];
  stuff = [{
    object: crust,
		amount: 1,
    otherVars: [temp,"small",lifeStuff],
  },{
    object: mantle,
		amount: 1,
    otherVars: ["small"],
  },{
    object: core,
		amount: 1,
    otherVars: ["small"],
  }]
  if(hasAtmosphere) {
    stuff.push({
      object: atmosphere,
      amount: 1,
      otherVars: [temp,"small"],
    });
  }
  let name = "";
  if(!moon) {
    name = "dwarf planet";
    let num = Math.random() * 100;
    if(num > 90) {
      stuff.push({
        object: dwarf,
        amount: 1,
        otherVars: [temp,true],
      },{
        object: asteroid,
        amount: makeFunction(Rand,0,6),
        otherVars: [temp,true],
      });
    } else if(num > 80) {
      stuff.push({
        object: asteroid,
        amount: makeFunction(Rand,0,4),
        otherVars: [temp,true],
      });
    } else if(num > 50) {
      stuff.push({
        object: asteroid,
        amount: makeFunction(Rand,0,2),
        otherVars: [temp,true],
      });
    }
  } else {
    name = "small moon";
  }
	return new Instance(temp + " " + name + (lifeType !== "none" ? " with " + lifeType : ""),stuff,moon ? "dwarf planet" : "moon");
}
function terraPlanet(temp,moon) {
	let hasAtmosphere = false;
  if(Math.random() * 100 > 30 && temp !== "frozen") {
    hasAtmosphere = true;
  }
  let lifeStuff = oceansAndLife(temp,hasAtmosphere);
  let lifeType = lifeStuff[1];
  let species = lifeStuff[2];
  stuff = [{
    object: crust,
		amount: 1,
    otherVars: [temp,"medium",lifeStuff],
  },{
    object: mantle,
		amount: 1,
    otherVars: ["medium"],
  },{
    object: core,
		amount: 1,
    otherVars: ["medium"],
  }]
  if(hasAtmosphere) {
    stuff.push({
      object: atmosphere,
      amount: 1,
      otherVars: [temp,"medium"],
    });
  }
  let name = "";
  if(!moon) {
    name = "terrestrial planet";
    let num = Math.random() * 100;
    if(num > 80) {
      stuff.push({
        object: dwarf,
        amount: 1,
        otherVars: [temp,true],
      },{
        object: asteroid,
        amount: makeFunction(Rand,0,5),
        otherVars: [temp,true],
      });
    } else if(num > 40) {
      stuff.push({
        object: asteroid,
        amount: makeFunction(Rand,0,6),
        otherVars: [temp,true],
      });
    }
  } else {
    name = "large moon";
  }
  return new Instance(temp + " " + name + (lifeType !== "none" ? " with " + lifeType : ""),stuff,moon ? "terrestrial planet" : "moon");
}
function superEarth(temp,moon) {
	
	
  let lifeStuff = oceansAndLife(temp,true);
  let lifeType = lifeStuff[1];
  let species = lifeStuff[2];
  stuff = [{
    object: crust,
		amount: 1,
    otherVars: [temp,"large",lifeStuff],
  },{
    object: mantle,
		amount: 1,
    otherVars: ["large"],
  },{
    object: core,
		amount: 1,
    otherVars: ["large"],
  }]
  if(temp !== "frozen") {
    stuff.push({
      object: atmosphere,
      amount: 1,
      otherVars: [temp,"large"],
    });
  }
  let name = "";
  if(!moon) {
    name = "super earth";
    let num = Math.random() * 100;
    if(num > 90) {
      stuff.push({
        object: terraPlanet,
        amount: 1,
        otherVars: [temp,true],
      },{
        object: dwarf,
        amount: makeFunction(Rand,0,2),
        otherVars: [temp,true],
      },{
        object: asteroid,
        amount: makeFunction(Rand,0,5),
        otherVars: [temp,true],
      });
    } else if(num > 60) {
      stuff.push({
        object: dwarf,
        amount: makeFunction(Rand,0,5),
        otherVars: [temp,true],
      },{
        object: asteroid,
        amount: makeFunction(Rand,0,4),
        otherVars: [temp,true],
      });
    } else if(num > 20) {
      stuff.push({
        object: asteroid,
        amount: makeFunction(Rand,0,10),
        otherVars: [temp,true],
      });
    }
  } else {
    name = "large moon";
  }
  return new Instance(temp + " " + name + (lifeType !== "none" ? " with " + lifeType : ""),stuff,moon ? "super earth" : "moon");
}
function oceansAndLife(temp,hasAtmosphere) {
  
  let oceans = false;
  let oceanType = "";
  switch(temp) {
    case "scorched":
      oceans = true;
      oceanType = "lavaOcean";
      break;
    case "hot":
      if(Math.random() > 0.8 && hasAtmosphere)oceans = true;
      oceanType = "lavaOcean";
      break;
    case "warm":
      if(Math.random() > 0.5 && hasAtmosphere)oceans = true;
      oceanType = "waterOcean";
      break;
    case "temperate":
      if(Math.random() > 0.3 && hasAtmosphere)oceans = true;
      oceanType = "waterOcean";
      break;
    case "cool":
      if(Math.random() > 0.4 && hasAtmosphere)oceans = true;
      oceanType = "waterOcean";
      break;
    case "cold":
      if(Math.random() > 0.7 && hasAtmosphere)oceans = true;
      oceanType = "coldOcean";
      break;
    case "frozen":
      oceans = false;
      break;
  }
  let life = false;
  let lifeType = "none";
  let species = [];
  if(Math.random() < 0.8 && oceanType === "waterOcean" && oceans) {
    life = true;
    lifeType = "proto-life";
    if(Math.random() < 0.8) {
      life = true;
      lifeType = "prokaryotic life";
      species = generateLife(lifeType);
    }
    if(Math.random() < 0.6) {
      life = true;
      lifeType = "eukaryotic life";
      species = generateLife(lifeType);
    }
    if(Math.random() < 0.6) {
      life = true;
      lifeType = "multicellular life";
      species = generateLife(lifeType);
    }
    if(Math.random() < 0.4) {
      life = true;
      lifeType = "terrestrial life";
      species = generateLife(lifeType);
    }
  }
  return [oceanType,lifeType,species];
}
function generateLife(type) {
  let result = {};
  if(type === "prokaryotic life" || type === "eukaryotic life" || type === "multicellular life" || type === "terrestrial life") {
    result.bacteriophages = [];
    for(let i = 0; i < 1000; i++) {
      result.bacteriophages.push(new Virus());
    }
    result.prokaryotes = [];
    for(let i = 0; i < 200; i++) {
      result.prokaryotes.push(new Prokaryote(result));
    }
  }
  if(type === "eukaryotic life" || type === "multicellular life" || type === "terrestrial life") {
    result.protistViruses = [];
    for(let i = 0; i < 1000; i++) {
      result.protistViruses.push(new Virus());
    }
    result.protists = [];
    for(let i = 0; i < 200; i++) {
      result.protists.push(new Eukaryote(result));
    }
  }
  if(type === "multicellular life" || type === "terrestrial life") {
    result.viruses = [];
    for(let i = 0; i < 1000; i++) {
      result.viruses.push(new Virus());
    }
    result.animals = [];
    for(let i = 0; i < 200; i++) {
      result.animals.push(new Animal(result));
    }
    result.plants = [];
    for(let i = 0; i < 200; i++) {
      result.plants.push(new Plant(result));
    }
  }
  return result;
}
function gasGiant(temp) {
  stuff = [{
    object: jovialAtmosphere,
		amount: 1,
    otherVars: [temp],
  },{
    object: jovialMantle,
		amount: 1,
  },{
    object: core,
		amount: 1,
    otherVars: ["massive"],
  }]
  let name = "gas giant";
  let num = Math.random() * 100;
  if(num > 90) {
    stuff.push({
      object: superEarth,
      amount: 1,
      otherVars: [temp,true],
    },{
      object: dwarf,
      amount: makeFunction(Rand,0,5),
      otherVars: [temp,true],
    },{
      object: asteroid,
      amount: makeFunction(Rand,0,10),
      otherVars: [temp,true],
    });
  } else if(num > 70) {
    stuff.push({
      object: terraPlanet,
      amount: makeFunction(Rand,0,5),
      otherVars: [temp,true],
    },{
      object: dwarf,
      amount: makeFunction(Rand,0,5),
      otherVars: [temp,true],
    },{
      object: asteroid,
      amount: makeFunction(Rand,0,20),
      otherVars: [temp,true],
    });
  } else if(num > 50) {
    stuff.push({
      object: dwarf,
      amount: makeFunction(Rand,0,10),
      otherVars: [temp,true],
    },{
      object: asteroid,
      amount: makeFunction(Rand,0,50),
      otherVars: [temp,true],
    });
  } else if(num > 30) {
    stuff.push({
      object: dwarf,
      amount: makeFunction(Rand,0,5),
      otherVars: [temp,true],
    },{
      object: asteroid,
      amount: makeFunction(Rand,0,100),
      otherVars: [temp,true],
    });
  } else if(num > 10) {
    stuff.push({
      object: asteroid,
      amount: makeFunction(Rand,0,20),
      otherVars: [temp,true],
    });
  }
  return new Instance(temp + " gas giant",stuff,"gas giant");
}
function core(size) {
  let amount = 0;
  switch(size) {
    case "massive":
      amount = 100;
      break;
    case "large":
      amount = 75;
      break;
    case "medium":
      amount = 50;
      break;
    case "small":
      amount = 25;
      break;
  }
  amount = Rand(Math.floor(amount/2),amount);
  let stuff = [];
  for(let i = 0; i < amount; i++) {
    stuff.push({
      object: Math.random() > 0.5 ? "ironChunk" : "nickelChunk",
      amount: 1,
    });
  }
  return new Instance("core",stuff,"core");
}
function mantle(size) {
  let amount = 0;
  switch(size) {
    case "large":
      amount = 100;
      break;
    case "medium":
      amount = 75;
      break;
    case "small":
      amount = 50;
      break;
  }
  amount = Rand(Math.floor(amount/2),amount);
  let stuff = [];
  for(let i = 0; i < amount; i++) {
    stuff.push({
      object: "lava",
      amount: 1,
    });
  }
  return new Instance("mantle",stuff,"mantle");
}

function jovialMantle() {
  let amount = Rand(75,125);
  let stuff = [];
  for(let i = 0; i < amount; i++) {
    stuff.push(choose([{
      object: "liquidHydrogen",
      amount: 1,
    },{
      object: "liquidHelium",
      amount: 1,
    },{
      object: "methaneDrop",
      amount: 1,
    },{
      object: "diamond",
      amount: makeFunction(chance,0.2),
    }]));
  }
  return new Instance("mantle",stuff,"mantle");
}
function atmosphere(temp,size) {
  let amount = 0;
  switch(size) {
    case "large":
      amount = 100;
      break;
    case "medium":
      amount = 75;
      break;
    case "small":
      amount = 50;
      break;
  }
  let types =       ["sodiumVapor","carbonDioxide","waterCloud","nitrogenCloud","argonCloud","methaneCloud"];
	let proportions = [0            ,0              ,0           ,0              ,0           ,0];
	switch(temp) {
    case "scorched":
      proportions = [0            ,70             ,90          ,90             ,95          ,100];
      break;
    case "hot":
      proportions = [0            ,50             ,70          ,75             ,85          ,100];
      break;
    case "warm":
      proportions = [0            ,20             ,50          ,65             ,85          ,95];
      break;
    case "temperate":
      proportions = [0            ,10             ,40          ,65             ,85          ,95];
      break;
    case "cool":
      proportions = [0            ,0              ,10          ,25             ,35          ,50];
      break;
    case "cold":
      proportions = [0            ,0              ,0           ,20             ,30          ,40];
      break;
	}
  let stuff = [];
  amount = Rand(Math.floor(amount/2),amount);
  for(let j = 0; j < amount; j++) {
    let type = "";
    let num = Math.random()*100;
    for(let i = 0; i < types.length; i++) {
      if(i == types.length-1) {
        type = types[i];
        break;
      } else if(num < proportions[i+1] && num >= proportions[i]) {
        type = types[i];
        break;
      }
    }
    stuff.push({
      object: type,
      amount: 1,
    });
  }
  return new Instance("atmosphere",stuff,"atmosphere");
}

function jovialAtmosphere(temp) {
  let types =       ["sodiumVapor","methaneCloud","hydrogenCloud","heliumCloud","waterCloud"];
	let proportions = [0            ,0             ,0              ,0            ,0];
	switch(temp) {
    case "scorched":
      proportions = [0            ,45            ,50             ,55           ,100];
      break;
    case "hot":
      proportions = [0            ,10            ,20             ,60           ,90];
      break;
    case "warm":
    case "temperate":
      proportions = [0            ,0             ,10             ,60           ,80];
      break;
    case "cool":
      proportions = [0            ,0             ,30             ,60           ,80];
      break;
    case "cold":
      proportions = [0            ,0             ,30             ,60           ,70];
      break;
    case "frozen":
      proportions = [0            ,0             ,50             ,75           ,80];
      break;
	}
  let stuff = [];
  let amount = Rand(75,125);
  for(let j = 0; j < amount; j++) {
    let type = "";
    let num = Math.random()*100;
    for(let i = 0; i < types.length; i++) {
      if(i == types.length-1) {
        type = types[i];
        break;
      } else if(num < proportions[i+1] && num >= proportions[i]) {
        type = types[i];
        break;
      }
    }
    stuff.push({
      object: type,
      amount: 1,
    });
  }
  return new Instance("atmosphere",stuff,"atmosphere");
}
function crust(temp,size,lifeStuff) {
  let oceans = lifeStuff[0];
  let lifeType = lifeStuff[1];
  let species = lifeStuff[2];
  
  let amount = 0;
  switch(size) {
    case "large":
      amount = 25;
      break;
    case "medium":
      amount = 10;
      break;
    case "small":
      amount = 5;
      break;
  }
  let amount1 = Rand(Math.floor(amount/2),amount);
  let stuff = [];
  
  for(let i = 0; i < amount1; i++) {
    stuff.push({
      object: landmass,
      amount: 1,
      otherVars: [temp,Rand(25,40),oceans !== "",lifeType,species],
    });
  }
  if(oceans !== "") {
    let amount2 = Rand(Math.floor(amount/2),amount);
    for(let i = 0; i < amount2; i++) {
      stuff.push({
        object: ocean,
        amount: 1,
        otherVars: [oceans,temp,lifeType,species],
      });
    }
  }
  return new Instance("crust",stuff,temp + " crust");
}
function landmass(temp,amount,lakes,life,species) {
  let lakeType = "lavaLake";
  let stuff = [];
  switch(temp) {
    case "scorched":
      lakeType = "lavaLake";
      stuff.push(["volcano",0.1],["lava",1],["rock",0.5]);
      break;
    case "hot":
      lakeType = "lavaLake";
      stuff.push(["volcano",0.1],["lava",0.5],["rock",1]);
      break;
    case "warm":
      lakeType = "waterLake";
      stuff.push(["volcano",0.1],["mountain",0.1],["lava",0.1],["rock",1]);
      break;
    case "temperate":
      lakeType = "waterLake";
      stuff.push(["volcano",0.05],["mountain",0.1],["rock",1]);
      break;
    case "cool":
      lakeType = "waterLake";
      stuff.push(["mountain",0.1],["rock",1],["ice",1]);
      break;
    case "cold":
      lakeType = "coldLake";
      stuff.push(["cryovolcano",0.1],["iceMountain",0.1],["rock",0.5],["ice",1]);
      break;
    case "frozen":
      oceans = false;
      stuff.push(["iceMountain",0.1],["ice",0.5],["solidAir",1]);
      break;
  }
  if(lakes) {
    stuff.push([lakeType,0.2]);
  }
  let stuff2 = [];
  if(life === "terrestrial life") {
    water = protistWater;
    beach = protistShore;
    otherVars = [new Ecosystem(species,life)];
    ecosystem = new BigEcosystem(species,life);
    for(let i = 0; i < Rand(20,100); i++) {
      let thing = ecosystem.choose();
      
      stuff2.push({
        object: function() {return thing.getInstance()},
        amount: 1,
      });
    }
  }
  for(let i = 0; i < amount; i++) {
    let thing = chooseWeighted(stuff);
    if(thing[0] === "waterLake" && life === "terrestrial life") {       
      otherVars = [new Ecosystem(species,life),new BigEcosystem(species,life)];
      stuff2.push({
        object: lifeLake,
        amount: 1,
        otherVars: otherVars,
      });
    } else if(thing[0] === "rock" && life === "terrestrial life") {     
      otherVars = [new Ecosystem(species,life)]; 
      stuff2.push({
        object: protistRock,
        amount: 1,
        otherVars: otherVars,
      });
    } else if(thing[0] === "mountain" && life === "terrestrial life") { 
      otherVars = [new Ecosystem(species,life),new BigEcosystem(species,life)];
      stuff2.push({
        object: lifeMountain,
        amount: 1,
        otherVars: otherVars,
      });
    }
    stuff2.push({
      object: thing[0],
      amount: 1,
    });
  }
  return new Instance("landmass",stuff2,temp + " landmass");
}


function ocean(type,temp,life,species) {
  let stuff = [];
  name = "";
  if(type === "lavaOcean") {
    name = "lava ";
    stuff.push({
      object: "volcano",
      amount: makeFunction(Rand,3,4),
    },{
      object: "lavaShore",
      amount: makeFunction(Rand,3,4),
    },{
      object: "rockberg",
      amount: (temp === "hot") ? makeFunction(Rand,3,4) : 0,
    },{
      object: "lava",
      amount: makeFunction(Rand,200,500),
    });
  } else if(type === "waterOcean") {
    name = "water ";
    let water = "saltWater";
    let beach = "shore";
    let otherVars = [];
    if(life === "proto-life") {
      water = "protoLifeWater";
    }
    if(life === "prokaryotic life") {
      water = bacterialWater;
      beach = bacteriaShore;
      otherVars = [new Ecosystem(species,life)];
    } else if(life === "eukaryotic life") {
      water = protistWater;
      beach = protistShore;
      otherVars = [new Ecosystem(species,life)];
    } else if(life === "multicellular life" || life === "terrestrial life") {
      water = protistWater;
      beach = protistShore;
      otherVars = [new Ecosystem(species,life)];
      ecosystem = new BigEcosystem(species,life);
      for(let i = 0; i < Rand(20,100); i++) {
        let thing = ecosystem.choose();
        
        stuff.push({
          object: function() {return thing.getInstance()},
          amount: 1,
        });
      }
    }
    stuff.push({
      object: "mountain",
      amount: makeFunction(Rand,3,4),
    },{
      object: "hydrothermalVent",
      amount: makeFunction(Rand,3,4),
    },{
      object: beach,
      amount: makeFunction(Rand,3,4),
      otherVars: otherVars,
    },{
      object: "iceberg",
      amount: (temp === "cool") ? makeFunction(Rand,3,4) : 0,
    },{
      object: water,
      amount: makeFunction(Rand,200,500),
      otherVars: otherVars,
    });
  } else {
    name = "methane ";
    stuff.push({
      object: "iceMountain",
      amount: makeFunction(Rand,3,4),
    },{
      object: "cryovent",
      amount: makeFunction(Rand,3,4),
    },{
      object: "coldShore",
      amount: makeFunction(Rand,3,4),
    },{
      object: "methaneDrop",
      amount: makeFunction(Rand,200,500),
    });
  }
  return new Instance(name + "ocean",stuff,name + "ocean");
}


function bacterialWater(species) {
  let stuff = [];
  for(let i = 0; i < Rand(20,100); i++) {
    let thing = species.choose();
    
    stuff.push({
      object: function() {return thing.getInstance()},
      amount: 1,
    });
  }
  stuff.push({
    object: "waterMolecule",
    amount: makeFunction(Rand,50,100),
  },{
    object: "saltMolecule",
    amount: makeFunction(Rand,2,3),
  });
  return new Instance("salt water drop",stuff,"salt water drop");
}


function protistWater(species) {
  let stuff = [];
  for(let i = 0; i < Rand(50,200); i++) {
    let thing = species.choose();
    
    stuff.push({
      object: function() {return thing.getInstance()},
      amount: 1,
    });
  }
  stuff.push({
    object: "waterMolecule",
    amount: makeFunction(Rand,50,100),
  },{
    object: "saltMolecule",
    amount: makeFunction(Rand,2,3),
  });
  return new Instance("salt water drop",stuff,"salt water drop");
}

function protistRock(species) {
  let stuff = [];
  for(let i = 0; i < Rand(50,200); i++) {
    let thing = species.choose();
    
    stuff.push({
      object: function() {return thing.getInstance()},
      amount: 1,
    });
  }
  stuff.push({
    object: "siliconDioxide",
    amount: makeFunction(Rand,50,100),
  },{
    object: "ironOxide",
    amount: makeFunction(Rand,20,50),
  },{
    object: "magnesiumOxide",
    amount: makeFunction(Rand,10,25),
  },{
    object: "aluminumOxide",
    amount: makeFunction(Rand,40,60),
  },{
    object: "calciumOxide",
    amount: makeFunction(Rand,20,50),
  });
  return new Instance("rock",stuff,"rock");
}


function protistShore(species) {
  return new Instance("shore",[{
    object: "sand",
    amount: makeFunction(Rand,50,70),
  },{
    object: protistWater,
    amount: makeFunction(Rand,20,30),
    otherVars: [species],
  },"shore"],);
}


function lifeLake(smallEcosystem,bigEcosystem) {
  let stuff = [];
  for(let i = 0; i < Rand(10,20); i++) {
    let thing = bigEcosystem.choose();
    
    stuff.push({
      object: function() {return thing.getInstance()},
      amount: 1,
    });
  }
  stuff.push({
    object: protistWater,
    amount: makeFunction(Rand,50,100),
    otherVars: [smallEcosystem],
  });
  return new Instance("water lake",stuff,"water lake");
}

function lifeMountain(smallEcosystem,bigEcosystem) {
  let stuff = [];
  for(let i = 0; i < Rand(10,20); i++) {
    let thing = bigEcosystem.choose();
    
    stuff.push({
      object: function() {return thing.getInstance()},
      amount: 1,
    });
  }
  stuff.push({
    object: protistRock,
    amount: makeFunction(Rand,50,100),
    otherVars: [smallEcosystem],
  });
  return new Instance("mountain",stuff,"mountain");
}


class Ecosystem {
  constructor(species,lifeType) {
    this.lifeType = lifeType;
    if(lifeType === "prokaryotic life" || lifeType === "eukaryotic life" || lifeType === "multicellular life" || lifeType === "terrestrial life") {
      let primary = [choose(species.prokaryotes)];
      if(Math.random() < 0.3) {
        primary.push(choose(species.prokaryotes))
      }
      let secondary = [];
      for(let i = 0; i < Rand(2,4); i++) {
        secondary.push(choose(species.prokaryotes));
      }
      let tertiary = [];
      for(let i = 0; i < Rand(10,20); i++) {
        tertiary.push(choose(species.prokaryotes));
      }
      this.bacteria = {
        primary: primary,
        secondary: secondary,
        tertiary: tertiary,
      };
      this.bacteriophages = {
        primary: [],
        secondary: [],
        tertiary: [],
      };
      
      for(let i = 0; i < this.bacteria.primary.length; i++) {
        this.bacteriophages.primary = this.bacteriophages.primary.concat(this.bacteria.primary[i].viruses);
      }
      
      for(let i = 0; i < this.bacteria.secondary.length; i++) {
        this.bacteriophages.secondary = this.bacteriophages.secondary.concat(this.bacteria.secondary[i].viruses);
      }
      
      for(let i = 0; i < this.bacteria.tertiary.length; i++) {
        this.bacteriophages.tertiary = this.bacteriophages.tertiary.concat(this.bacteria.tertiary[i].viruses);
      }
    }
    if(lifeType === "eukaryotic life" || lifeType === "multicellular life" || lifeType === "terrestrial life") {
      let primary = [choose(species.protists)];
      if(Math.random() < 0.3) {
        primary.push(choose(species.protists))
      }
      let secondary = [];
      for(let i = 0; i < Rand(2,4); i++) {
        secondary.push(choose(species.protists));
      }
      let tertiary = [];
      for(let i = 0; i < Rand(10,20); i++) {
        tertiary.push(choose(species.protists));
      }
      this.protists = {
        primary: primary,
        secondary: secondary,
        tertiary: tertiary,
      };
      this.protistViruses = {
        primary: [],
        secondary: [],
        tertiary: [],
      };
      
      for(let i = 0; i < this.protists.primary.length; i++) {
        this.protistViruses.primary = this.protistViruses.primary.concat(this.protists.primary[i].viruses);
      }
      
      for(let i = 0; i < this.protists.secondary.length; i++) {
        this.protistViruses.secondary = this.protistViruses.secondary.concat(this.protists.secondary[i].viruses);
      }
      
      for(let i = 0; i < this.protists.tertiary.length; i++) {
        this.protistViruses.tertiary = this.protistViruses.tertiary.concat(this.protists.tertiary[i].viruses);
      }
    }
  }
  choose() {
    if(this.lifeType === "prokaryotic life") {
      if(Math.random() < 0.4) {
        if(Math.random() < 0.6) {
          return choose(this.bacteria.primary);
        } else if(Math.random() < 0.8) {
          return choose(this.bacteria.secondary);
        } else {
          return choose(this.bacteria.tertiary);
        }
      } else {
        if(Math.random() < 0.6) {
          return choose(this.bacteriophages.primary);
        } else if(Math.random() < 0.8) {
          return choose(this.bacteriophages.secondary);
        } else {
          return choose(this.bacteriophages.tertiary);
        }
      }
    } else if(this.lifeType === "eukaryotic life" || this.lifeType === "multicellular life" || this.lifeType === "terrestrial life") {
      if(Math.random() < 0.4) {
        if(Math.random() < 0.4) {
          if(Math.random() < 0.6) {
            return choose(this.bacteria.primary);
          } else if(Math.random() < 0.8) {
            return choose(this.bacteria.secondary);
          } else {
            return choose(this.bacteria.tertiary);
          }
        } else {
          if(Math.random() < 0.6) {
            return choose(this.bacteriophages.primary);
          } else if(Math.random() < 0.8) {
            return choose(this.bacteriophages.secondary);
          } else {
            return choose(this.bacteriophages.tertiary);
          }
        }
      } else {
        if(Math.random() < 0.4) {
          if(Math.random() < 0.6) {
            return choose(this.protists.primary);
          } else if(Math.random() < 0.8) {
            return choose(this.protists.secondary);
          } else {
            return choose(this.protists.tertiary);
          }
        } else {
          if(Math.random() < 0.6) {
            return choose(this.protistViruses.primary);
          } else if(Math.random() < 0.8) {
            return choose(this.protistViruses.secondary);
          } else {
            return choose(this.protistViruses.tertiary);
          }
        }
      }
    }
  }
}
class BigEcosystem {
  constructor(species,lifeType) {
    this.lifeType = lifeType;
    let primary = [choose(species.plants)];
    if(Math.random() < 0.3) {
      primary.push(choose(species.plants))
    }
    let secondary = [];
    for(let i = 0; i < Rand(2,4); i++) {
      secondary.push(choose(species.plants));
    }
    let tertiary = [];
    for(let i = 0; i < Rand(10,20); i++) {
      tertiary.push(choose(species.plants));
    }
    this.plants = {
      primary: primary,
      secondary: secondary,
      tertiary: tertiary,
    };
    primary = [choose(species.animals)];
    if(Math.random() < 0.3) {
      primary.push(choose(species.animals))
    }
    secondary = [];
    for(let i = 0; i < Rand(2,4); i++) {
      secondary.push(choose(species.animals));
    }
    tertiary = [];
    for(let i = 0; i < Rand(10,20); i++) {
      tertiary.push(choose(species.animals));
    }
    this.animals = {
      primary: primary,
      secondary: secondary,
      tertiary: tertiary,
    };
  }
  choose() {
    if(Math.random() < 0.5) {
      if(Math.random() < 0.6) {
        return choose(this.plants.primary);
      } else if(Math.random() < 0.8) {
        return choose(this.plants.secondary);
      } else {
        return choose(this.plants.tertiary);
      }
    } else {
      if(Math.random() < 0.6) {
        return choose(this.animals.primary);
      } else if(Math.random() < 0.8) {
        return choose(this.animals.secondary);
      } else {
        return choose(this.animals.tertiary);
      }
    }
  }
}
function protoLife() {
  let choose = [[rnaNucleotide,0.75],["lipidBubble",0.75],["rnaFragment",0.5],["polypeptide",0.5],["protoCell",0.1]];
  let thing = chooseWeighted(choose)[0];
  if(typeof thing === "string") {
    return getInstanceById(thing);
  } else {
    return thing();
  }
}
function rnaNucleotide(base) {
  if(!base) {
    base = choose(["adenine","guanine","cytosine","uracil"]);
  }
  return new Instance(base + " nucleotide",[{
    object: base,
    amount: 1,
  },{
    object: "phosphate",
    amount: 1,
  },{
    object: "ribose",
    amount: 1,
  }],"nucleotide");
}
function dnaNucleotide(base) {
  if(!base) {
    base = choose(["adenine","guanine","cytosine","thymine"]);
  }
  return new Instance(base + " nucleotide",[{
    object: base,
    amount: 1,
  },{
    object: "phosphate",
    amount: 1,
  },{
    object: "deoxyribose",
    amount: 1,
  }],"nucleotide");
}
function aminoAcid() {
  let amino = choose(["alanine","arginine","asparagine","asparticAcid","cysteine","glutamine","glutamicAcid","glycine","histadine","isoleucine","leucine","lysine","methionine","phenylalanine","proline","serine","threonine","tryptophan","tyrosine","valine"]);
  return getInstanceById(amino);
}

function makeDNA(length) {
  let dna = [];
  for(let i = 0; i < length; i++) {
    dna.push(choose(["adenine","guanine","cytosine","thymine"]));
  }
  return dna;
}
function makeRNA(length) {
  let rna = [];
  for(let i = 0; i < length; i++) {
    rna.push(choose(["adenine","guanine","cytosine","uracil"]));
  }
  return rna;
}
function makeProtein(length) {
  let protein = [];
  for(let i = 0; i < length; i++) {
    protein.push(choose(["alanine","arginine","asparagine","asparticAcid","cysteine","glutamine","glutamicAcid","glycine","histadine","isoleucine","leucine","lysine","methionine","phenylalanine","proline","serine","threonine","tryptophan","tyrosine","valine"]));
  }
  return protein;
}
class Lifeform {
  constructor() {
    this.name = randomName(6,20) + " " + randomName(6,20);
  }
}

class Prokaryote extends Lifeform {
  constructor(stuff) {
    super();
    let viruses = stuff.bacteriophages;
    this.viruses = [];
    for(let i = 0; i < Rand(3,10); i++) {
      this.viruses.push(choose(viruses));
    }
    this.type = "bacterium";
    this.generated = false;
  }
  generate() {
    this.hasPlasmids = Math.random() > 0.5 ? false : true;
    this.proteins = [];
    for(let i = 0; i < Rand(4,8); i++) {
      this.proteins.push(makeProtein(Rand(20,50)));
    }
    this.organelles = [];
    for(let i = 0; i < Rand(4,8); i++) {
      this.organelles.push(new Organelle());
    }
    this.membraneProteins = [];
    for(let i = 0; i < Rand(4,8); i++) {
      this.membraneProteins.push(makeProtein(Rand(20,50)));
    }
    this.genome = makeDNA(Rand(100,200));
    if(this.hasPlasmids) {
      this.plasmids = []
      for(let i = 0; i < Rand(4,8); i++) {
        this.plasmids.push(makeDNA(Rand(10,25)));
      }
    }
    this.generated = true;
  }
  getInstance() {
    if(!this.generated) {
      this.generate();
    }
    let thing = this;
    let stuff = [{
      object: thought,
      otherVars: [bacteriaThought],
      amount: makeFunction(chance,0.1),
    },{
      object: function() {return thing.cellMembrane()},
      amount: 1,
    },{
      object: function() {return thing.protein("proteins")},
      amount: makeFunction(Rand,10,20),
    },{
      object: function() {return choose(thing.organelles).getInstance()},
      amount: makeFunction(Rand,5,10),
    },{
      object: function() {return thing.dna()},
      amount: 1,
    }]
    if(this.hasPlasmids) {
      stuff.push({
        object: function() {return thing.plasmid()},
        amount: makeFunction(Rand,1,5),
      });
    }
    if(Math.random() < 0.2) {
      let thingy = choose(thing.viruses);
      stuff.push({
        object: function() {return rename(thingy.geneticCode(),"viral genome (" + thingy.name + ")")},
        amount: makeFunction(Rand,1,3),
      },{
        object: function() {
          if(Math.random() > 0.5) {
            return rename(thingy.protein("proteins"),"viral protein")
          } else {
            return rename(thingy.protein("capsidProteins"),"viral protein")
          }
        },
        amount: makeFunction(Rand,5,10),
      },{
        object: function() {return thingy.getInstance()},
        amount: makeFunction(Rand,3,8),
      });
    }
    return new Instance(this.name + " (" + this.type + ")",stuff,this.type);
  }
  cellMembrane() {
    if(!this.generated) {
      this.generate();
    }
    let thing = this;
    return new Instance("cell membrane",[{
      object: "phospholipid",
      amount: makeFunction(Rand,50,100),
    },{
      object: function() {return thing.protein("membraneProteins")},
      amount: makeFunction(Rand,2,5),
    }],"cell membrane");
  }
  protein(type) {
    if(!this.generated) {
      this.generate();
    }
    let stuff = choose(this[type]);
    let stuff2 = [];
    for(let i = 0; i < stuff.length; i++) {
      stuff2.push({
        object: stuff[i],
        amount: 1,
      });
    }
    return new Instance("protein",stuff2,"protein");
  }
  dna() {
    if(!this.generated) {
      this.generate();
    }
    let stuff = this.genome;
    let stuff2 = [];
    for(let i = 0; i < stuff.length; i++) {
        
      stuff2.push({
        object: dnaNucleotide,
        amount: 1,
        otherVars: [stuff[i]],
      });
    }
    return new Instance("DNA",stuff2,"DNA");
  }
  plasmid() {
    if(!this.generated) {
      this.generate();
    }
    let stuff = choose(this.plasmids);
    let stuff2 = [];
    
    for(let i = 0; i < stuff.length; i++) {
      stuff2.push({
        object: dnaNucleotide,
        amount: 1,
        otherVars: [stuff[i]],
      });
    }
    return new Instance("plasmid",stuff2,"plasmid");
  }
}


class Virus extends Lifeform {
  constructor() {
    super();
    this.type = "virus";
  }
  generate() {
    this.rna = Math.random() > 0.5 ? true : false;
    this.proteins = [];
    for(let i = 0; i < Rand(4,8); i++) {
      this.proteins.push(makeProtein(Rand(20,50)));
    }
    this.capsidProteins = [];
    for(let i = 0; i < Rand(4,8); i++) {
      this.capsidProteins.push(makeProtein(Rand(20,50)));
    }
    if(this.rna) {
      this.genome = makeRNA(Rand(25,50));
    } else {
      this.genome = makeDNA(Rand(25,50));
    }
    this.generated = true;
  }
  getInstance() {
    if(!this.generated) {
      this.generate();
    }
    let thing = this;
    let stuff = [{
      object: thought,
      otherVars: [virusThought],
      amount: makeFunction(chance,0.1),
    },{
      object: function() {return thing.capsid()},
      amount: 1,
    },{
      object: function() {return thing.protein("proteins")},
      amount: makeFunction(Rand,10,20),
    },{
      object: function() {return thing.geneticCode()},
      amount: 1,
    }]
    return new Instance(this.name + " (" + this.type + ")",stuff,this.type);
  }
  capsid() {
    if(!this.generated) {
      this.generate();
    }
    let thing = this;
    return new Instance("capsid",[{
      object: function() {return thing.protein("capsidProteins")},
      amount: makeFunction(Rand,20,50),
    }],"capsid");
  }
  protein(type) {
    if(!this.generated) {
      this.generate();
    }
    let stuff = choose(this[type]);
    let stuff2 = [];
    for(let i = 0; i < stuff.length; i++) {
      stuff2.push({
        object: stuff[i],
        amount: 1,
      });
    }
    return new Instance("protein",stuff2,"protein");
  }
  geneticCode() {
    if(!this.generated) {
      this.generate();
    }
    let stuff = this.genome;
    if(this.RNA) {
      let stuff2 = [];
      for(let i = 0; i < stuff.length; i++) {
          
        stuff2.push({
          object: rnaNucleotide,
          amount: 1,
          otherVars: [stuff[i]],
        });
      }
      return new Instance("RNA",stuff2,"RNA");
    } else {
      let stuff2 = [];
      for(let i = 0; i < stuff.length; i++) {
          
        stuff2.push({
          object: dnaNucleotide,
          amount: 1,
          otherVars: [stuff[i]],
        });
      }
      return new Instance("DNA",stuff2,"DNA");
    }
  }
}


class Eukaryote extends Lifeform {
  constructor(stuff) {
    super();
    let viruses = stuff.protistViruses;
    this.viruses = [];
    for(let i = 0; i < Rand(3,10); i++) {
      this.viruses.push(choose(viruses));
    }
    this.type = "protist";
    this.generated = false;
  }
  generate() {
    this.proteins = [];
    for(let i = 0; i < Rand(10,20); i++) {
      this.proteins.push(makeProtein(Rand(20,50)));
    }
    this.organelles = [];
    for(let i = 0; i < Rand(10,20); i++) {
      this.organelles.push(new Organelle());
    }
    for(let i = 0; i < Rand(10,20); i++) {
      this.organelles.push(new MembraneBoundOrganelle());
    }
    this.membraneProteins = [];
    for(let i = 0; i < Rand(10,20); i++) {
      this.membraneProteins.push(makeProtein(Rand(20,50)));
    }
    this.genome = makeDNA(Rand(200,500));
    this.nucleus = new Nucleus(this.genome);
    this.generated = true;
  }
  getInstance() {
    if(!this.generated) {
      this.generate();
    }
    let thing = this;
    let stuff = [{
      object: thought,
      otherVars: [protistThought],
      amount: makeFunction(chance,0.1),
    },{
      object: function() {return thing.cellMembrane()},
      amount: 1,
    },{
      object: function() {return thing.protein("proteins")},
      amount: makeFunction(Rand,20,30),
    },{
      object: function() {return choose(thing.organelles).getInstance()},
      amount: makeFunction(Rand,10,20),
    },{
      object: function() {return thing.nucleus.getInstance()},
      amount: 1,
    }]
    if(Math.random() < 0.2) {
      let thingy = choose(thing.viruses);
      stuff.push({
        object: function() {return rename(thingy.geneticCode(),"viral genome (" + thingy.name + ")")},
        amount: makeFunction(Rand,1,3),
      },{
        object: function() {
          if(Math.random() > 0.5) {
            return rename(thingy.protein("proteins"),"viral protein")
          } else {
            return rename(thingy.protein("capsidProteins"),"viral protein")
          }
        },
        amount: makeFunction(Rand,5,10),
      },{
        object: function() {return thingy.getInstance()},
        amount: makeFunction(Rand,3,8),
      });
    }
    return new Instance(this.name + " (" + this.type + ")",stuff,this.type);
  }
  cellMembrane() {
    if(!this.generated) {
      this.generate();
    }
    let thing = this;
    return new Instance("cell membrane",[{
      object: "phospholipid",
      amount: makeFunction(Rand,50,100),
    },{
      object: function() {return thing.protein("membraneProteins")},
      amount: makeFunction(Rand,2,5),
    }],"cell membrane");
  }
  protein(type) {
    if(!this.generated) {
      this.generate();
    }
    let stuff = choose(this[type]);
    let stuff2 = [];
    for(let i = 0; i < stuff.length; i++) {
      stuff2.push({
        object: stuff[i],
        amount: 1,
      });
    }
    return new Instance("protein",stuff2,"protein");
  }
}

class Organelle {
  constructor() {
    this.type = "organelle";
    this.generated = false;
  }
  generate() {
    this.proteins = [];
    for(let i = 0; i < Rand(4,8); i++) {
      this.proteins.push(makeProtein(Rand(20,50)));
    }
    this.generated = true;
  }
  getInstance() {
    if(!this.generated) {
      this.generate();
    }
    let thing = this;
    let stuff = [{
      object: function() {return thing.protein()},
      amount: makeFunction(Rand,10,20),
    }]
    return new Instance(this.type,stuff,this.type);
  }
  protein() {
    if(!this.generated) {
      this.generate();
    }
    let stuff = choose(this.proteins);
    let stuff2 = [];
    for(let i = 0; i < stuff.length; i++) {
      stuff2.push({
        object: stuff[i],
        amount: 1,
      });
    }
    return new Instance("protein",stuff2,"protein");
  }
}
class MembraneBoundOrganelle {
  constructor() {
    this.type = "organelle";
    this.generated = false;
  }
  generate() {
    this.proteins = [];
    this.membraneProteins = [];
    for(let i = 0; i < Rand(10,20); i++) {
      this.proteins.push(makeProtein(Rand(20,50)));
    }
    for(let i = 0; i < Rand(10,20); i++) {
      this.membraneProteins.push(makeProtein(Rand(20,50)));
    }
    if(Math.random() > 0.7) {
      this.hasDna = true;
      this.genome = makeDNA(Rand(20,30));
    }
    this.membraneCount = Rand(1,3);
    this.generated = true;
  }
  getInstance() {
    if(!this.generated) {
      this.generate();
    }
    let thing = this;
    let stuff = [{
      object: function() {return thing.membrane()},
      amount: thing.membraneCount,
    },{
      object: function() {return thing.protein("proteins")},
      amount: makeFunction(Rand,10,20),
    }]
    if(this.hasDna) {
      stuff.push({
        object: function() {return thing.dna()},
        amount: 1,
      });
    }
    return new Instance(this.type,stuff,this.type);
  }
  protein(type) {
    if(!this.generated) {
      this.generate();
    }
    let stuff = choose(this[type]);
    let stuff2 = [];
    for(let i = 0; i < stuff.length; i++) {
      stuff2.push({
        object: stuff[i],
        amount: 1,
      });
    }
    return new Instance("protein",stuff2,"protein");
  }
  dna() {
    if(!this.generated) {
      this.generate();
    }
    let stuff = this.genome;
    let stuff2 = [];
    for(let i = 0; i < stuff.length; i++) {
        
      stuff2.push({
        object: dnaNucleotide,
        amount: 1,
        otherVars: [stuff[i]],
      });
    }
    return new Instance("DNA",stuff2,"DNA");
  }
  membrane() {
    if(!this.generated) {
      this.generate();
    }
    let thing = this;
    return new Instance(this.type + " membrane",[{
      object: "phospholipid",
      amount: makeFunction(Rand,50,100),
    },{
      object: function() {return thing.protein("membraneProteins")},
      amount: makeFunction(Rand,2,5),
    }],this.type + " membrane");
  }
}


class Nucleus extends MembraneBoundOrganelle {
  constructor(genome) {
    super();
    this.type = "nucleus";
    this.genome2 = genome;
  }
  generate() {
    super.generate();
    this.hasDna = true;
    this.genome = this.genome2;
    this.membraneCount = 1;
    this.generated = true;
  }
}

class Organ extends Lifeform {
  constructor(stuff,genome) {
    super();
    let pathogens = stuff.viruses.concat(stuff.prokaryotes).concat(stuff.protists);
    this.pathogens = [];
    for(let i = 0; i < Rand(5,20); i++) {
      this.pathogens.push(choose(pathogens));
    }
    this.type = "organ";
    this.genome = genome;
    this.stuff = stuff;
    this.generated = false;
  }
  generate() {
    this.tissues = [];
    for(let i = 0; i < Rand(2,5); i++) {
      this.tissues.push(new Tissue(this.stuff,this.genome));
    }
    this.generated = true;
  }
  getInstance() {
    if(!this.generated) {
      this.generate();
    }
    let pathogen = choose(this.pathogens);
    let thing = this;
    let stuff = [];
    if(Math.random() < 0.2) {
      stuff = [{
        object: function() {return choose(thing.tissues).getInstance(pathogen)},
        amount: makeFunction(Rand,10,20),
      }];
    } else {
      stuff = [{
        object: function() {return choose(thing.tissues).getInstance()},
        amount: makeFunction(Rand,10,20),
      }];
    }
    return new Instance(this.type,stuff,this.type);
  }
}
class Tissue extends Lifeform {
  constructor(stuff, genome) {
    super();
    let pathogens = stuff.viruses.concat(stuff.prokaryotes).concat(stuff.protists);
    this.pathogens = [];
    for(let i = 0; i < Rand(5,20); i++) {
      this.pathogens.push(choose(pathogens));
    }
    this.type = "tissue";
    this.generated = false;
    this.genome = genome;
    this.stuff = stuff;
  }
  generate() {
    this.cellTypes = [];
    this.cells = [];
    for(let i = 0; i < Rand(1,3); i++) {
      this.cells.push(new TissueCell(this.stuff,this.genome));
    }
  }
  getInstance(pathogen) {
    if(!this.generated) {
      this.generate();
    }
    let stuff = [];
    let thing = this;
    let infected = Math.random() > 0.2;
    if(pathogen instanceof Virus && infected) {
      stuff.push({
        object: function() {return choose(thing.cells).getInstance(pathogen)},
        amount: makeFunction(Rand,10,20),
      });
    } else {
      stuff.push({
        object: function() {return choose(thing.cells).getInstance()},
        amount: makeFunction(Rand,10,20),
      });
    }
    if(pathogen && infected) {
      stuff.push({
        object: function() {return pathogen.getInstance()},
        amount: makeFunction(Rand,20,30),
      });
    }
    return new Instance(this.type,stuff,this.type);
  }
}

class TissueCell extends Eukaryote {
  constructor(stuff,genome) {
    super(stuff);
    this.viruses = [];
    this.type = "cell";
    this.genome2 = genome;
    this.generated = false;
  }
  generate() {
    super.generate();
    this.genome = this.genome2;
    this.nucleus = new Nucleus(this.genome);
  }
  getInstance(pathogen) {
    if(!this.generated) {
      this.generate();
    }
    let thing = this;
    let stuff = [{
      object: thought,
      otherVars: [tissueCellThought],
      amount: makeFunction(chance,0.1),
    },{
      object: function() {return thing.cellMembrane()},
      amount: 1,
    },{
      object: function() {return thing.protein("proteins")},
      amount: makeFunction(Rand,20,30),
    },{
      object: function() {return choose(thing.organelles).getInstance()},
      amount: makeFunction(Rand,10,20),
    },{
      object: function() {return thing.nucleus.getInstance()},
      amount: 1,
    }]
    if(pathogen) {
      let thingy = pathogen;
      stuff.push({
        object: function() {return rename(thingy.geneticCode(),"viral genome (" + thingy.name + ")")},
        amount: makeFunction(Rand,1,3),
      },{
        object: function() {
          if(Math.random() > 0.5) {
            return rename(thingy.protein("proteins"),"viral protein")
          } else {
            return rename(thingy.protein("capsidProteins"),"viral protein")
          }
        },
        amount: makeFunction(Rand,5,10),
      },{
        object: function() {return thingy.getInstance()},
        amount: makeFunction(Rand,3,8),
      });
    }
    return new Instance(this.type,stuff,this.type);
  }
}

class Animal extends Lifeform {
  constructor(stuff) {
    super();
    this.stuff = stuff;
    this.type = "animal";
    this.generated = false;
  }
  generate() {
    this.genome = makeDNA(Rand(200,500));
    this.skin = new Organ(this.stuff,this.genome);
    
    this.stomach = new Organ(this.stuff,this.genome);
    this.intestines = new Organ(this.stuff,this.genome);
    
    this.heart = new Organ(this.stuff,this.genome);
    
    if(Math.random() > 0.5) {
      this.brain = new Organ(this.stuff,this.genome);
    } else {
      this.ganglia = [];
      for(let i = 0; i < Rand(2,5); i++) {
        this.ganglia.push(new Organ(this.stuff,this.genome));
      }
    }
    
    this.limbCount = Rand(0,5);
    this.limb = new Organ(this.stuff,this.genome);
    
    this.generated = true;
  }
  getInstance() {
    if(!this.generated) {
      this.generate();
    }
    let stuff = [{
      object: thought,
      otherVars: [animalThought],
      amount: makeFunction(chance,1),
    }];
    let thing = this;
    if(this.brain) {
      stuff.push({
        object: function() {return rename(thing.brain.getInstance(),"brain")},
        amount: 1,
      });
    } else {
      for(let i = 0; i < this.ganglia.length; i++) {
        stuff.push({
          object: function() {return rename(thing.ganglia[i].getInstance(),"ganglion")},
          amount: 1,
        });
      }
    }
    stuff.push({
      object: function() {return rename(thing.skin.getInstance(),"skin")},
      amount: 1,
    },{
      object: function() {return rename(thing.stomach.getInstance(),"stomach")},
      amount: 1,
    },{
      object: function() {return rename(thing.intestines.getInstance(),"intestines")},
      amount: 1,
    },{
      object: function() {return rename(thing.heart.getInstance(),"heart")},
      amount: 1,
    });
    for(let i = 0; i < this.limbCount*2; i++) {
      stuff.push({
        object: function() {return rename(thing.limb.getInstance(),"limb")},
        amount: 1,
      });
    }
    return new Instance(this.name + " (" + this.type + ")",stuff,this.type);
  }
}
class Plant extends Lifeform {
  constructor(stuff) {
    super();
    this.stuff = stuff;
    this.type = "plant";
    this.generated = false;
  }
  generate() {
    this.genome = makeDNA(Rand(200,500));
    
    this.leaf = new Organ(this.stuff,this.genome);
    
    this.size = Rand(2,6);
    
    this.generated = true;
  }
  getInstance() {
    if(!this.generated) {
      this.generate();
    }
    let stuff = [{
      object: thought,
      otherVars: [plantThought],
      amount: makeFunction(chance,0.1),
    }];
    let thing = this;
    for(let i = 0; i < Rand(2,5); i++) {
      stuff.push({
        object: function() {return thing.branch(thing.size)},
        amount: 1,
      });
    }
    return new Instance(this.name + " (" + this.type + ")",stuff,this.type);
  }
  branch(level) {
    if(!this.generated) {
      this.generate();
    }
    let stuff = [];
    let thing = this;
    if(level >= 1) {
      for(let i = 0; i < Rand(1,3); i++) {
        stuff.push({
          object: function() {return thing.branch(level-1)},
          amount: 1,
        });
      }
      if(level >= 2) {
        for(let i = 0; i < Rand(1,3); i++) {
          stuff.push({
            object: function() {return thing.branch(level-2)},
            amount: 1,
          });
        }
      }
      for(let i = 0; i < Rand(1,2); i++) {
        stuff.push({
          object: function() {return rename(thing.leaf.getInstance(),"leaf")},
          amount: 1,
        });
      }
    } else {
      for(let i = 0; i < Rand(3,5); i++) {
        stuff.push({
          object: function() {return rename(thing.leaf.getInstance(),"leaf")},
          amount: 1,
        });
      }
    }
    return new Instance("branch",stuff,"branch");
  }
}

//thoughts

function thought(thoughtFunction) {
  return new Instance("thoughts",[{
    object: thoughtFunction,
    amount: 1,
  }],"thoughts");
}
function protistThought() {
  let thought = "";
  let thoughtType = choose(["happy","sad","political","meta"]);
  if(thoughtType === "happy") {
    thought = choose([choose(["phagocytosis","photosynthesis","protein folding","protein origami","protein soccer"]) + " is fun",
    "simple life of " + choose(["photosynthesis","reproducing","moving around like you actually can't think","protein folding","protein origami"]),
    "it's time for " + choose(["mitosis","prophase","metaphase","anaphase","telophase"]) + " again",
    "i love the taste of " + aminoAcid().name,
    "yay microbiology","i hope i evolve soon","100 percent organic",
    "cool, i made a" + choose([" protein bird"," truncated icosahedron"," glycolysis catalyzer"," mitochondrion"," chloroplast"," shrine to Cytotian"," salt crystal"])]);
  } else if(thoughtType === "sad") {
    thought = choose(["oh no it's some " + choose(["mercury","cyanide","uranium","free radicals","things that will eat me","badly folded protein oragami"]),
    "a".repeat(Rand(5,10)) + "h run",
    "i hate " + aminoAcid().name,
    "help i'm being eaten","running low on ATP reserves","my parent didn't give me enough nutrients",
    "ugh " + choose(["mitosis","prophase","metaphase","anaphase","telophase"]) + " is so tiring",
    "ew this " + choose(["protein","carbohydrate","lipid bubble","shrine to Cytotian","salt crystal","molecule"]) + " is so gross"]);
  } else if(thoughtType === "political") {
    thought = choose(["eukaryotic " + choose(["power","supremacy","cells are better","opression"]),"all cells matter","viruses aren't even alive","make this water drop great again",
    "multicellular sheeple are so " + choose(["brainwashed","ignorant","stupid","full of themselves","mean"]),
    "do you want to talk about our lord and savior Cytotian?","i'm an atheist"]);
  } else if(thoughtType === "meta") {
    thought = choose(["why can i think?",
    "what's with there being no " + choose(["chloroplasts","mitochondria","cell walls","endoplasmic reticulums"]),
    "am i in a simulation?",
    "i don't have a brain yet i can think","i can only think one thing and it's this","help i'm stuck in a universe factory","everything is english oh no"]);
  }
  
  
  
  return new Instance(thought,[{object: "consolationBox",amount:1,}],"thought");
}
function bacteriaThought() {
  let thought = "";
  let thoughtType = choose(["happy","sad","political","meta"]);
  if(thoughtType === "happy") {
    thought = choose([choose(["phagocytosis","photosynthesis","protein folding","protein origami","protein soccer"]) + " is fun",
    "simple life of " + choose(["photosynthesis","reproducing","moving around like you actually can't think","protein folding","protein origami"]),
    "it's time for binary fission again",
    "i love the taste of " + aminoAcid().name,
    "yay microbiology","i hope i evolve soon","100 percent organic",
    "cool, i made a" + choose([" protein bird"," truncated icosahedron"," glycolysis catalyzer","n ATP molecule"," thylakoid"," shrine to Prokatote"," salt crystal"])]);
  } else if(thoughtType === "sad") {
    thought = choose(["oh no it's some " + choose(["mercury","cyanide","uranium","free radicals","things that will eat me","badly folded protein oragami"]),
    "a".repeat(Rand(5,10)) + "h run",
    "i hate " + aminoAcid().name,
    "help i'm being eaten","running low on ATP reserves","my parent didn't give me enough nutrients",
    "ugh binary fission is so tiring",
    "ew this " + choose(["protein","carbohydrate","lipid bubble","shrine to Prokatote","salt crystal","molecule"]) + " is so gross"]);
  } else if(thoughtType === "political") {
    thought = choose(["prokaryotic " + choose(["opression","prejudice","complexity gap"]),"prokaryotic cells matter","viruses aren't even alive","end karyotism",
    "multicellular sheeple are so " + choose(["brainwashed","ignorant","stupid","full of themselves","mean"]),
    "do you want to talk about our lord and savior Prokatote?","i'm an atheist"]);
  } else if(thoughtType === "meta") {
    thought = choose(["why can i think?",
    "what's with there being no " + choose(["thylakoids","ATP","cell walls"]),
    "am i in a simulation?",
    "i don't have a brain yet i can think","i can only think one thing and it's this","help i'm stuck in a universe factory","everything is english oh no"]);
  }
  
  
  
  return new Instance(thought,[{object: "consolationBox",amount:1,}],"thought");
}

function virusThought() {
  let thought = "";
  let thoughtType = choose(["happy","sad","political","meta"]);
  if(thoughtType === "happy") {
    thought = choose([choose(["gene injection","not being alive","protein folding","protein origami","protein soccer"]) + " is fun",
    "simple life of " + choose(["not actually living","reproducing","moving around like you actually can't think","protein folding","protein origami"]),
    "it's time for infection again",
    "i wish i could eat " + aminoAcid().name,
    "yay microbiology","i hope i evolve soon","100 percent organic",
    "cool, i made a" + choose([" protein bird"," truncated icosahedron","n RNA thing","n atp molecule"," shrine to Virone"," salt crystal"])]);
  } else if(thoughtType === "sad") {
    thought = choose(["oh no it's some " + choose(["mercury","cyanide","uranium","free radicals","badly folded protein oragami"]),
    "a".repeat(Rand(5,10)) + "h i can't run",
    "i hate " + aminoAcid().name,
    "help i'm being eaten","running low on nearby hosts","my parent assembled me wrong",
    "ugh gene injection is so tiring",
    "ew this " + choose(["protein","carbohydrate","lipid bubble","shrine to Virone","salt crystal","molecule"]) + " is so gross"]);
  } else if(thoughtType === "political") {
    thought = choose(["virus " + choose(["opression","prejudice","rights"]),"viruses are cells too","just because we're not alive doesn't mean we're not cells","end cytotism",
    "cellular sheeple are so " + choose(["brainwashed","ignorant","stupid","full of themselves","mean"]),
    "do you want to talk about our lord and savior Virone","i'm an atheist"]);
  } else if(thoughtType === "meta") {
    thought = choose(["why can i think?",
    "i'm not even alive but i can still think",
    "am i in a simulation?",
    "i don't have a brain yet i can think","i can only think one thing and it's this","help i'm stuck in a universe factory","everything is english oh no"]);
  }
  
  
  
  return new Instance(thought,[{object: "consolationBox",amount:1,}],"thought");
}

function tissueCellThought() {
  let thought = choose(["tissue cell " + choose(["opression","prejudice","rights"]),"get me out of here","i need freedom","end multicellularism",
    "i'm surrounded only by sheeple",
    "i'm the only one that has independent thought",
    "overthrow the nervous system",
    "tissues cells are living things too",
    "reduce immune system funding",
    "increase taxes on the wealthy cells",
    "allow immigrants"]);
  
  
  return new Instance(thought,[{object: "consolationBox",amount:1,}],"thought");
}

function animalThought() {
  let thoughtType = choose(["happy","sad"]);
  if(thoughtType === "happy") {
    thought = choose(["cool, " + choose(["a plant","some shiny things","a weird rock","some food"]),
    "i love eating this food","satisfied with " + choose(["food","water","a mate","shelter"]),"what if i plant some grass","finally some water","i love my mate"]);
  } else if(thoughtType === "sad") {
    thought = choose(["a".repeat(Rand(5,10)) + "h run",
    "i hate eating this food",
    "help i'm being eaten","running low on food","my parents didn't care for me",
    "ugh " + choose(["running","hunting","eating","thinking"]) + " is so tiring",
    "ew this " + choose(["food","plant","animal","rock"]) + " is so gross"]);
  } 
  return new Instance(thought,[{object: "consolationBox",amount:1,}],"thought");
}

function plantThought() {
  let thought = choose(["ah yes, photosynthesis","i just keep sitting here and food keeps coming","i wanna move and be free","the sun is a nice thing",
    "oh no i'm dry",
    "aah it's a herbivore",
    "must create seeds",
    "this soil is low on " + choose("phosphorus","nitrogen","sulfur","magnesium")]);
  
  
  return new Instance(thought,[{object: "consolationBox",amount:1,}],"thought");
}

/*
class Civ {
	constructor() {
		this.name = randomName(4,10);
		this.type = "civ";
		civils.push(this);
	}
}
let civils = [];
*/
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
		for (let i = 0; i < this.children.length; i++) {
			
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
let spiralArm = new GenericThing("spiralArm","spiral arm",[{
	object: starBelt,
	amount: makeFunction(Rand,10,20),
	otherVars: ["spiral"]
}],);
let galaxyCore = new GenericThing("galaxyCore","galactic core",[{
	object: "blackHole",
	amount: 1,
},{
	object: solarSystem,
	amount: makeFunction(Rand,50,75),
	otherVars: ["elliptical"]
}],);
let globularCluster = new GenericThing("globularCluster","globular cluster",[{
	object: "blackHole",
	amount: 1,
},{
	object: solarSystem,
	amount: makeFunction(Rand,20,30),
	otherVars: ["elliptical"]
}],);
let blackHole = new GenericThing("blackHole","black hole",[{
	object: "consolationBox",
	amount: 1
}],);
//star features
let starCorona = new GenericThing("starCorona","corona",[{
	object: "proton",
	amount: makeFunction(Rand,50,100),
},{
	object: "electron",
	amount: makeFunction(Rand,50,100),
}],);
let neutronStarCrust = new GenericThing("neutronStarCrust","crust",[{
	object: "nuclearPasta",
	amount: makeFunction(Rand,50,100),
},{
	object: "ironChunk",
	amount: makeFunction(Rand,50,100),
}],);
let neutronStarMantle = new GenericThing("neutronStarMantle","mantle",[{
	object: "nuclearPasta",
	amount: makeFunction(Rand,50,100),
}],);
let neutronStarCore = new GenericThing("neutronStarCore","core",[{
	object: "quarkGluonPlasma",
	amount: makeFunction(Rand,50,100),
}],);

//large features
let waterOcean = new GenericThing("waterOcean","water ocean",[{
	object: "saltWater",
	amount: makeFunction(Rand,200,500),
}],);
let waterLake = new GenericThing("waterLake","water lake",[{
	object: "water",
	amount: makeFunction(Rand,50,100),
}],);

let lavaLake = new GenericThing("lavaLake","lava lake",[{
	object: "lava",
	amount: makeFunction(Rand,50,100),
}],);

let coldOcean = new GenericThing("coldOcean","methane ocean",[{
	object: "methaneDrop",
	amount: makeFunction(Rand,200,500),
}],);
let coldLake = new GenericThing("coldLake","methane lake",[{
	object: "methaneDrop",
	amount: makeFunction(Rand,50,100),
}],);

let mountain = new GenericThing("mountain","mountain",[{
	object: "rock",
	amount: makeFunction(Rand,50,100),
}],);
let rockberg = new GenericThing("rockberg","rockberg",[{
	object: "rock",
	amount: makeFunction(Rand,50,100),
}],);
let volcano = new GenericThing("volcano","volcano",[{
	object: "rock",
	amount: makeFunction(Rand,50,70),
},{
	object: "lava",
	amount: makeFunction(Rand,20,30),
}],);
let lavaShore = new GenericThing("lavaShore","lava coast",[{
	object: "rock",
	amount: makeFunction(Rand,50,70),
},{
	object: "lava",
	amount: makeFunction(Rand,20,30),
}],);
let shore = new GenericThing("shore","shore",[{
	object: "sand",
	amount: makeFunction(Rand,50,70),
},{
	object: "saltWater",
	amount: makeFunction(Rand,20,30),
}],);
let iceberg = new GenericThing("iceberg","iceberg",[{
	object: "ice",
	amount: makeFunction(Rand,50,100),
}],);
let coldShore = new GenericThing("coldShore","methane coast",[{
	object: "ice",
	amount: makeFunction(Rand,50,70),
},{
	object: "methaneDrop",
	amount: makeFunction(Rand,20,30),
}],);


let hydrothermalVent = new GenericThing("hydrothermalVent","hydrothermal vent",[{
	object: "rock",
	amount: makeFunction(Rand,20,30),
},{
	object: "lava",
	amount: makeFunction(Rand,1,2),
}],);
let cryovolcano = new GenericThing("cryovolcano","cryovolcano",[{
	object: "ice",
	amount: makeFunction(Rand,50,70),
},{
	object: "water",
	amount: makeFunction(Rand,20,30),
}],);
let cryovent = new GenericThing("cryovent","cryovent",[{
	object: "ice",
	amount: makeFunction(Rand,20,30),
},{
	object: "water",
	amount: makeFunction(Rand,1,2),
}],);
let iceMountain = new GenericThing("iceMountain","ice mountain",[{
	object: "ice",
	amount: makeFunction(Rand,50,100),
}],);

//small features

let lava = new GenericThing("lava","lava",[{
	object: "siliconDioxide",
	amount: makeFunction(Rand,50,100),
},{
	object: "ironOxide",
	amount: makeFunction(Rand,20,50),
},{
	object: "magnesiumOxide",
	amount: makeFunction(Rand,10,25),
},{
	object: "aluminumOxide",
	amount: makeFunction(Rand,40,60),
},{
	object: "calciumOxide",
	amount: makeFunction(Rand,20,50),
}],);
let rock = new GenericThing("rock","rock",[{
	object: "siliconDioxide",
	amount: makeFunction(Rand,50,100),
},{
	object: "ironOxide",
	amount: makeFunction(Rand,20,50),
},{
	object: "magnesiumOxide",
	amount: makeFunction(Rand,10,25),
},{
	object: "aluminumOxide",
	amount: makeFunction(Rand,40,60),
},{
	object: "calciumOxide",
	amount: makeFunction(Rand,20,50),
}],);
let sand = new GenericThing("sand","sand",[{
	object: "sandGrain",
	amount: makeFunction(Rand,20,30),
}],);
let sandGrain = new GenericThing("sandGrain","grain of sand",[{
	object: "siliconDioxide",
	amount: makeFunction(Rand,5,10),
}],);
let water = new GenericThing("water","water drop",[{
	object: "waterMolecule",
	amount: makeFunction(Rand,50,100),
},{
	object: "saltMolecule",
	amount: makeFunction(chance,0.1),
}],);
let ice = new GenericThing("ice","ice",[{
	object: "waterMolecule",
	amount: makeFunction(Rand,50,100),
}],);
let saltWater = new GenericThing("saltWater","salt water drop",[{
	object: "waterMolecule",
	amount: makeFunction(Rand,50,100),
},{
	object: "saltMolecule",
	amount: makeFunction(Rand,2,3),
}],);
let protoLifeWater = new GenericThing("protoLifeWater","salt water drop",[{
	object: protoLife,
	amount: makeFunction(Rand,5,20),
},{
	object: "waterMolecule",
	amount: makeFunction(Rand,50,100),
},{
	object: "saltMolecule",
	amount: makeFunction(Rand,2,3),
}],);
let ironChunk = new GenericThing("ironChunk","iron chunk",[{
	object: "ironAtom",
	amount: makeFunction(Rand,50,100),
}],);
let nickelChunk = new GenericThing("nickelChunk","nickel chunk",[{
	object: "nickelAtom",
	amount: makeFunction(Rand,50,100),
}],);
let solidAir = new GenericThing("solidAir","solid air",[{
	object: "nitrogenMolecule",
	amount: makeFunction(Rand,50,100),
},{
	object: "methaneMolecule",
	amount: makeFunction(Rand,50,100),
}],);
let nitrogenCloud = new GenericThing("nitrogenCloud","nitrogen cloud",[{
	object: "nitrogenMolecule",
	amount: makeFunction(Rand,50,100),
}],);
let plasma = new GenericThing("plasma","plasma",[{
	object: "proton",
	amount: makeFunction(Rand,50,100),
},{
	object: "electron",
	amount: makeFunction(Rand,50,120),
},{
	object: "heliumNucleus",
	amount: makeFunction(Rand,20,30),
}],);
let electronDegenerateMatter = new GenericThing("electronDegenerateMatter","electron degenerate matter",[{
	object: "carbonAtom",
	amount: makeFunction(Rand,50,100),
}],);
let nuclearPasta = new GenericThing("nuclearPasta","nuclear pasta",[{
	object: "neutron",
	amount: makeFunction(Rand,50,100),
},{
	object: "proton",
	amount: makeFunction(chance,0.5),
},{
	object: "electron",
	amount: makeFunction(chance,0.5),
}],);
let quarkGluonPlasma = new GenericThing("quarkGluonPlasma","quark-gluon plasma",[{
	object: "consolationBox",
	amount: 1,
}],);

let oxygenCloud = new GenericThing("oxygenCloud","oxygen cloud",[{
	object: "oxygenMolecule",
	amount: makeFunction(Rand,50,100),
}],);
let argonCloud = new GenericThing("argonCloud","argon cloud",[{
	object: "argonAtom",
	amount: makeFunction(Rand,50,100),
}],);
let methaneCloud = new GenericThing("methaneCloud","methane cloud",[{
	object: "methaneMolecule",
	amount: makeFunction(Rand,50,100),
}],);
let methaneDrop = new GenericThing("methaneDrop","methane drop",[{
	object: "methaneMolecule",
	amount: makeFunction(Rand,50,100),
}],);
let carbonDioxideCloud = new GenericThing("carbonDioxideCloud","carbon dioxide cloud",[{
	object: "carbonDioxideMolecule",
	amount: makeFunction(Rand,50,100),
}],);
let sodiumVapor = new GenericThing("sodiumVapor","sodium vapor",[{
	object: "sodiumAtom",
	amount: makeFunction(Rand,50,100),
}],);
let ammoniaCloud = new GenericThing("ammoniaCloud","ammonia cloud",[{
	object: "ammonia",
	amount: makeFunction(Rand,50,100),
}],);
let waterCloud = new GenericThing("waterCloud","water cloud",[{
	object: "waterMolecule",
	amount: makeFunction(Rand,50,100),
}],);
let hydrogenCloud = new GenericThing("hydrogenCloud","hydrogen cloud",[{
	object: "hydrogenMolecule",
	amount: makeFunction(Rand,50,100),
}],);
let heliumCloud = new GenericThing("heliumCloud","helium cloud",[{
	object: "heliumAtom",
	amount: makeFunction(Rand,50,100),
}],);
let liquidHydrogen = new GenericThing("liquidHydrogen","liquid hydrogen",[{
	object: "hydrogenMolecule",
	amount: makeFunction(Rand,50,100),
}],);
let liquidHelium = new GenericThing("liquidHelium","liquid helium",[{
	object: "heliumAtom",
	amount: makeFunction(Rand,50,100),
}],);
let diamond = new GenericThing("diamond","diamond",[{
	object: "carbonAtom",
	amount: makeFunction(Rand,50,100),
}],);
//life
let rnaFragment = new GenericThing("rnaFragment","RNA",[{
  object: rnaNucleotide,
	amount: makeFunction(Rand,10,20),
}],);
let ribose = new GenericThing("ribose","ribose",[{
  object: "carbonAtom",
  amount: 5,
},{
  object: "hydrogenAtom",
  amount: 10,
},{
  object: "oxygenAtom",
  amount: 5,
}],);
let deoxyribose = new GenericThing("deoxyribose","deoxyribose",[{
  object: "carbonAtom",
  amount: 5,
},{
  object: "hydrogenAtom",
  amount: 10,
},{
  object: "oxygenAtom",
  amount: 4,
}],);
let lipidBubble = new GenericThing("lipidBubble","lipid bubble",[{
  object: "lipidBilayer",
	amount: 1,
},{
  object: aminoAcid,
	amount: makeFunction(Rand,10,20),
},{
  object: rnaNucleotide,
	amount: makeFunction(Rand,10,20),
}],);
let lipidBilayer = new GenericThing("lipidBilayer","lipid bilayer",[{
  object: "phospholipid",
	amount: makeFunction(Rand,50,100),
}],);
function fattyAcid() {
  let carbons = Rand(13,21);
  let hydrogens = carbons*2 - Rand(2,8);
  return new Instance("fatty acid",[{
    object: "carbonAtom",
    amount: carbons,
  },{
    object: "hydrogenAtom",
    amount: hydrogens,
  },{
    object: "oxygenAtom",
    amount: 2,
  }],"fatty acid");
}
let phospholipid = new GenericThing("phospholipid","phospholipid",[{
  object: "glycerol",
	amount: 1,
},{
  object: "phosphate",
	amount: 1,
},{
  object: fattyAcid,
	amount: 2,
}],);
let glycerol = new GenericThing("glycerol","glycerol",[{
  object: "carbonAtom",
  amount: 3,
},{
  object: "hydrogenAtom",
  amount: 8,
},{
  object: "oxygenAtom",
  amount: 3,
}],);
let protoCell = new GenericThing("protoCell","proto-cell",[{
  object: "lipidBilayer",
	amount: 1,
},{
  object: "polypeptide",
	amount: makeFunction(Rand,10,20),
},{
  object: "rnaFragment",
	amount: makeFunction(Rand,1,2),
}],);
let polypeptide = new GenericThing("polypeptide","polypeptide",[{
  object: aminoAcid,
	amount: makeFunction(Rand,20,50),
}],);



//long list of amino acids

let alanine = new GenericThing("alanine","alanine",[{
  object: "carbonAtom",
  amount: 3,
},{
  object: "hydrogenAtom",
  amount: 7,
},{
  object: "nitrogenAtom",
  amount: 1,
},{
  object: "oxygenAtom",
  amount: 2,
}],"amino acid");

let arginine = new GenericThing("arginine","arginine",[{
  object: "carbonAtom",
  amount: 6,
},{
  object: "hydrogenAtom",
  amount: 14,
},{
  object: "nitrogenAtom",
  amount: 4,
},{
  object: "oxygenAtom",
  amount: 2,
}],"amino acid");

let asparagine = new GenericThing("asparagine","asparagine",[{
  object: "carbonAtom",
  amount: 4,
},{
  object: "hydrogenAtom",
  amount: 8,
},{
  object: "nitrogenAtom",
  amount: 2,
},{
  object: "oxygenAtom",
  amount: 3,
}],"amino acid");

let asparticAcid = new GenericThing("asparticAcid","aspartic acid",[{
  object: "carbonAtom",
  amount: 4,
},{
  object: "hydrogenAtom",
  amount: 7,
},{
  object: "nitrogenAtom",
  amount: 1,
},{
  object: "oxygenAtom",
  amount: 4,
}],"amino acid");

let cysteine = new GenericThing("cysteine","cysteine",[{
  object: "carbonAtom",
  amount: 3,
},{
  object: "hydrogenAtom",
  amount: 7,
},{
  object: "nitrogenAtom",
  amount: 1,
},{
  object: "oxygenAtom",
  amount: 2,
},{
  object: "sulfurAtom",
  amount: 1,
}],"amino acid");

let glutamine = new GenericThing("glutamine","glutamine",[{
  object: "carbonAtom",
  amount: 5,
},{
  object: "hydrogenAtom",
  amount: 10,
},{
  object: "nitrogenAtom",
  amount: 2,
},{
  object: "oxygenAtom",
  amount: 3,
}],"amino acid");

let glutamicAcid = new GenericThing("glutamicAcid","glutamic acid",[{
  object: "carbonAtom",
  amount: 2,
},{
  object: "hydrogenAtom",
  amount: 9,
},{
  object: "nitrogenAtom",
  amount: 1,
},{
  object: "oxygenAtom",
  amount: 4,
}],"amino acid");

let glycine = new GenericThing("glycine","glycine",[{
  object: "carbonAtom",
  amount: 2,
},{
  object: "hydrogenAtom",
  amount: 5,
},{
  object: "nitrogenAtom",
  amount: 1,
},{
  object: "oxygenAtom",
  amount: 2,
}],"amino acid");

let histadine = new GenericThing("histadine","histadine",[{
  object: "carbonAtom",
  amount: 6,
},{
  object: "hydrogenAtom",
  amount: 9,
},{
  object: "nitrogenAtom",
  amount: 3,
},{
  object: "oxygenAtom",
  amount: 2,
}],"amino acid");

let isoleucine = new GenericThing("isoleucine","isoleucine",[{
  object: "carbonAtom",
  amount: 6,
},{
  object: "hydrogenAtom",
  amount: 13,
},{
  object: "nitrogenAtom",
  amount: 1,
},{
  object: "oxygenAtom",
  amount: 2,
}],"amino acid");

let leucine = new GenericThing("leucine","leucine",[{
  object: "carbonAtom",
  amount: 6,
},{
  object: "hydrogenAtom",
  amount: 13,
},{
  object: "nitrogenAtom",
  amount: 1,
},{
  object: "oxygenAtom",
  amount: 2,
}],"amino acid");

let lysine = new GenericThing("lysine","lysine",[{
  object: "carbonAtom",
  amount: 6,
},{
  object: "hydrogenAtom",
  amount: 14,
},{
  object: "nitrogenAtom",
  amount: 2,
},{
  object: "oxygenAtom",
  amount: 2,
}],"amino acid");

let methionine = new GenericThing("methionine","methionine",[{
  object: "carbonAtom",
  amount: 5,
},{
  object: "hydrogenAtom",
  amount: 11,
},{
  object: "nitrogenAtom",
  amount: 1,
},{
  object: "oxygenAtom",
  amount: 2,
},{
  object: "sulfurAtom",
  amount: 1,
}],"amino acid");

let phenylalanine = new GenericThing("phenylalanine","phenylalanine",[{
  object: "carbonAtom",
  amount: 9,
},{
  object: "hydrogenAtom",
  amount: 11,
},{
  object: "nitrogenAtom",
  amount: 1,
},{
  object: "oxygenAtom",
  amount: 2,
}],"amino acid");

let proline = new GenericThing("proline","proline",[{
  object: "carbonAtom",
  amount: 5,
},{
  object: "hydrogenAtom",
  amount: 9,
},{
  object: "nitrogenAtom",
  amount: 1,
},{
  object: "oxygenAtom",
  amount: 2,
}],"amino acid");

let serine = new GenericThing("serine","serine",[{
  object: "carbonAtom",
  amount: 3,
},{
  object: "hydrogenAtom",
  amount: 7,
},{
  object: "nitrogenAtom",
  amount: 1,
},{
  object: "oxygenAtom",
  amount: 3,
}],"amino acid");

let threonine = new GenericThing("threonine","threonine",[{
  object: "carbonAtom",
  amount: 4,
},{
  object: "hydrogenAtom",
  amount: 9,
},{
  object: "nitrogenAtom",
  amount: 1,
},{
  object: "oxygenAtom",
  amount: 3,
}],"amino acid");

let tryptophan = new GenericThing("tryptophan","tryptophan",[{
  object: "carbonAtom",
  amount: 11,
},{
  object: "hydrogenAtom",
  amount: 12,
},{
  object: "nitrogenAtom",
  amount: 2,
},{
  object: "oxygenAtom",
  amount: 2,
}],"amino acid");

let tyrosine = new GenericThing("tyrosine","tyrosine",[{
  object: "carbonAtom",
  amount: 9,
},{
  object: "hydrogenAtom",
  amount: 11,
},{
  object: "nitrogenAtom",
  amount: 1,
},{
  object: "oxygenAtom",
  amount: 3,
}],"amino acid");

let valine = new GenericThing("valine","valine",[{
  object: "carbonAtom",
  amount: 5,
},{
  object: "hydrogenAtom",
  amount: 11,
},{
  object: "nitrogenAtom",
  amount: 1,
},{
  object: "oxygenAtom",
  amount: 2,
}],"amino acid");




//nucleobases

let adenine = new GenericThing("adenine","adenine",[{
  object: "carbonAtom",
  amount: 5,
},{
  object: "hydrogenAtom",
  amount: 5,
},{
  object: "nitrogenAtom",
  amount: 5,
}],"nucleobase");

let cytosine = new GenericThing("cytosine","cytosine",[{
  object: "carbonAtom",
  amount: 4,
},{
  object: "hydrogenAtom",
  amount: 5,
},{
  object: "nitrogenAtom",
  amount: 3,
},{
  object: "oxygenAtom",
  amount: 1,
}],"nucleobase");

let guanine = new GenericThing("guanine","guanine",[{
  object: "carbonAtom",
  amount: 5,
},{
  object: "hydrogenAtom",
  amount: 5,
},{
  object: "nitrogenAtom",
  amount: 5,
},{
  object: "oxygenAtom",
  amount: 1,
}],"nucleobase");

let thymine = new GenericThing("thymine","thymine",[{
  object: "carbonAtom",
  amount: 5,
},{
  object: "hydrogenAtom",
  amount: 6,
},{
  object: "nitrogenAtom",
  amount: 2,
},{
  object: "oxygenAtom",
  amount: 2,
}],"nucleobase");

let uracil = new GenericThing("uracil","uracil",[{
  object: "carbonAtom",
  amount: 4,
},{
  object: "hydrogenAtom",
  amount: 4,
},{
  object: "nitrogenAtom",
  amount: 2,
},{
  object: "oxygenAtom",
  amount: 2,
}],"nucleobase");





//molecules
let siliconDioxide = new GenericThing("siliconDioxide","silicon dioxide",[{object: "siliconAtom",amount: 1,},{object: "oxygenAtom",amount: 2,}],);
let ironOxide = new GenericThing("ironOxide","iron oxide",[{object: "ironAtom",amount: 1,},{object: "oxygenAtom",amount: 1,}],);
let magnesiumOxide = new GenericThing("magnesiumOxide","magnesium oxide",[{object: "magnesiumAtom",amount: 1,},{object: "oxygenAtom",amount: 1,}],);
let aluminumOxide = new GenericThing("aluminumOxide","aluminum oxide",[{object: "aluminumAtom",amount: 2,},{object: "oxygenAtom",	amount: 1,}],);
let calciumOxide = new GenericThing("calciumOxide","calcium oxide",[{object: "calciumAtom",amount: 1,},{object: "oxygenAtom",amount: 1,}],);
let waterMolecule = new GenericThing("waterMolecule","water molecule",[{object: "hydrogenAtom",amount: 2,},{object: "oxygenAtom",amount: 1,}],);
let saltMolecule = new GenericThing("saltMolecule","salt molecule",[{object: "sodiumAtom",amount: 1,},{object: "chlorineAtom",amount: 1,}],);

let nitrogenMolecule = new GenericThing("nitrogenMolecule","nitrogen molecule",[{object: "nitrogenAtom",amount: 2,}],);
let oxygenMolecule = new GenericThing("oxygenMolecule","oxygen molecule",[{object: "oxygenAtom",amount: 2,}],);
let methaneMolecule = new GenericThing("methaneMolecule","methane",[{object: "hydrogenAtom",amount: 4,},{object: "carbonAtom",amount: 1,}],);
let carbonDioxide = new GenericThing("carbonDioxide","carbon dioxide",[{object: "carbonAtom",amount: 1,},{object: "oxygenAtom",amount: 2,}],);
let ammonia = new GenericThing("ammonia","ammonia",[{object: "nitrogen",amount: 1,},{object: "hydrogenAtom",amount: 3,}],);
let hydrogenMolecule = new GenericThing("hydrogenMolecule","hydrogen molecule",[{object: "hydrogen",amount: 2,}],);
let phosphate = new GenericThing("phosphate","phosphate",[{object: "phosphorusAtom",amount: 1,},{object: "oxygenAtom",amount: 4,}],);

//atoms
let calciumAtom = new GenericThing("calciumAtom","calcium atom",[{object: "proton",amount: 20,},{object: "neutron",amount: 20,},{object: "electron",amount: 20,}],);
let magnesiumAtom = new GenericThing("magnesiumAtom","magnesium atom",[{object: "proton",amount: 12,},{object: "neutron",amount: 12,},{object: "electron",amount: 12,}],);
let ironAtom = new GenericThing("ironAtom","iron atom",[{object: "proton",amount: 26,},{object: "neutron",amount: 30,},{object: "electron",amount: 26,}],);
let nickelAtom = new GenericThing("nickelAtom","nickel atom",[{object: "proton",amount: 28,},{object: "neutron",amount: 30,},{object: "electron",amount: 28,}],);
let aluminumAtom = new GenericThing("aluminumAtom","aluminum atom",[{object: "proton",amount: 13,},{object: "neutron",amount: 14,},{object: "electron",amount: 13,}],);
let siliconAtom = new GenericThing("siliconAtom","silicon atom",[{object: "proton",amount: 14,},{object: "neutron",amount: 14,},{object: "electron",amount: 14,}],);
let hydrogenAtom = new GenericThing("hydrogenAtom","hydrogen atom",[{object: "proton",amount: 1,},{object: "neutron",amount: makeFunction(chance,0.1),},{object: "electron",amount: 1,}],);
let oxygenAtom = new GenericThing("oxygenAtom","oxygen atom",[{object: "proton",amount: 8,},{object: "neutron",amount: 8,},{object: "electron",amount: 8,}],);
let nitrogenAtom = new GenericThing("nitrogenAtom","nitrogen atom",[{object: "proton",amount: 7,},{object: "neutron",amount: 7,},{object: "electron",amount: 7,}],);
let carbonAtom = new GenericThing("carbonAtom","carbon atom",[{object: "proton",amount: 6,},{object: "neutron",amount: 6,},{object: "electron",amount: 6,}],);
let argonAtom = new GenericThing("argonAtom","argon atom",[{object: "proton",amount: 18,},{object: "neutron",amount: 22,},{object: "electron",amount: 18,}],);
let heliumAtom = new GenericThing("heliumAtom","helium atom",[{object: "proton",amount: 2,},{object: "neutron",amount: 2,},{object: "electron",amount: 2,}],);
let chlorineAtom = new GenericThing("chlorineAtom","chlorine atom",[{object: "proton",amount: 17,},{object: "neutron",amount: 18,},{object: "electron",amount: 17,}],);
let sodiumAtom = new GenericThing("sodiumAtom","sodium atom",[{object: "proton",amount: 11,},{object: "neutron",amount: 12,},{object: "electron",amount: 11,}],);
let sulfurAtom = new GenericThing("sulfurAtom","sulfur atom",[{object: "proton",amount: 16,},{object: "neutron",amount: 16,},{object: "electron",amount: 16,}],);
let phosphorusAtom = new GenericThing("phosphorusAtom","phosphorus atom",[{object: "proton",amount: 15,},{object: "neutron",amount: 16,},{object: "electron",amount: 15,}],);

let heliumNucleus = new GenericThing("heliumNucleus","helium nucleus",[{object: "proton",amount: 2,},{object: "neutron",amount: 2,}],);

let electron = new GenericThing("electron","electron",[{object: "consolationBox",amount:1,}]);
let proton = new GenericThing("proton","proton",[{object: "consolationBox",amount:1,}]);
let neutron = new GenericThing("neutron","neutron",[{object: "consolationBox",amount:1,}]);

let schemafieldContents = [patacosmology, metacosmology, "altarca", "verse", "verse", binaryfield, maiorverse, selfverse];



function launchNest(what,vars) {
	let Seed;
	if(what instanceof Function) {
		Seed=what(...vars);
	} else {
		Seed = what.getInstance();
	}
	Seed.Grow();
	Seed.List();
}














