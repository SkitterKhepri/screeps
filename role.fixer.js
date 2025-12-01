var roleFixer = {

    run: function(creep) {

        //TODO refactor this, so that while repairing, they spend all their energy repairing stuff in range, and only then (at max energy) choose a new target
        // if(creep.memory.delivering && creep.store[RESOURCE_ENERGY] == 0) {
        //     creep.memory.delivering = false;
	    // }
	    // if(!creep.memory.delivering && creep.store.getFreeCapacity() == 0) {
	    //     creep.memory.delivering = true;
	    // }

	    if(creep.store.getUsedCapacity() == 0) {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_STORAGE || structure.structureType == STRUCTURE_CONTAINER) &&
                        structure.store[RESOURCE_ENERGY] > 0;
                }
            });
            if(creep.withdraw(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                creep.moveTo(targets[0]);
            }
        }
        else {
            let nonWallRepairTargets = creep.room.find(FIND_STRUCTURES, {
                filter: structure => {return (structure.hits < structure.hitsMax) && (structure.structureType != STRUCTURE_WALL)}
            });
            let wallRepairTargets = creep.room.find(FIND_STRUCTURES, {
                filter: structure => {return (structure.hits < structure.hitsMax) && (structure.structureType == STRUCTURE_WALL)}
            });
                
                
            if(nonWallRepairTargets.length > 0) {
                if(creep.repair(nonWallRepairTargets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(nonWallRepairTargets[0]);
                }
            }
            else if(wallRepairTargets.length > 0){
                wallRepairTargets.sort((a,b) => a.hits - b.hits);
                if(creep.repair(wallRepairTargets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(wallRepairTargets[0]);
                }
            }
            else{
                creep.moveTo(Game.spawns['null'], {visualizePathStyle: {stroke: '#ffffff'}})
            }
        }
	}
};

module.exports = roleFixer;