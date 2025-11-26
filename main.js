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

module.exports.loop = function () {

    if(Game.spawns['Home'].room.find(FIND_HOSTILE_CREEPS).length != 0){
        unsafe = true
        let enemyCreep = Game.spawns['Home'].room.find(FIND_HOSTILE_CREEPS)[0]
        if(Game.spawns['Home'].room.controller.activateSafeMode() == 0){
            Game.notify('Ellenség spotted! Safe mode active!\nEnemy creep owner: ' + enemyCreep.owner.username + '\nEnemy creep data: ' + JSON.stringify(enemyCreep))
            console.log('Enemy at the gates!\nEnemy creep owner: ' + enemyCreep.owner.username + '\nEnemy creep data: ' + JSON.stringify(enemyCreep))
        }
        else{
            Game.notify('Ellenség spotted! Safe mode CANNOT BE ACTIVATED! EMERGENCY!\nEnemy creep owner: ' + enemyCreep.owner.username + '\nEnemy creep data: ' + JSON.stringify(enemyCreep))
        }
        let tower = Game.getObjectById('6924f1b10330f44ef6370a50')
        tower.attack(enemyCreep)
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


    // if(!unsafe){
    //     var minSourceKey = 0
    //     minSourceKey = utilMisc.sourceFunctions.minHarvesterSource()
        
    //     var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        
    //     if(harvesters.length < 4) {
    //         utilSpawning.spawnHarvester.spawn('Home', minSourceKey)
    //     }
    //     else{
    //         if(_.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader').length < 1){
    //             utilSpawning.spawnUpgrader.spawn('Home', minSourceKey)
    //         }
    //         // else{
    //         //     if(_.filter(Game.creeps, (creep) => creep.memory.role == 'builder').length < 2){
    //         //         utilSpawning.spawnBuilder.spawn('Home', minSourceKey)
    //         //     }
    //         // }
    //     }
    // }

    var carriers = []
    var nobles = []
    for(var name in Memory.creeps) {
        let creep = Game.creeps[name]
        if(creep.memory.master){
            carriers.push(creep)
        }
        if(creep.memory.role == 'buildermk2' || creep.memory.role == 'upgradermk2'){
            nobles.push(creep)
        }
    }
    // for(let i = 0; i < carriers.length; i++){
    //     console.log(carriers[i].memory.master)
    // }
    // console.log('nobles: ' + nobles)
    // console.log('carriers: ' + carriers)
    // console.log(utilMisc.creepFunctions.carrierlessNobleCreeps(Game.spawns['Home'].room))
    utilMisc.creepFunctions.carrierlessNobleCreeps(Game.spawns['Home'].room)

    if(!unsafe){
        var minSourceKey = 0
        minSourceKey = utilMisc.sourceFunctions.minSourceKey(Game.spawns['Home'].room, ['harvester', 'upgrader', 'builder', 'harvestermk2'])
        var maxSourceKey = 0
        maxSourceKey = utilMisc.sourceFunctions.maxSourceKey(Game.spawns['Home'].room, 'harvestermk2')
        
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvestermk2');
        var uselessNobles = utilMisc.creepFunctions.carrierlessNobleCreeps(Game.spawns['Home'].room)
        var constructionSitesPresent = Game.spawns['Home'].room.find(FIND_MY_CONSTRUCTION_SITES).length > 0 ? true : false
        if(uselessNobles.length > 0){
            console.log('carrier spawn')
            utilSpawning.spawnCarrier.spawn('Home', utilMisc.sourceFunctions.minSourceKey(Game.spawns['Home'].room, 'carrier'))
        }
        else{
            if(harvesters.length < 2) {
                console.log('harvester spawn - 1')
                utilSpawning.spawnHarvesterMK2.spawn('Home', utilMisc.sourceFunctions.minSourceKey(Game.spawns['Home'].room, ['harvestermk2']))
            }
            else{
                if(_.filter(Game.creeps, (creep) => creep.memory.role == 'collector').length < 2){
                    console.log('collector spawn - 1')
                    utilSpawning.spawnCollector.spawn('Home', utilMisc.sourceFunctions.maxSourceKey(Game.spawns['Home'].room, 'harvestermk2'))
                }
                else if(_.filter(Game.creeps, (creep) => creep.memory.role == 'upgradermk2').length < 1){
                    console.log('upgrader spawn - 1')
                    utilSpawning.spawnUpgraderMK2.spawn('Home', minSourceKey)
                }
                else if(constructionSitesPresent){
                    if(_.filter(Game.creeps, (creep) => creep.memory.role == 'buildermk2').length < 1){
                        console.log('builder spawn - 1')
                        utilSpawning.spawnBuilderMK2.spawn('Home', minSourceKey)
                    }
                }
                else if(_.filter(Game.creeps, (creep) => creep.memory.role == 'fixer').length < 2){
                    utilSpawning.spawnFixer.spawn('Home')
                    console.log('fixer spawn')
                }
                else if(harvesters.length < 4){
                    utilSpawning.spawnHarvesterMK2.spawn('Home', minSourceKey)
                    console.log('harvester spawn - 2')
                }
                else{
                    if(constructionSitesPresent){
                        if(_.filter(Game.creeps, (creep) => creep.memory.role == 'buildermk2').length < 2){
                            console.log('builder spawn - 2')
                            utilSpawning.spawnBuilderMK2.spawn('Home', minSourceKey)
                        }
                        if(_.filter(Game.creeps, (creep) => creep.memory.role == 'upgradermk2').length < 2){
                            utilSpawning.spawnUpgraderMK2.spawn('Home', minSourceKey)
                            console.log('upgrader spawn - 2')
                        }
                    }
                    else if(!constructionSitesPresent){
                        if(_.filter(Game.creeps, (creep) => creep.memory.role == 'upgradermk2').length < 3){
                            utilSpawning.spawnUpgraderMK2.spawn('Home', minSourceKey)
                            console.log('upgrader spawn - 3')
                        }
                    }
                }
            }
        }
    }
    

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
}