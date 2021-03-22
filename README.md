# Exploding_kitten
A web based game which user will save kitten from getting exploded.

When ever a User opens the game, User will be asked to enter the user name,if User name is a valid user name and there isn't any incomplete game for that user a new game will be started.
If there is a previous incomplete game for that user then the user will be asked to continue or restart the game. if user selects restart the game,then previous game will be closed and number of times game played by that user will be increased and a new game will be started.
If the User selected to continue the previous game then user will  be desplayed with deck of unselected cards and deck of selected cards.
If User selects a card from the deck of Unselcted card and if the card is Shuffle card,then the game is restarted and the deck is filled with 5 cards again.
If the card drawn from the deck is a cat card, then the card is removed from the deck.
If the card is exploding kitten (bomb) then the player loses the game.
If the card is defusing card, then the card is removed from the deck. This card can be used to defuse one bomb that may come in subsequent cards drawn from the deck.
If the User draws all the cards successfully,then User will be declared as winner and realtime leader board will be displayed and a button to restart the game.
If the User fails to Draw all cards from the deck then user will be declared as lost the game and will be displayed realtime leader board and a button to restart the game.
If the User has a chance to diffuse the Bomb but fails to do it in the respective time, then user will  be declared as lost game and realtime leader board will be displayed and a button to restart the game
If the User selects restart game before completing the game, Game will be counted as unsuccessful attempt and leader board will be updated and a new game will be started.
If the User selects End game beore completing the game, Game will be counted as unsuccessful attempt and realtime leader board will be displayed and a button to restart the game.

# Prerequisites
1. Install Nodejs version v14.15.0.
2. Install npm version 6.14.8.
3. Install redis version 3.0.504.
4. Set a password to Redis(can also be a temparory one) to have layer for security,using command CONFIG SET requirepass "password". please note that this authentication is temporary.
5. In case if you dont want to have a password for Redis,remove password while creating redis client.

# Backend
1. All APIs are REST APIs and will have status in response as Success/Failed along with a message.
2. For a successfull request APIs return response with status code 200.
