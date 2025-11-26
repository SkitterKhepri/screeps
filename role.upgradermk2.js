var roleUpgraderMK2 = {

    run: function(creep) {

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
            var droppedEnergy = creep.room.find(FIND_DROPPED_RESOURCES).filter((resource) => resource.resourceType == RESOURCE_ENERGY)
	        if(droppedEnergy.length > 0){
				for(let i = 0; i < droppedEnergy.length; i++){
                    if(creep.pickup(droppedEnergy[i]) == 0){
                        creep.memory.upgrading = true;
                        break;
                    }
                }
	        }
        }
	}
};

module.exports = roleUpgraderMK2;