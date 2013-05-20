
var MILLI 	= 1;
var SECOND	= 1000 * MILLI;
var MINUTE	= 60 * SECOND;
var HOUR	= 60 * MINUTE;
var DAY		= 24 * HOUR;
var WEEK	= 7 * DAY;

function newTrainingSession() {
	this.log.training.push({
		destination	: 	'',
		HP : { 
			start : 0,
			stop : 0
		},
		interval : 0,
		intervalID : null,
		meals : [],
		quests : [],
		started : new Date(),
		stopped : Date,
		
		// returns a human-readable string with the duration of the workout
		duration : function () {
			// gets the difference in milliseconds
			var difference = session.stopped.UTC() - session.started.UTC();
			
			var duration = { 
				totalTime : difference
			};
			
			// if longer than one week
			if (difference > WEEK) 
				// note the number of weeks ignore the decimals
				duration.weeks = (difference / WEEK).toFixed(0);
				
				// subtract the 
				d
			
			if (difference % DAY)
				duration.days = difference / DAY;
				
			if (difference % HOUR) 
				duration.hours = difference / HOUR;
				
			if (difference % MINUTE)
				duration.minutes = difference / MINUTE;
				
			if (difference % SECOND)
				duration.seconds = difference / SECOND;
				
			
			return duration;
		},
		
		// shortcut for getting the total number of candies eaten this session
		totalCandies : function () {
			var total = 0;
			for (var meal in this.meals) {
				total += this.meals[meal];
			}
			return total;
		}
	});
};

function stopTraining() {
	
	var session = this.currentSession;

	// clears the interval then sets the intervalID store to null 
	clearInterval(session.intervalID);
	
	
	
	console.log('That was one heck of a training session!');
	console.log('You went on ' + session.quests.length + ' epic quests.');
	console.log('You ate ' + session.totalCandies() + ' candies.' );
	console.log('These candies have raised your HP to ' + log.training.HP );
};

function eat() {
	/*
	 * get the number of candies right now by getting the candies div, 
	 * spliting it by spaces, getting the third chunk which has the number 
	 * of candies, then ultimately converting that to a number type
	 */ 
	var candiesNow = new Number(document.getElementById('candies').innerHTML.split(' ')[2]);
	
	// eat all the candies!! why wait?
	candies.eat();
			
	// add the number of meals and candies eaten this time to the log
	$Player.log.eating.meals++;
	$Player.log.eating.candies += candiesNow;

	/*
	 * get the number of candies eaten by getting the candies_eaten div, 
	 * spliting it by spaces, getting the fourth chunk which has the number 
	 * of candies eaten, then ultimately converting that to a number type
	 */
	var total = new Number(document.getElementById('candies_eaten').innerHTML.split(' ')[3]);
	
	// note the log in the console, no?
	var msg = new Date() + ': eating ' + candiesNow + ' candies!! ' + $Player.log.eating.candies + ' in ' + $Player.log.eating.meals + ' meals; ' + total + ' this game.';
	console.log(msg);
};

function epicQuest() {
	
	var TIMEOUT = 5;

	// output 5 second notice
	console.log(new Date() + ': starting quest in ' + TIMEOUT + ' seconds...');
	
	for (var i = 1, j = TIMEOUT; i <= TIMEOUT; i++) {
		setTimeout()
	}
	
	// schedule the quest 
	setTimeout(function() {
		quest.begin(true);
		
		// add new quest to log
		$Player.log.training.quests.push($Player.log.training.newQuest());
		
		
		// note the training destination
		$Player.log.training.quests[]destination = document.getElementById('quest_destination').selectedOptions[0].innerHTML;
		
		// this pattern finds the HP section
		HPPattern = /HP : [0-9]+\/[0-9]+/;
	
		// get the player's total HP from the match found using HPPattern
		$Player.log.training.HP = document.getElementById('quest').innerHTML.match(HPPattern)[0].split('/')[1];
		
		// build the console log message
		var msg = new Date() + ": quest " + $Player.log.training.quests + " at " + $Player.log.training.destination + ' - HP: ' + $Player.log.training.HP;
		console.log(msg);
		
	}, TIMEOUT * 1000);
};

function stockpile(interval) {
	
};

function train(interval, eat) {
	
	if (this.currentSession.status == 'training') {
		$Player.stopTraining();
	}
	
	var newSession = {}.
		
	// set to 5 minutes by default
	if (interval === undefined) {
		interval = 5 * 60
	}
	

	// get the current selected destination
	newSession.destination = document.getElementById('quest_destination').selectedOptions[0].innerHTML;

	// build the confirmation message string
	var msg = "You're about to train at " + newSession.destination + " every ";
	
	// if interval is longer than 60 seconds
	if (interval > 60)  {
		// say how many minutes
		var trainingInterval = interval/60 + " minutes.  ";
	} else {
		// say how many seconds
		var trainingInterval = interval + " seconds.  "; 
	}	
	
	msg += trainingInterval + "Do it?";

	// confirm sure they want to train in the selected destination 
	if (window.confirm(msg)) {
		// announce the new training schedule
		console.log(new Date() + ': starting training session at ' + newSession.destination + ' every ' + trainingInterval);
	
		if (!!eat) { $Player.eat(); }
		
		// go on a quest
		$Player.epicQuest();
	
		// schedule the iteration; multiply by 1000 to get milliseconds
		$Player.log.training.intervalID = setInterval(function() { 
				if (!!eat) { $Player.eat(); }
				$Player.quest() 
			}
			, interval * 1000 
		);
	} else {
		console.log('You have stopped training at ' + newSession.destination + ' every ' + trainingInterval);
	}

};

// i want to make a player object
// each method should have this.otherMethod(); syntax available
var $Player = {
	log : {
		fundRaising : [],
		training : [],
		newTrainingSession : newTrainingSession
	},
	
	// shortcut for getting the current session id
	get currentSessionID() {
		return this.log.training.length -1;
	}
	
	// shortcut for getting a copy of the current session
	get currentSession() {
		return this.log.training[this.currentSessionID];
	},
	
	// shortcut for setting the current session 
	set currentSession(session) {
		this.log.training[this.currentSessionID] = session;
	},
	
	// shortcut for getting the current quest id
	get currentQuestID() {
		return this.log.training[this.currentSessionID].quests.length -1;
	}	
	
	// shortcut for getting the current quest
	get currentQuest() {
		return this.log.training.sessions[this.currentSessionID].quests[this.currentQuestID];
	}, 
	
	// shortcut for setting the current quest
	set currentQuest(quest) {
		this.log.training[this.currentSessionID].quests[this.currentQuestID] = quest;
	},
		
	eat 			: eat,
	epicQuest 		: epicQuest,
	stockpile 		: stockpile,
	stopTraining 	: stopTraining,
	train 			: train
};


console.log ($Player);

