var utilMisc = require ('utility.misc')

var roleCarrier = {

    run: function(creep, targetSource) {

        var otherCarriers = creep.room.find(FIND_MY_CREEPS, {filter: (creep) => {return creep.memory.role == 'carrier'}})
        var sameMaster = false
        for (let i = 0; i < otherCarriers.length; i++) {
            if(otherCarriers[i].memory.master == creep.memory.master){
                sameMaster = true
            }
        }
        if(Game.creeps[creep.memory.master] == undefined || sameMaster){
            let uselessNobles = utilMisc.creepFunctions.carrierlessNobleCreeps(creep.room)
            if(uselessNobles.length > 0){
                console.log(creep.name + ' assigned to ' + uselessNobles[0])
                creep.memory.master = uselessNobles[0]
            }
        }
        

        if(creep.memory.delivering && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.delivering = false;
	    }
	    if(!creep.memory.delivering && creep.store.getFreeCapacity() == 0) {
	        creep.memory.delivering = true;
	    }

        if(creep.memory.delivering){
            let master = Game.creeps[creep.memory.master]
            let transferRes = creep.transfer(master, RESOURCE_ENERGY)
            if(transferRes == -9) {
                creep.moveTo(master.pos, {visualizePathStyle: {stroke: '#0e11beff'}})
            }
            else if(transferRes == -8 || transferRes == 0) {
                creep.drop(RESOURCE_ENERGY)
            }
            //else store energy
            else{
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_TOWER ||
                            structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE
                        ) &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
                });
                if(targets.length > 0) {
                    if(creep.transfer(targets[0], RESOURCE_ENERGY) == (ERR_NOT_IN_RANGE || ERR_FULL)) {
                        creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}})
                    } 
                }
            }
        }
        else{
            var sources = creep.room.find(FIND_SOURCES);
            var droppedEnergy = creep.room.find(FIND_DROPPED_RESOURCES).filter((resource) => resource.resourceType == RESOURCE_ENERGY)
            creep.moveTo(sources[targetSource], {visualizePathStyle: {stroke: '#e708d5ff'}})
            if(creep.pos.inRangeTo(sources[targetSource], 1) || creep.pos.inRangeTo(sources[targetSource], 2)){
                let nearbyEnergy = false
                for (let i = 0; i < droppedEnergy.length; i++) {
                    if(creep.pos.inRangeTo(droppedEnergy[i], 2)){
                        nearbyEnergy = true
                        if(creep.pickup(droppedEnergy[i])){
                            creep.moveTo(droppedEnergy[i])
                        }
                    }
                }
                if(!nearbyEnergy){
                    creep.memory.delivering = true
                }
            }
            // if(creep.pos.inRangeTo(sources[targetSource], 1) || creep.pos.inRangeTo(sources[targetSource], 2)){
            //     for(let i = 0; i < droppedEnergy.length; i++){
            //         if(creep.pickup(droppedEnergy[i]) == ERR_FULL){
            //             creep.memory.delivering = true;
            //             break;
            //         }
            //     }
            // }
        }
	}
};

module.exports = roleCarrier;