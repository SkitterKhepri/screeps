var sourceFunctions = {
    minSourceKey : function(room, type){
        var sources = {}
        for(let i = 0; i < room.find(FIND_SOURCES).length; i++){
            sources[i] = 0
        }
        for(var name in Game.creeps){
            var creep = Game.creeps[name];
            for(let i = 0; i < type.length; i++){
                if(creep.memory.role == type[i]){
                    sources[creep.memory.target] += 1
                }    
            }
            if(creep.memory.role == 'harvester' || creep.memory.role == 'upgrader' || creep.memory.role == 'harvestermk2'){
                sources[creep.memory.target] += 1
            }
        }
        //converts to array, something like [ [o,1], [1,1] ]
        var entries = Object.entries(sources)
        //something like a touple, and the reduce is just a comparison of each entry to the current lowest
        var [minKey, minValue] = entries.reduce((a, b) => a[1] < b[1] ? a : b);
        return minKey;
    },
    maxSourceKey : function(room, type){
        var sources = []
        for(let i = 0; i < Game.spawns['Home'].room.find(FIND_SOURCES).length; i++){
            sources[i] = 0
        }
        for(var name in Game.creeps){
            var creep = Game.creeps[name];
            for(let i = 0; i < type.length; i++){
                if(creep.memory.role == type[i]){
                    sources[creep.memory.target] += 1
                }    
            }
        }
        var carriers = room.find(FIND_MY_CREEPS, {filter: (targetCreep) => {room == targetCreep.room && targetCreep.memory.role == 'carrier'}});
        for(let i = 0; i < sources.length; i++){
            for(let i = 0; i < carriers.length; i++){
                if(parseInt(carriers[i].memory.target) == i){
                    sources[i]--
                }
            }
        }
        let maxSourceKey = sources.indexOf(Math.max(...sources))
        return maxSourceKey;
    }
}

var creepFunctions = {
    carrierlessNobleCreeps : function(room){
        var nobleCreeps = []
        var targets = room.find(FIND_MY_CREEPS)
        targets.forEach(
            (targetCreep) =>{
                if(targetCreep.memory.role == 'upgradermk2' || targetCreep.memory.role == 'buildermk2'){
                    nobleCreeps.push(targetCreep.name)
                }
            }
        )
        // console.log('nobles: '+nobleCreeps)
        var carriers = room.find(FIND_MY_CREEPS, {
            filter: function(creep) {
                return creep.memory.role == 'carrier' && creep.room == room;
            }
        });
        // console.log('carriers: ' + carriers)
        carriers.forEach(
            (carrier) => {
                // console.log('masters: ' + carrier.memory.master)
                if(nobleCreeps.includes(carrier.memory.master)){
                    let index = nobleCreeps.indexOf(carrier.memory.master)
                    if(index > -1){
                        nobleCreeps.splice(index, 1)
                    }
                }
            }
        )
        // console.log('carrierless: ' + nobleCreeps)
        return nobleCreeps;
    },
    //Harvest, presuming creep has target in memory, like: {target : *someInt*}
    harvest : function(creep){
        var sources = creep.room.find(FIND_SOURCES);
        if(creep.harvest(sources[targetSource]) == ERR_NOT_IN_RANGE) {
            if(creep.moveTo(sources[targetSource], {visualizePathStyle: {stroke: '#ffaa00'}}) == ERR_NO_PATH){
                if(sources.length <= parseInt(creep.memory.target) + 1){
                    creep.memory.target = 0
                }
                else{
                    creep.memory.target = parseInt(creep.memory.target) + 1
                }
                if(parseInt(creep.memory.target) > 1){console.log(creep.memory.target)}
            }
        }
    }
}
module.exports = {sourceFunctions, creepFunctions};