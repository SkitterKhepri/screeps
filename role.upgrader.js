var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep, targetSource) {

        if(creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.upgrading = false;
	    }
	    if(!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
	        creep.memory.upgrading = true;
	    }

	    if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else {
            //var droppedEnergy = creep.room.find(FIND_DROPPED_RESOURCES).filter((resource) => resource.resourceType == RESOURCE_ENERGY)
	        //if(droppedEnergy.length > 0){
	        //    if(creep.pickup(droppedEnergy[0]) == ERR_NOT_IN_RANGE){
	        //        creep.moveTo(droppedEnergy[0], {visualizePathStyle: {stroke: '#00a86b'}})
	        //    }
	        //}
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[targetSource]) == ERR_NOT_IN_RANGE) {
                if(creep.moveTo(sources[targetSource], {visualizePathStyle: {stroke: '#ffaa00'}}) == ERR_NO_PATH){
                    if(sources.length == parseInt(creep.memory.target) + 1){
                        creep.memory.target = 0
                    }
                    else{
                        creep.memory.target = parseInt(creep.memory.target) + 1
                    }
                }
            }
        }
	}
};

module.exports = roleUpgrader;