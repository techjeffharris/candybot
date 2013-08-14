
 function Player() {

 	function areWeStillResting () {
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

 	};

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

	};

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

	};

	function getCandiesNow () {
		/*
		 * get the number of candies right now by getting the candies div, 
		 * spliting it by spaces, getting the third chunk which has the number 
		 * of candies, then ultimately converting that to a number type
		 */ 
		new Number(document.getElementById('candies').innerHTML.split(' ')[2]);
	};
	
	function getDestination () {

		// the quest_destination select box
		var destination = document.getElementById('quest_destination');

		// the id of the option that is selected
		var child = destination.selectedIndex;
		
		// return the text of the option
		return destination.childNodes[child].innerHTML;
	};

	function getHP () {
		// this pattern finds the HP section
		var HPPattern = /HP : [0-9]+\/[0-9]+/;

		// return the player's total HP from the match found using HPPattern
		return document.getElementById('quest').innerHTML.match(HPPattern)[0].split('/')[1];
	};

	this.log = {
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

	this.stopTraining = function () {
		clearInterval($Player.log.training.intervalID);

		var log = $Player.log;

		console.log('That was one heck of a training session!');
		console.log('You worked out ' + log.training.workOuts + ' times.');
		console.log('You ate ' + log.eating.candies + ' candies.' );
		console.log('These candies have raised your HP to ' + log.training.HP );
	};

	this.eat = function() {

		var candiesNow = getCandiesNow();
		
		// eat all the candies!! why wait?
		candies.eat();

		// add the number of meals and candies eaten this time to the log
		$Player.log.eating.meals++;
		$Player.log.eating.candies += candiesNow;

		var total = getCandiesEaten();

		// note the log in the console, no?
		var msg = new Date() + ': eating ' + candiesNow + ' candies!! ' 
			+ $Player.log.eating.candies + ' in ' + $Player.log.eating.meals + ' meals; ' 
			+ total + ' this game.';

		console.log(msg);
	};

	this.workOut = function () {

		var TIMEOUT = 5 * 1000;

		// output 5 second notice
		console.log(new Date() + ': workout session in ' + TIMEOUT/1000 + ' seconds...');

		// schedule the workout 
		setTimeout(function() {
			
			quest.begin(true);

			// increment the training workout log
			$Player.log.training.workOuts++;

			// note the training destination
			$Player.log.training.destination = getDestination();

			$Player.log.training.HP = getHP();

			// build the console log message
			var msg = new Date() + ": workout session " + $Player.log.training.workOuts + " at " + $Player.log.training.destination + ' - HP: ' + $Player.log.training.HP;
			console.log(msg);

		}, TIMEOUT);
	};

	this.train = function (options) {

		options = options || {};

		var eat = 	options.eat 		|| true,
		interval = 	options.interval 	|| 5 * 60;

		// build the confirmation message string
		var msg = "You're about to train every ";

		// if interval is longer than 60 seconds
		if (interval > 60)  {
			// say how many minutes
			var trainingInterval = interval/60 + " minutes";
		} else {
			// say how many seconds
			var trainingInterval = interval + " seconds"; 
		}

		msg += trainingInterval + " starting at " + getDestination() + ".\n\nDo it?";

		// confirm sure they want to train in the selected destination 
		if (window.confirm(msg)) {
			// announce the new training schedule
			console.log(new Date() + ': beginning training at ' + getDestination() + ' every ' + trainingInterval);

			// do it once now
			$Player.workOut();

			// schedule the interval and save the id for stopping later
			$Player.log.training.intervalID = setInterval(function trainingSession() {

				// how long we're waiting to heal
				var waiting = areWeStillResting();

				// if we aren't still on a quest and aren't waiting to heal
				if (document.getElementById('quest').innerHTML === '' && !waiting ) {
					// if we're supposed to 
					if (options.eat) {
						// eat all the candies then begin the quest!
						$Player.eat();
					}

					$Player.workOut();
				} else {

					var now = new Date();

					console.log(now + ': not ready; next session: ' + new Date(now.getTime() + interval * 1000) );
					
				}
			}, interval * 1000);
		} else {
			console.log('You canceled training at ' + getDestination() + ' every ' + interval + ' seconds.');
		}

	};

};

$Player = new Player();

console.log ($Player);
