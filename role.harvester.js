var roleHarvester = {

    run: function(creep, targetSource) {
	    if(creep.store.getFreeCapacity() > 0) {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[targetSource]) == ERR_NOT_IN_RANGE) {
                if(creep.moveTo(sources[targetSource], {visualizePathStyle: {stroke: '#ffaa00'}}) == ERR_NO_PATH){
                    if(sources.length == parseInt(creep.memory.target) + 1){
                        creep.memory.target = 0
                    }
                    else{
                        creep.memory.target = parseInt(creep.memory.target) + 1
                    }
                    if(parseInt(creep.memory.target) > 1){console.log(creep.memory.target)}
                }
            }
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_TOWER) &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == (ERR_NOT_IN_RANGE || ERR_FULL)) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}})
                } 
            }
            if(targets.length == 0){
                //TODO temporary patch job for repairing
                let repairTargets = creep.room.find(FIND_STRUCTURES, {
                    filter: object => object.hits < object.hitsMax
                });
                
                repairTargets.sort((a,b) => a.hits - b.hits);
                
                if(repairTargets.length > 0) {
                    if(creep.repair(repairTargets[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(repairTargets[0]);
                    }
                }
                else{
                    creep.moveTo(Game.spawns['null'], {visualizePathStyle: {stroke: '#ffffff'}})
                }
            }
        }
	}
};

module.exports = roleHarvester;