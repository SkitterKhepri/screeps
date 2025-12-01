var roleHarvesterMK2 = {
    run: function(creep, targetSource) {
	    if(creep.store.getFreeCapacity() > 0) {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[targetSource]) == ERR_NOT_IN_RANGE) {
                if(creep.moveTo(sources[targetSource], {visualizePathStyle: {stroke: '#ffaa00'}}) == ERR_NO_PATH){
                    if(sources.length == creep.memory.target + 1){
                        creep.memory.target = 0
                    }
                    else{
                        creep.memory.target++
                    }
                    if(creep.memory.target > sources.length){
                        creep.memory.target = 0
                    }
                }
            }
        }
        else {
            creep.drop(RESOURCE_ENERGY)
            // var targets = creep.room.find(FIND_STRUCTURES, {
            //         filter: (structure) => {
            //             return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_TOWER) &&
            //                 structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            //         }
            // });
            // if(targets.length > 0) {
            //     if(creep.transfer(targets[0], RESOURCE_ENERGY) == (ERR_NOT_IN_RANGE || ERR_FULL)) {
            //         creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}})
            //     } 
            // }
            // if(targets.length == 0){
            //     creep.moveTo(Game.spawns['null'], {visualizePathStyle: {stroke: '#ffffff'}})
            // }
        }
	}
};

module.exports = roleHarvesterMK2;