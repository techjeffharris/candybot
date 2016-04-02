"use strict";

window.CandyBoxBot = (function exportCandyBoxBot () {

  const DEFAULTS_AUTO_EAT       = false
  const DEFAULTS_AUTO_QUEST     = false
  const DEFAULTS_AUTO_SAVE      = false
  const DEFAULTS_AUTO_SAVE_FREQ = 60 * 1000

  let autoSaveInterval
  let checkQuestingInterval
  let scheduleWorkoutTimeout


  function CandyBoxBot_Class(options) {

    options = options || {}

    let self = this


    this.options = {
      autoQuest:    options.autoQuest     || DEFAULTS_AUTO_QUEST,
      autoEat:      options.autoEat       || DEFAULTS_AUTO_EAT,
      autoSave:     options.autoSave      || DEFAULTS_AUTO_SAVE,
      autoSaveFreq: options.autoSaveFreq  || DEFAULTS_AUTO_SAVE_FREQ
    }

    this.questSessions = [new QuestSession()]

    this.autoEat          = autoEat
    this.autoQuest        = autoQuest
    this.autoSave         = autoSave
    this.disableAutoEat   = disableAutoEat
    this.disableAutoQuest = disableAutoQuest
    this.disableAutoSave  = disableAutoSave
    this.eatCandies       = eatCandies
    this.goOnQuest        = goOnQuest

    if (this.options.autoQuest) {
      scheduleNextQuest()
    }

    if (this.options.autoSave) {
      this.autoSave()
    }

    function autoEat () {
      self.options.autoEat = true
      logger('autoEat enabled!')
    }

    function autoQuest () {

      logger("autoQuest enabled!")

      self.options.autoQuest = true

      self.questSessions.push(new QuestSession())

      scheduleNextQuest()

    }

    function autoSave (freq) { 

      self.options.autoSave = true
      self.options.autoSaveFreq = (freq === undefined) ? self.options.autoSaveFreq : freq

      alert('autoSave enabled! When the next alert dialog appears, check the box that says "Prevent this page from creating additional dialogs" otherwise all progress will be paused every 5 minutes until you click "ok"')

      // the global function save() should do
      document.getElementById('saveButton').click()

      autoSaveInterval = setInterval(function () { 
        logger('auto-saving...')
        save() 
      }, self.options.autoSaveFreq)

      logger('autoSave enabled!')

    }

    function disableAutoEat () {
      logger('disabled autoEat!')
      self.options.autoEat = false
    }

    function disableAutoQuest () {
      self.options.autoQuest = false

      if (checkQuestingInterval) {
        clearInterval(checkQuestingInterval)
      }

      if (scheduleWorkoutTimeout) {
        clearTimeout(scheduleWorkoutTimeout)
      }

      let questSession = getQuestSession()

      logger(JSON.stringify(questSession, null, 2))

      logger(['Disabled autoQuest!\n' 
        , 'Holy crap, Morty!  You embarked on ', questSession.quests.length, ' quest(s)!\n'
        , 'You ate ', questSession.candiesEaten, ' candies.\n'
        , 'These candies have raised your HP from ', questSession.startHP, ' to ', getHP(), '!'].join('')
      );

    }

    function disableAutoSave () {
      clearInterval(autoSaveInterval)
      autoSaveInterval = null

      logger('autoSave disabled!')
    }

    function eatCandies() {

      let meal = new Meal()
      
      // eat all the candies!! why wait?
      candies.eat();

      let questSession = getQuestSession()

      questSession.meals.push(meal)
      questSession.candiesEaten += meal.candies

      // note the stats in the console, no?
      var msg = 'eating ' + meal.candies + ' candies!!\n' 
        + 'eaten ' + questSession.candiesEaten + ' in ' + questSession.meals.length + ' meals this autoQuest session\n' 
        + getCandiesEaten() + ' total candies eaten this game.';

      logger(msg);
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

    function getCurrentQuest () {

      let qs = getQuestSession()

      return qs.quests[qs.quests.length -1]
    }

    function getDate (date) {

      date = date || new Date()

      let options = {
        weekday:  'short',
        hour:     'numeric',
        minute:   'numeric'
      }

      return date.toLocaleString('en-US', options)
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

      return getQuestSession().quests.slice(-1)[0].hp
    }

    function getQuestSession () {
      return self.questSessions[self.questSessions.length -1]
    }

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

    function goOnQuest () {


      let questing = quest.weAreQuestingRightNow
      let tiredTime = getTiredTime();

      // if we are questing 
      if (questing || tiredTime > 0 ) {
        logger('we are not ready to goOnQuest')
        return false 
      } else {
        // we are ready to start questing! 
        quest.begin(true);

        let questSession = getQuestSession()

        if (!questSession.quests.length) {
          questSession.startHP = quest.things[quest.getCharacterIndex()].hp
        }

        let particularQuest = questSession.addQuest()

        // build the console stats message
        var msg = [
          "going on quest ", 
          Number(particularQuest.id + 1), 
          " at ", 
          particularQuest.destination, 
          ' - HP: ', 
          particularQuest.hp
        ].join('')

        logger(msg);

        if (self.options.autoQuest) {
          scheduleNextQuest()
        }

        return true
      }
    }

    function logger (message) {
      console.log(getDate() + ': ' + message)
    }

    function scheduleNextQuest () {

      let first = true

      let q = getCurrentQuest()

      // check every second until we have finished questing
      checkQuestingInterval = setInterval(function () {

        // if we are questing
        if (quest.weAreQuestingRightNow) {

          // if 
          if (first) {
            first = false
            logger('Waiting for quest to finish to schedule next quest...')
          }

          if (q) {
            q.candiesFound = getCandiesFound()
          }

        } else {

          if (q && q.candiesFound) {
            logger('that was a crazy quest!\n'
              + 'you found ' + getCurrentQuest().candiesFound + ' candies!'
            )
          }


          // stop checking every second
          clearInterval(checkQuestingInterval);
          checkQuestingInterval = null;

          let tiredTime = getTiredTime()

          // the pink ring makes tired time decrease 2x as fast
          if (objects.list.pinkRing.have == true) {
            tiredTime = Math.ceil(tiredTime / 2)
          }

          // now schedule the next quest to happen once tired time has elapsed
          scheduleWorkoutTimeout = setTimeout(function () {
            scheduleWorkoutTimeout = null
            if (self.options.autoEat) {
              self.eatCandies()
            }
            self.goOnQuest()
          }, (tiredTime * 1000) + 1)

          if (tiredTime > 1) {
            // output wait time
            logger('going on quest in ' + tiredTime + ' seconds...');
          }


      
        } 
      }, 1000)
        
    }

    function QuestSession () {
      this.startHP      = 0
      this.quests       = []
      this.meals        = []
      this.candiesEaten = 0
    }

    QuestSession.prototype.addQuest = function addQuest () {
      let particularQuest = new Quest()
      this.quests.push(particularQuest)
      return particularQuest
    }

    function Quest () {

      this.id           = getQuestSession().quests.length
      this.time         = getDate()
      this.destination  = getDestination()
      this.hp           = quest.things[quest.getCharacterIndex()].hp
      this.candiesFound = getCandiesFound()

    }

    function Meal () {
      this.time     = getDate(),
      this.candies  = getCandiesNow()
    }
  }

  return CandyBoxBot_Class

}())
