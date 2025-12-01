var utilMisc = require ('utility.misc')

var roleCollector = {

    run: function(creep, targetSource) {

        //TODO wait and see. maybe, possible refine the logic about where to pick up energy from

        if(creep.memory.delivering && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.delivering = false;
        }
        if(!creep.memory.delivering && creep.store.getFreeCapacity() == 0) {
            creep.memory.delivering = true;
        }


        if(creep.room.energyAvailable > 500){
            if(creep.memory.delivering){
                // console.log('deliverAnywhere')
                deliverAnyWhere(creep)
            }
            else{
                // console.log('pickupEnergyBySource')
                pickupEnergyBySource(creep, targetSource)
            }
        }
        else if(utilMisc.otherFunc.getStoredEnergy(creep.room) > 200){
            if(creep.memory.delivering){
                // console.log('pickupEnergyBySource')
                deliverToSpawn(creep)
            }
            else{
                // console.log('withdrawFromStored')
                withdrawFromStored(creep)
            }
        }
        else{
            if(creep.memory.delivering){
                // console.log('pickupEnergyBySource - 2')
                deliverToSpawn(creep)
            }
            else{
                // console.log('pickupEnergyBySource - 2')
                pickupEnergyBySource(creep, targetSource)
            }
        }
    }
};

function deliverAnyWhere(creep){
    if(creep.memory.delivering){
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

function pickupEnergyBySource(creep, targetSource){
    var sources = creep.room.find(FIND_SOURCES);
    var droppedEnergy = creep.room.find(FIND_DROPPED_RESOURCES).filter((resource) => resource.resourceType == RESOURCE_ENERGY)
    creep.moveTo(sources[targetSource], {visualizePathStyle: {stroke: '#e708d5ff'}})
    if(creep.pos.inRangeTo(sources[targetSource], 1) || creep.pos.inRangeTo(sources[targetSource], 2)){
        let energyInRange = false
        for (let i = 0; i < droppedEnergy.length; i++) {
            if(creep.pos.inRangeTo(droppedEnergy[i], 2)){
                energyInRange = true
                if(creep.pickup(droppedEnergy[i])){
                    creep.moveTo(droppedEnergy[i])
                }
            }
        }
        if(!energyInRange){
            console.log('Going Home')
            goHome(creep)
        }
    }
}

function withdrawFromStored(creep){
    var targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_STORAGE || structure.structureType == STRUCTURE_CONTAINER) &&
                    structure.store[RESOURCE_ENERGY] > 0;
            }
        });
    if(targets.length == 0){
        return false;
    }
    if(creep.withdraw(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
        creep.moveTo(targets[0]);
    }
    return true;
}

function deliverToSpawn(creep){
    var targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });
    if(targets.length > 0) {
        if(creep.transfer(targets[0], RESOURCE_ENERGY) == (ERR_NOT_IN_RANGE || ERR_FULL)) {
            creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}})
        } 
    }
}

function goHome(creep){
    creep.moveTo(creep.room.find(FIND_MY_STRUCTURES, {filter: (structure) => {return (structure.structureType == STRUCTURE_SPAWN)}})[0])
}

module.exports = roleCollector;