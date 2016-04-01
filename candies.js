"use strict"

function Player() {

  this.training = false
  this.eatBeforeWorkout = true
  this.autoSaveDelay = 5 * 60 * 1000
  this.log = {
    eating : {
      meals : 0,
      candies : 0
    },
    training : {
      destination: '',
      workOuts : 0,
      startHP : 0,
      endHP: 0
    }
  };

  let self = this

  let checkQuestingInterval
  let scheduleWorkoutTimeout
  let autosaveInterval

  function getTiredTime () {
    var waitPattern = /Waiting time : [0-9]{1,3}/;

    var found = 
      document.getElementById('mood')
        .innerHTML
        .match(waitPattern);

    if (found) {
      // return the number of seconds we're waiting
      return new Number(found[0]
          .split(' ')[3]
      ) || 0;
    } else {
      return 0;
    }

  }

  function getCandiesEaten () {

    /*
     * get the number of candies eaten by getting the candies_eaten div, 
     * spliting it by spaces, getting the fourth chunk which has the number 
     * of candies eaten, then ultimately converting that to a number type
     */
    return new Number(
      document.getElementById('candies_eaten')
        .innerHTML
        .split(' ')[3]
    );

  }

  function getCandiesFound () {

    var candiesFoundPattern = /You found [0-9]+/;

    /* 
     * get the quest div innerHTML, find the line with the number of candies 
     * found, split it by spaces, then get the third chunk.
     */
    return new Number(
      document.getElementById('quest')
        .innerHTML
        .match(candiesFoundPattern)[0]
        .split(' ')[2]
    ) || 0;

  }

  function getCandiesNow () {
    /*
     * get the number of candies right now by getting the candies div, 
     * spliting it by spaces, getting the third chunk which has the number 
     * of candies, then ultimately converting that to a number type
     */ 
    return candies.nbrOwned;
  }
  
  function getDestination () {

    // the quest_destination select box
    var destination = document.getElementById('quest_destination');

    // the id of the option that is selected
    var child = destination.selectedIndex;
    
    // return the text of the option
    return destination.childNodes[child].innerHTML;
  }

  function getHP () {
    let index = quest.getCharacterIndex()

    return quest.things[index].max_hp
  }

  function scheduleNextWorkout () {

    console.log('scheduling next workout...')

    // check every second until we have finished questing
    checkQuestingInterval = setInterval(function () {

      // console.log('quest.weAreQuestingRightNow', quest.weAreQuestingRightNow)

      // once we are done questing
      if (!quest.weAreQuestingRightNow) {

        console.log('we are are not questing!  lets see how long we need to wait until we can go...')

        // stop checking every second
        clearInterval(checkQuestingInterval);
        checkQuestingInterval = null;

        let tiredTime = getTiredTime()

        // now schedule the next quest to happen once tired time has elapsed
        scheduleWorkoutTimeout = setTimeout(function () {
          scheduleWorkoutTimeout = null
          if (self.eatBeforeWorkout) {
            self.eat()
          }
          self.workOut()
        }, tiredTime * 1000)
          
        // output wait time
        console.log(new Date() + ': workout session in ' + tiredTime + ' seconds...');


    
      } 
    }, 1000)
      
  }

  this.stopTraining = function () {
    self.training = false

    if (checkQuestingInterval) {
      clearInterval(checkQuestingInterval)
    }

    if (scheduleWorkoutTimeout) {
      clearTimeout(scheduleWorkoutTimeout)
    }


    var log = self.log;

    console.log('That was one heck of a training session!');
    console.log('You worked out ' + log.training.workOuts + ' times.');
    console.log('You ate ' + log.eating.candies + ' candies.' );
    console.log('These candies have raised your HP from ' + log.training.startHP + ' to ' + log.training.HP + '!' );

    self.log.training.startHP = 0;
  };

  this.eat = function() {

    var candiesNow = getCandiesNow();
    
    // eat all the candies!! why wait?
    candies.eat();

    // add the number of meals and candies eaten this time to the log
    self.log.eating.meals++;
    self.log.eating.candies += candiesNow;

    var total = getCandiesEaten();

    // note the log in the console, no?
    var msg = new Date() + ': eating ' + candiesNow + ' candies!! ' 
      + self.log.eating.candies + ' in ' + self.log.eating.meals + ' meals; ' 
      + total + ' this game.';

    console.log(msg);
  };

  this.workOut = function () {

    let questing = quest.weAreQuestingRightNow
    let tiredTime = getTiredTime();

    // if we are questing 
    if (questing || tiredTime > 0 ) {
      console.log('we are not ready to workOut')
      return false 
    } else {
      // we are ready to start questing! 
      console.log('we are ready!  lets workOut!')
      quest.begin(true);

      // increment the training workout log
      self.log.training.workOuts++;

      // note the training destination
      self.log.training.destination = getDestination();

      if (self.log.training.startHP === 0) {
        self.log.training.startHP = quest.things[quest.getCharacterIndex()].max_hp
      }

      self.log.training.HP = getHP();

      // build the console log message
      var msg = new Date() + ": workout session " + self.log.training.workOuts + " at " + self.log.training.destination + ' - HP: ' + self.log.training.HP;
      console.log(msg);

      if (self.training) {
        scheduleNextWorkout()
      }

      return true
    }
  };

  this.train = function (options) {

    options = options || {};

    // build the confirmation message string
    var msg = "You're about to train at " + getDestination() + ".\n\nDo it?";

    // confirm sure they want to train in the selected destination 
    if (window.confirm(msg)) {
      // announce the new training schedule
      console.log(new Date() + ': beginning training at ' + getDestination())

      self.training = true
      self.eatBeforeWorkout = (options.eat === undefined) ? true : options.eat

      scheduleNextWorkout()

    } else {
      console.log('Okay, we won\'t train at ' + getDestination());
    }

  };

  this.enableAutoSave = function (delay) { 

    self.autoSaveDelay (delay === undefined) ? self.autoSaveDelay : delay

    autosaveInterval = setInterval(function () { 
      save() 
    }, self.autoSaveDelay)

  }

  this.disableAutoSave = function () {
    clearInterval(autosaveInterval)
  }

}


player = new Player()

console.log (player);
