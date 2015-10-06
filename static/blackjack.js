$(document).ready(function() {
	var game;
	$('#reset').bind('click', function() {
		$('#reset').text('Reset');
		game = startGame();
	});

	$('#split').bind('click', function() {
		split();
	});
	
	$('#double').bind('click', function() {
		double();
	});
	
	$('#hit').bind('click', function() {
		console.log(game);
		hit(game.deck,game.playerHand);
	});
	
	$('#stay').bind('click', function() {
		stay(game);
	});
});




/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min,max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

var deck = new function() {
	this.numOfDecks = 1;
	this.cards = [];
	this.draw = function() {
		return this.cards.shift();	
	};
	this.print = function() {
		console.log(this.cards);	
	};
	this.shuffle = function(shuffles) {
		shuffles = typeof shuffles !== 'undefined' ? shuffles : 5;
			
		this.setCards();	
		
		for (var j = 0; j < shuffles; j++) {
			tmp = this.cards;
			this.cards = [];

			var removed;
			var rand;

			for (var i = 0; i < 52; i++) {
				rand = getRandomInt(0,tmp.length-1);
				removed = tmp.splice(rand, 1)[0];
				this.cards.push(removed);
			}	
		}
	};
	this.generateDeck = function() {
		cards = [];
		for (var i = 0; i < 52; i++) {
			cards.push(new card(i));
		}

		return cards;
	};
	this.setCards = function() {
		this.cards = this.generateDeck();
	};

	this.getCards = function() {
		return this.cards();
	};
};

var card = function(num) {
	this.setSuit(num);
	this.setValue(num);
	this.setName(num);
	this.setImg();
};

card.prototype.setName = function(num) {
	this.name = num%13 + 1;

	if (this.name == 1) {
		this.name = 'Ace';
	} else if (this.name == 11) {
		this.name = 'Jack';
	} else if (this.name == 12) {
		this.name = 'Queen';
	} else if (this.name == 13) {
		this.name = 'King';
	}

	this.name = String(this.name);
};
card.prototype.setValue = function(num) {
	this.value = num%13+1;
};
card.prototype.setSuit = function(num) {
	// spades = 1, hearts = 2, clubs = 3, diamonds = 4
	this.suit =  Math.floor(num/13+1);

	if (this.suit == 1) {
		this.suit = 'Spades';
	} else if (this.suit == 2) {
		this.suit = 'Hearts';
	} else if (this.suit == 3) {
		this.suit = 'Clubs';
	} else if (this.suit == 4) {
		this.suit = 'Diamonds';
	}
};

card.prototype.setImg = function() {
	this.img = this.name+'_of_'+this.suit.toLowerCase()+'.png';
};

card.prototype.print = function() {
	console.log(this.value, ' ', this.name, ' ', this.suit);
};

function hand(user) {
	//function hand() {
	this.user = user;
	this.cards = [];
	this.total = 0;
	this.isHardTotal = true;
	//	this.total = this.getTotal();
};

hand.prototype.getTotal = function() {
	this.total = 0;
	this.isHardTotal = true;

	for (var i = 0; i < this.cards.length; i++) {
		this.total += this.cards[i].value > 10 ? 10 : this.cards[i].value;
		if (this.cards[i].name == 'Ace') {
			this.isHardTotal = false;
			this.total += 10;
		}
	}

	if (!this.isHardTotal && this.total > 21) {
		this.total -= 10;
		this.isHardTotal = true;
	}

	return this.total;
};

hand.prototype.hasBlackJack = function() {
	if (this.cards.length == 2 && this.getTotal() == 21) {
		return true;
	}

	return false;
};

var split = function(game) {

};

var double = function(deck,hand) {
	//doubleBet();
	hit(deck,hand);
};

var hit = function(deck,hand) {
	hand['cards'].push(deck.draw());

	var len = hand['cards'].length;
	var id;

	if (hand['user'] == 'player') {
		id = '#playerHand_top';
	} else {
		id = '#dealerHand_top';
	}

	$(id).append('<div class="hand appended"><img class="card" src="png-cards/'+hand['cards'][len-1]['img']+'"></div>');

	if (hand['user'] == 'player') {
		$("#playerHandTotal").text(hand.getTotal());
	}
};

var stay = function(game) {	

	$("#dealerCardContainer").flip(true);

	var dealerTotal = game.dealerHand.getTotal();
	$("#dealerHandTotal").text('Dealer total: '+dealerTotal);

	console.log(dealerTotal);
	console.log(game.dealerHand.isHardTotal);
	while (dealerTotal < 17 || (dealerTotal == 17 && !game.dealerHand.isHardTotal)) {
		hit(game.deck,game.dealerHand);
		dealerTotal = game.dealerHand.getTotal();
		$("#dealerHandTotal").text('Dealer total: '+dealerTotal);
				console.log(dealerTotal);
				console.log(game.dealerHand.isHardTotal);
	}
};

var startGame = function() {
	$("#dealerCardContainer").flip(false);
	$(".appended").remove();
	deck.shuffle();
	console.log(deck);
	var game = {};

	var dealerHand = new hand('dealer');
	var playerHand = new hand('player');
	
	deal(deck, dealerHand, playerHand);
	
	$('#dealerHand').text(JSON.stringify(dealerHand['cards']));
	$('#dealerHandCard_1').attr('src', 'png-cards/'+dealerHand['cards'][0]['img']);
	$('.facedown').attr('src', 'png-cards/facedown.png');
	$('#dealerHandCard_2').attr('src', 'png-cards/'+dealerHand['cards'][1]['img']);
	$('#playerHand').text(JSON.stringify(playerHand['cards']));
	$('#playerHandCard_1').attr('src', 'png-cards/'+playerHand['cards'][0]['img']);
	$('#playerHandCard_2').attr('src', 'png-cards/'+playerHand['cards'][1]['img']);

	$("#dealerCardContainer").flip();

	$("#playerHandTotal").text(playerHand.getTotal());

	if (dealerHand.hasBlackJack()) {
		$("#dealerCardContainer").flip(true);
		return;
	}

	if (playerHand.hasBlackJack()) {
		$("#dealerCardContainer").flip(true);
		console.log('You win!');
		return;
	}

	game.dealerHand = dealerHand;
	game.playerHand = playerHand;
	game.deck = deck;

	return game;
/*	while (hasBusted || willStand) {
		input = getUserInput();

		if (input == 'hit' || input == 'h') {

		} else if (input == 'stand' || input == 's') {

		} else if (input == 'double' || input == 'd') {

		} else if (input == 'split' || input == 'p') {

		}

		hasBusted = checkPlayerScore(playerHand);
	}

	while (dealerHand.getTotal() >= 17) {
		dealerHand.cards.push(deck.draw());
	}*/
};

var deal = function(deck, dealerHand, playerHand) {
	playerHand.cards.push(deck.draw());
	dealerHand.cards.push(deck.draw());
	playerHand.cards.push(deck.draw());
	dealerHand.cards.push(deck.draw());
};

var isBust = function() {

};

var playerWins = function() {

};	

var gameManager = {

};
