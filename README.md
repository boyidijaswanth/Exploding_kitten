# Exploding_kitten
A web-based game in which the user will save a kitten from getting exploded.

1. Whenever a User opens the game, the User will be asked to enter the user name, if the User name is a valid user name and there isn't any incomplete game for that user a new game will be started.
2. If there is a previous incomplete game for that user then the user will be asked to continue or restart the game. if the user selects restart the game, then the previous game will be closed and the number of times the game played by that user will be increased and a new game will be started.
3. If the User selected to continue the previous game then the user will be displayed with a deck of unselected cards and a deck of selected cards.
4. If the user selects a card from the deck of Unselected card and if the card is a Shuffle card, then the game is restarted and the deck is filled with 5 cards again.
5. If the card drawn from the deck is a cat card, then the card is removed from the deck.
6. If the card is exploding a kitten (bomb) then the player loses the game.
7. If the card is defusing the card, then the card is removed from the deck. This card can be used to defuse one bomb that may come in subsequent cards drawn from the deck.
8. If the User draws all the cards successfully, then the User will be declared as the winner and the realtime leader board will be displayed and a button to restart the game.
9. If the User fails to Draw all cards from the deck then the user will be declared as lost in the game and will be displayed a real-time leader board and a button to restart the game.
10. If the User has a chance to diffuse the Bomb but fails to do it in the respective time, then the user will  be declared as a lost game and the realtime leader board will be displayed and a button to restart the game
11. If the User selects restart game before completing the game, the game will be counted as an unsuccessful attempt and leader board will be updated and a new game will be started.
12. If the User selects End game before completing the game, the game will be counted as an unsuccessful attempt and a realtime leader board will be displayed and a button to restart the game.

# Prerequisites
1. Install Nodejs version v14.15.0.
2. Install npm version 6.14.8.
3. Install redis version 3.0.504.
4. Set a password to Redis(can also be a temporary one) to have a layer for security, using the command CONFIG SET require pass "password". please note that this authentication is temporary.
5. In case if you don't want to have a password for Redis, remove the password while creating the redis client.

# Backend
1. All APIs are REST APIs and will have status in response as Success/Failed along with a message.
2. For a successful request APIs return response with status code 200.