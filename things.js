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
	return Math.random() > chance;
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
	let civName = otherVars[0] instanceof Civ ? otherVars[0].name + "ian " : "";
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
	return new Instance(type,[{
		object: "consolationBox",
		amount: 1
	}],"star");
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
  if(Math.random() * 100 > 50) {
    hasAtmosphere = true;
  }
  stuff = [{
    object: crust,
		amount: 1,
    otherVars: [temp,"small",hasAtmosphere],
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
	return new Instance(temp + " " + name,stuff,moon ? "dwarf planet" : "moon");
}
function terraPlanet(temp,moon) {
	let hasAtmosphere = false;
  if(Math.random() * 100 > 30 && temp !== "scorched" && temp !== "frozen") {
    hasAtmosphere = true;
  }
  stuff = [{
    object: crust,
		amount: 1,
    otherVars: [temp,"medium",hasAtmosphere],
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
  return new Instance(temp + " " + name,stuff,moon ? "terrestrial planet" : "moon");
}
function superEarth(temp,moon) {
	
	
  stuff = [{
    object: crust,
		amount: 1,
    otherVars: [temp,"large",true],
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
  return new Instance(temp + " " + name,stuff,moon ? "super earth" : "moon");
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
function crust(temp,size,hasAtmosphere) {
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
  let oceans = false;
  let oceanType = lavaOcean;
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
      if(Math.random() > 0.9 && hasAtmosphere)oceans = true;
      oceanType = "waterOcean";
      break;
    case "temperate":
      if(Math.random() > 0.5 && hasAtmosphere)oceans = true;
      oceanType = "waterOcean";
      break;
    case "cool":
      if(Math.random() > 0.6 && hasAtmosphere)oceans = true;
      oceanType = "waterOcean";
      break;
    case "cold":
      if(Math.random() > 0.8 && hasAtmosphere)oceans = true;
      oceanType = "coldOcean";
      break;
    case "frozen":
      oceans = false;
      break;
  }
  let amount1 = Rand(Math.floor(amount/2),amount);
  let stuff = [];
  
  for(let i = 0; i < amount1; i++) {
    stuff.push({
      object: landmass,
      amount: 1,
      otherVars: [temp,Rand(25,40),oceans],
    });
  }
  if(oceans) {
    let amount2 = Rand(Math.floor(amount/2),amount);
    
    for(let i = 0; i < amount2; i++) {
      stuff.push({
        object: oceanType,
        amount: 1,
      });
    }
  }
  return new Instance("crust",stuff,temp + " crust");
}
function landmass(temp,amount,lakes) {
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
  for(let i = 0; i < amount; i++) {
    let thing = chooseWeighted(stuff);
    stuff2.push({
      object: thing[0],
      amount: 1,
    });
  }
  return new Instance("landmass",stuff2,temp + " landmass");
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
//large features
let waterOcean = new GenericThing("waterOcean","water ocean",[{
	object: "saltWater",
	amount: makeFunction(Rand,200,500),
}],);
let waterLake = new GenericThing("waterLake","water lake",[{
	object: "water",
	amount: makeFunction(Rand,50,100),
}],);

let lavaOcean = new GenericThing("lavaOcean","lava ocean",[{
	object: "lava",
	amount: makeFunction(Rand,200,500),
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
let volcano = new GenericThing("volcano","volcano",[{
	object: "rock",
	amount: makeFunction(Rand,50,70),
},{
	object: "lava",
	amount: makeFunction(Rand,20,30),
}],);
let cryovolcano = new GenericThing("cryovolcano","cryovolcano",[{
	object: "ice",
	amount: makeFunction(Rand,50,70),
},{
	object: "water",
	amount: makeFunction(Rand,20,30),
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
let water = new GenericThing("water","water",[{
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
let saltWater = new GenericThing("saltWater","salt water",[{
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
let methaneDrop = new GenericThing("methaneDrop","methane droplet",[{
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

//atoms
let calciumAtom = new GenericThing("calciumAtom","calcium atom",[{object: "consolationBox",amount: 1,}],);
let magnesiumAtom = new GenericThing("magnesiumAtom","magnesium atom",[{object: "consolationBox",amount: 1,}],);
let ironAtom = new GenericThing("ironAtom","iron atom",[{object: "consolationBox",amount: 1,}],);
let nickelAtom = new GenericThing("nickelAtom","nickel atom",[{object: "consolationBox",amount: 1,}],);
let aluminumAtom = new GenericThing("aluminumAtom","aluminum atom",[{object: "consolationBox",amount: 1,}],);
let siliconAtom = new GenericThing("siliconAtom","silicon atom",[{object: "consolationBox",amount: 1,}],);
let hydrogenAtom = new GenericThing("hydrogenAtom","hydrogen atom",[{object: "consolationBox",amount: 1,}],);
let oxygenAtom = new GenericThing("oxygenAtom","oxygen atom",[{object: "consolationBox",amount: 1,}],);
let nitrogenAtom = new GenericThing("nitrogenAtom","nitrogen atom",[{object: "consolationBox",amount: 1,}],);
let carbonAtom = new GenericThing("carbonAtom","carbon atom",[{object: "consolationBox",amount: 1,}],);
let argonAtom = new GenericThing("argonAtom","argon atom",[{object: "consolationBox",amount: 1,}],);
let heliumAtom = new GenericThing("heliumAtom","helium atom",[{object: "consolationBox",amount: 1,}],);
let chlorineAtom = new GenericThing("chlorineAtom","chlorine atom",[{object: "consolationBox",amount: 1,}],);
let sodiumAtom = new GenericThing("chlorineAtom","sodium atom",[{object: "consolationBox",amount: 1,}],);



let schemafieldContents = [patacosmology, metacosmology, "altarca", "verse", "verse", binaryfield, maiorverse, selfverse];



function launchNest(what) {
	let Seed;
	if(what instanceof Function) {
		Seed=what();
	} else {
		Seed = what.getInstance();
	}
	Seed.Grow();
	Seed.List();
}














