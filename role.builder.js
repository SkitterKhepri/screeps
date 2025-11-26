var roleBuilder = {

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
	    }
	    else {
	        //if(creep.store.getFreeCapacity() == 0){
	        //    creep.moveTo(Game.spawns['Home'], {visualizePathStyle: {stroke: '#ffffff'}});
	        //}
            //var droppedEnergy = creep.room.find(FIND_DROPPED_RESOURCES).filter((resource) => resource.resourceType == RESOURCE_ENERGY)
	        //if(droppedEnergy.length > 0){
	        //    if(creep.pickup(droppedEnergy[0]) == ERR_NOT_IN_RANGE){
	        //        creep.moveTo(droppedEnergy[0], {visualizePathStyle: {stroke: '#00a86b'}})
	        //    }
	        //}
	        var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
	    }
	}
};

module.exports = roleBuilder;