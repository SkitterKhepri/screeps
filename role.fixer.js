var roleFixer = {

    run: function(creep) {
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
            let repairTargets = creep.room.find(FIND_STRUCTURES, {
                filter: object => {return object.hits < object.hitsMax}
            });
                
            // repairTargets.sort((a,b) => a.hits - b.hits);
                
            if(repairTargets.length > 0) {
                if(creep.repair(repairTargets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(repairTargets[0]);
                }
            }
            else{
                creep.moveTo(Game.spawns['Home'], {visualizePathStyle: {stroke: '#ffffff'}})
            }
        }
	}
};

module.exports = roleFixer;