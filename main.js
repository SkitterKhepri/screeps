var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleHarvesterMK2 = require('role.harvestermk2')
var roleUpgraderMK2 = require('role.upgradermk2')
var roleBuilderMK2 = require('role.buildermk2')
var roleCarrier = require('role.carrier')
var roleCollector = require('role.collector')
var roleFixer = require('role.fixer')

var utilMisc = require ('utility.misc')
var utilSpawning = require('utility.spawning');

var unsafe = false

function attackStart(){
    Memory.currentAttack.ongoing = true
    Memory.currentAttack.start = Game.time
}

module.exports.loop = function () {


    //TODO refactor all roles into functions -- pls, for the love of fuck!

    const thisRoom = Game.spawns['null'].room

    if(thisRoom.find(FIND_HOSTILE_CREEPS).length != 0){
        if(thisRoom.controller.safeMode <= 0){
            unsafe = true
        }
        let enemyCreeps = thisRoom.find(FIND_HOSTILE_CREEPS)

        if(thisRoom.controller.activateSafeMode() == 0){
            Game.notify('Attack! Safe mode YES!\nAttacker: ' + enemyCreeps[0].owner.username + '\nEnemy creep data: ' + JSON.stringify(enemyCreeps[0]))
            console.log('Enemy at the gates!\nAttacker: ' + enemyCreeps[0].owner.username + '\nEnemy creep data: ' + JSON.stringify(enemyCreeps[0]))
        }
        else{
            Game.notify('Attack! Safe mode NO! \nEnemy creep owner: ' + enemyCreeps[0].owner.username + '\nEnemy creep data: ' + JSON.stringify(enemyCreeps[0]))
        }
        let towers = thisRoom.find(FIND_STRUCTURES, {filter: (structure) => {return (structure.structureType == STRUCTURE_TOWER)}})
        for(var tower of towers){
            tower.attack(enemyCreeps[0])
        }
    }
    else{
        unsafe = false
    }

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    //RESET CURRENT ATTACK MEMORY
    // var tempMemory = JSON.parse(RawMemory.get())
    // tempMemory.currentAttack = {ongoing : false, start : 0, end : 0, creeps : []}
    // RawMemory.set(JSON.stringify(tempMemory))
    // //RESET ATTACK ARCHIVE
    // var tempMemory = JSON.parse(RawMemory.get())
    // tempMemory.attackArchive = []
    // //Attack Template
    // //{time : 0, attackers : [], creepAmount : 0, creepsData : {}, CPUUsedSaving : 0}
    // RawMemory.set(JSON.stringify(tempMemory))

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep, creep.memory.target);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep, creep.memory.target);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep, creep.memory.target);
        }
        if(creep.memory.role == 'harvestermk2') {
            roleHarvesterMK2.run(creep, creep.memory.target);
        }
        if(creep.memory.role == 'upgradermk2') {
            roleUpgraderMK2.run(creep);
        }
        if(creep.memory.role == 'buildermk2') {
            roleBuilderMK2.run(creep);
        }
        if(creep.memory.role == 'carrier') {
            roleCarrier.run(creep, creep.memory.target);
        }
        if(creep.memory.role == 'collector') {
            roleCollector.run(creep, creep.memory.target);
        }
        if(creep.memory.role == 'fixer') {
            roleFixer.run(creep);
        }
    }

    
    if(Memory.advancedEcon == undefined){
        let tempMemory = JSON.parse(RawMemory.get())
        tempMemory.advancedEcon = false
        RawMemory.set(JSON.stringify(tempMemory))
    }
    else if(!Memory.advancedEcon){
        if(!unsafe){
            var minSourceKeyVar = 0
            minSourceKeyVar = utilMisc.sourceFunctions.minSourceKey(thisRoom, 'harvester')
            
            var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
            
            if(harvesters.length < 4) {
                utilSpawning.spawnHarvester.spawn('null', minSourceKeyVar)
            }
            else{
                if(_.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader').length < 1){
                    utilSpawning.spawnUpgrader.spawn('null', minSourceKeyVar)
                }
                else{
                    if(_.filter(Game.creeps, (creep) => creep.memory.role == 'builder').length < 3){
                        utilSpawning.spawnBuilder.spawn('null', minSourceKeyVar)
                    }
                }
            }
        }
        if(thisRoom.find(FIND_MY_STRUCTURES, {filter: { structureType: STRUCTURE_EXTENSION }}).length >= 10 && thisRoom.energyAvailable >= 800){
            Memory.advancedEcon = true
        }
    }
    else if(Memory.advancedEcon){
        //TODO at spawning collectors and carriers take into account other collectors/carriers as well, not just harvesters -- maybe conditionally, if harvesters are equal?
        let harvestermk2List = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvestermk2');
        let carrierList = _.filter(Game.creeps, (creep) => creep.memory.role == 'carrier')
        let collectorList = _.filter(Game.creeps, (creep) => creep.memory.role == 'collector')
        let upgradermk2List = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgradermk2')
        let buildermk2List = _.filter(Game.creeps, (creep) => creep.memory.role == 'buildermk2')
        let fixerList = _.filter(Game.creeps, (creep) => creep.memory.role == 'fixer')
        if(!unsafe){
            var minSourceKeyVar = 0
            minSourceKeyVar = utilMisc.sourceFunctions.minSourceKey(thisRoom, ['harvester', 'upgrader', 'builder', 'harvestermk2'])
            // var maxSourceKey = 0
            // maxSourceKey = utilMisc.sourceFunctions.maxSourceKey(thisRoom, 'harvestermk2')
            
            var uselessNobles = utilMisc.creepFunctions.carrierlessNobleCreeps(thisRoom)
            var constructionSitesPresent = thisRoom.find(FIND_MY_CONSTRUCTION_SITES).length > 0 ? true : false

            if(uselessNobles.length > 0){
                console.log('carrier spawn')
                utilSpawning.spawnCarrier.spawn('null', utilMisc.sourceFunctions.minSourceKey(thisRoom, 'carrier'))
            }
            else{
                if(harvestermk2List.length < 2) {
                    console.log('harvester spawn - 1')
                    utilSpawning.spawnHarvesterMK2.spawn('null', utilMisc.sourceFunctions.minSourceKey(thisRoom, ['harvestermk2']))
                }
                else{
                    if(collectorList.length < 2){
                        console.log('collector spawn - 1')
                        utilSpawning.spawnCollector.spawn('null', utilMisc.sourceFunctions.maxSourceKey(thisRoom, 'harvestermk2'))
                    }
                    else if(upgradermk2List.length < 1){
                        console.log('upgrader spawn - 1')
                        utilSpawning.spawnUpgraderMK2.spawn('null', minSourceKeyVar)
                    }
                    else if(fixerList.length < 2){
                        utilSpawning.spawnFixer.spawn('null')
                        console.log('fixer spawn')
                    }
                    else if(harvestermk2List.length < 4){
                        utilSpawning.spawnHarvesterMK2.spawn('null', minSourceKeyVar)
                        console.log('harvester spawn - 2')
                    }
                    else{
                        if(constructionSitesPresent){
                            if(buildermk2List.length < 2){
                                console.log('builder spawn - 2')
                                utilSpawning.spawnBuilderMK2.spawn('null', minSourceKeyVar)
                            }
                        }
                        else if(!constructionSitesPresent){
                            if(upgradermk2List.length < 2){
                                utilSpawning.spawnUpgraderMK2.spawn('null', minSourceKeyVar)
                                console.log('upgrader spawn - 3')
                            }
                        }
                    }
                }
            }
        }


        var storedEnergy = 0
        var containers = thisRoom.find(FIND_STRUCTURES, {
                filter: (structure) => {return (structure.structureType == STRUCTURE_STORAGE || structure.structureType == STRUCTURE_CONTAINER)}
            });
        var droppedEnergyAmount = 0
        var droppedEnergy = thisRoom.find(FIND_DROPPED_RESOURCES).filter((resource) => resource.resourceType == RESOURCE_ENERGY)
        for(let i = 0; i < containers.length; i++){
            storedEnergy += containers[i].store.getUsedCapacity(RESOURCE_ENERGY)
        }
        for(let i = 0; i < droppedEnergy.length; i++){
            droppedEnergyAmount += droppedEnergy[i].amount
        }
        //TODO refactor into function somewhere
        //Economy crash
        //base condition
        if(collectorList.length == 0 && harvestermk2List.length == 0){
            //base condition &&
            if(thisRoom.energyAvailable < 700){
                //mitigating factors for previous condition (need to both be untrue for crash)
                if(!(storedEnergy > 700 && collectorList.length > 0) && !(droppedEnergyAmount > 700 && collectorList.length > 0)){
                    let factor1 = collectorList.length == 0
                    let factor2 = harvestermk2List.length == 0
                    let factor3 = thisRoom.energyAvailable < 700
                    let factor4_1 = storedEnergy > 700
                    let factor4_2 = collectorList.length > 0
                    let factor5_1 = droppedEnergyAmount > 700
                    let factor5_2 = collectorList.length > 0
                    //attempt to fix by reassigning carriers
                    if((factor4_1 || factor5_1) && carrierList.length > 0){
                        carrierList[0].memory.role = 'collector'
                        Game.notify('Economy crash averted by reassignment!')
                        console.log('Economy crash averted by reassignment!')
                    }
                    //crash happens
                    else{
                        Game.notify('Economy crashed!')
                        Game.notify('Factor 1: ' + factor1 + '\nFactor 2: ' + factor2 + '\nFactor 3: ' + factor3 + '\nFactor 4.1: ' + factor4_1 + '\nFactor 4.2: ' + factor4_2
                             + '\nFactor 5.1: ' + factor5_1 + '\nFactor 5.2: ' + factor5_2
                        )
                        console.log('Economy crashed!')
                        console.log('Factor 1: ' + factor1 + '\nFactor 2: ' + factor2 + '\nFactor 3: ' + factor3 + '\nFactor 4.1: ' + factor4_1 + '\nFactor 4.2: ' + factor4_2
                             + '\nFactor 5.1: ' + factor5_1 + '\nFactor 5.2: ' + factor5_2
                        )
                        Memory.advancedEcon = false
                    }
                }
            }
        }
    }

    
    //checking if new master assignment works
    // for(let i = 0; i < carriers.length; i++){
    //     console.log(carriers[i].memory.master)
    // }
    // console.log('nobles: ' + nobles)
    // console.log('carriers: ' + carriers)
    // console.log(utilMisc.creepFunctions.carrierlessNobleCreeps(thisRoom))
    
}