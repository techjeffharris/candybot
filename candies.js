	
$Player = {};

$Player.log = {
	eating : {
		meals : 0,
		candies : 0,
	},
	training : {
		intervalID : 0,
		destination: '',
		workOuts : 0,
		HP : 0
	}
};
	
$Player.stopTraining = function () {
	clearInterval($Player.log.training.intervalID);
	
	var log = $Player.log;
	
	console.log('That was one heck of a training session!');
	console.log('You worked out ' + log.training.workOuts + ' times.');
	console.log('You ate ' + log.eating.candies + ' candies.' );
	console.log('These candies have raised your HP to ' + log.training.HP );
};
	
$Player.eat = function() {
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

$Player.workOut = function workOut() {
	
	var TIMEOUT = 5 * 1000;
	
	// output 5 second notice
	console.log(new Date() + ': workout session in ' + TIMEOUT/1000 + ' seconds...');
	
	// schedule the workout 
	setTimeout(function() {
		// eat all the candies then begin the quest!
		$Player.eat();
		quest.begin(true);
		
		// increment the training workout log
		$Player.log.training.workOuts++;
		
		// note the training destination
		$Player.log.training.destination = document.getElementById('quest_destination').selectedOptions[0].innerHTML;
		
		// this pattern finds the HP section
		HPPattern = /HP : [0-9]+\/[0-9]+/;
	
		// get the player's total HP from the match found using HPPattern
		$Player.log.training.HP = document.getElementById('quest').innerHTML.match(HPPattern)[0].split('/')[1];
		
		// build the console log message
		var msg = new Date() + ": workout session " + $Player.log.training.workOuts + " at " + $Player.log.training.destination + ' - HP: ' + $Player.log.training.HP;
		console.log(msg);
		
	}, TIMEOUT);
};
	
$Player.train = function(interval) {
	// set to 5 minutes by default
	if (interval === undefined) {
		interval = 5 * 60 * 1000;
	}
	
	// get the current selected destination
	$Player.log.training.destination = document.getElementById('quest_destination').selectedOptions[0].innerHTML;
	var dest = $Player.log.training.destination;
	
	// build the confirmation message string
	var msg = "You're about to train at " + dest + " every ";
	
	// if interval is longer than 60 seconds
	if (interval/1000 > 60)  {
		// say how many minutes
		var trainingInterval = interval/1000/60 + " minutes.  ";
	} else {
		// say how many seconds
		var trainingInterval = interval/1000 + " seconds.  "; 
	}	
	
	msg += trainingInterval + "Do it?";

	// confirm sure they want to train in the selected destination 
	if (window.confirm(msg)) {
		// announce the new training schedule
		console.log(new Date() + ': beginning training at ' + dest + ' every ' + trainingInterval);
		
		// do it once now
		$Player.workOut();
		
		// schedule the iteration
		$Player.log.training.intervalID = setInterval($Player.workOut, interval);
	} else {
		console.log('You canceled training at ' + dest + ' every ' + interval/1000 + ' seconds.');
	}
		
};

console.log ($Player);

