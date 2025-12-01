var roleBuilderMK2 = {
    //initially move to target, make it pick up resources from the ground, doesnt need to move if not found

    run: function(creep) {
        
	    if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
	    }
	    if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
	        creep.memory.building = true;
	    }

	    if(creep.memory.building) {
	        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length > 0) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
			else{
				let repairTargets = creep.room.find(FIND_STRUCTURES, {
                	filter: object => {return object.hits < object.hitsMax}
            	});
			
            	// repairTargets.sort((a,b) => a.hits - b.hits);
			
            	if(repairTargets.length > 0) {
					repairTargets.sort((a,b) => a.hits - b.hits);
					creep.repair(repairTargets[0])
            	    // for (let i = 0; i < repairTargets.length; i++) {
					// 	creep.repair(repairTargets[i])
					// }
            	}
			}
			//Go home. not needed, probably?
            // if(targets.length == 0){
            //     creep.moveTo(Game.spawns['null'], {visualizePathStyle: {stroke: '#ffffff'}});
            // }
	    }
	    else {
            var droppedEnergy = creep.room.find(FIND_DROPPED_RESOURCES).filter((resource) => resource.resourceType == RESOURCE_ENERGY)
	        if(droppedEnergy.length > 0){
				for(let i = 0; i < droppedEnergy.length; i++){
                    if(creep.pickup(droppedEnergy[i]) == 0){
                        creep.memory.building = true;
                        break;
                    }
                }
	        }
	    }
	}
};

module.exports = roleBuilderMK2;