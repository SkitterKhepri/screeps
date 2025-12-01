var utilMisc = require ('utility.misc')

var spawnHarvester = {
    spawn : function(spawnerName, targetSource){
        var spawner = Game.spawns[spawnerName]
        var creepName = 'Harvester' + Game.time
        spawner.spawnCreep([WORK, WORK, CARRY, MOVE], creepName, {memory: {role:'harvester', target:targetSource}})
    }
}

var spawnUpgrader = {
    spawn : function(spawnerName, targetSource){
        var spawner = Game.spawns[spawnerName]
        var creepName = 'Upgrader' + Game.time
        spawner.spawnCreep([WORK, WORK, CARRY, MOVE], creepName, {memory: {role:'upgrader', upgrading:false, target:targetSource}})
    }
}

var spawnBuilder = {
    spawn : function(spawnerName, targetSource){
        var spawner = Game.spawns[spawnerName]
        var creepName = 'Builder' + Game.time
        spawner.spawnCreep([WORK, WORK, CARRY, MOVE], creepName, {memory: {role:'builder', target:targetSource}})
    }
}

var spawnHarvesterMK2 = {
    spawn : function(spawnerName, targetSource){
        var spawner = Game.spawns[spawnerName]
        var creepName = 'GENESIS' + Game.time
        spawner.spawnCreep([WORK, WORK, WORK, CARRY, MOVE], creepName, {memory: {role:'harvestermk2', target:targetSource}})
    }
}

var spawnUpgraderMK2 = {
    spawn : function(spawnerName){
        var spawner = Game.spawns[spawnerName]
        var creepName = 'PANACEA' + Game.time
        spawner.spawnCreep([WORK, WORK, WORK, CARRY, MOVE], creepName, {memory: {role:'upgradermk2', upgrading:false}})
    }
}

var spawnBuilderMK2 = {
    spawn : function(spawnerName){
        var spawner = Game.spawns[spawnerName]
        var creepName = 'DRAGON' + Game.time
        spawner.spawnCreep([WORK, WORK, WORK, CARRY, MOVE], creepName, {memory: {role:'buildermk2', building:false}})
    }
}

var spawnCarrier = {
    spawn : function(spawnerName, targetSource){
        var spawner = Game.spawns[spawnerName]
        var creepName = 'DOORMAKER' + Game.time
        let master = utilMisc.creepFunctions.carrierlessNobleCreeps(spawner.room)[0]
        spawner.spawnCreep([CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], creepName, {memory: {role:'carrier', target: targetSource, master: master}})
    }
}

var spawnCollector = {
    spawn : function(spawnerName, targetSource){
        var spawner = Game.spawns[spawnerName]
        var creepName = 'TEACHER' + Game.time
        spawner.spawnCreep([CARRY, CARRY, MOVE, MOVE], creepName, {memory: {role:'collector', target: targetSource, delivering : false}})
    }
}

var spawnFixer = {
    spawn : function(spawnerName){
        var spawner = Game.spawns[spawnerName]
        var creepName = 'SCAPEGOAT' + Game.time
        spawner.spawnCreep([WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE], creepName, {memory: {role:'fixer'}})
    }
}

module.exports = {spawnHarvester, spawnUpgrader, spawnBuilder, spawnHarvesterMK2, spawnUpgraderMK2, spawnBuilderMK2, spawnCarrier, spawnCollector, spawnFixer};