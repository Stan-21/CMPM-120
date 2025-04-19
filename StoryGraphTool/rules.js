class Start extends Scene {
    create() {
        this.engine.setTitle(this.engine.storyData.Title); // TODO: replace this text using this.engine.storyData to find the story title
        this.engine.addChoice("Begin the story");
    }

    handleChoice() {
        this.engine.gotoScene(Location, this.engine.storyData.InitialLocation); // TODO: replace this text by the initial location of the story
    }
}

class Location extends Scene {
    create(key) {
        let locationData = this.engine.storyData.Locations[key]; // TODO: use `key` to get the data object for the current story location
        if (locationData.visited) {
                this.engine.show(locationData.Alt);
        } else {
            this.engine.show(locationData.Body); // TODO: replace this text by the Body of the location data
            locationData.visited = true;
            if (key == "8") {
                this.engine.storyData.Locations['5'].Choices.unshift(this.engine.storyData.Link);
                this.engine.Key = true;
                this.engine.show("You enter the room and step on a button.  A loud shift in the walls can be heard from the other side.");
                this.engine.show("&gt; Somewhere somehow a passageway opens up.");
            }
            if (key == "12") {
                this.engine.Lamp = true;
                this.engine.show("You find a lantern.");
                this.engine.show("&gt; You can now see what rooms you're entering.");
                this.engine.show("&gt; With the rooms illuminated you can now see the writings on the wall.");
            }
        }
        this.engine.storyData.Hunger -= 0.5;
        if (this.engine.storyData.Hunger <= 0) {
            this.engine.show("You died of hunger.  Refresh the page to restart!");
            this.engine.gotoScene(End);
        }
        if (locationData.Coins > 0) {
            this.engine.storyData.Money += locationData.Coins;
            this.engine.show("You find some coins.");
            locationData.Coins = 0;
        }
        this.engine.show("Money: " + this.engine.storyData.Money +  " Hunger: " + this.engine.storyData.Hunger);
        if (key == "10" && this.engine.storyData.Money >= 50) {
            this.engine.addChoice("Exit", { "Text": "Exit", "Target": "Exit"});
        }
        if (key == "10" && this.engine.storyData.Money < 50) {
            this.engine.show("You do not have enough coins, perhaps you can check out the casino and test your luck?");
        }
        if(locationData.hasOwnProperty('Choices')) { // TODO: check if the location has any Choices
            for(let choice of locationData.Choices) { // TODO: loop over the location's Choices
                console.log(choice);
                if (this.engine.Lamp) {
                    this.engine.addChoice(choice.Target, choice);
                } else {
                    this.engine.addChoice(choice.Text, choice); // TODO: use the Text of the choice
                }
                // TODO: add a useful second argument to addChoice so that the current code of handleChoice below works
            }
            if (this.engine.storyData.Hunger <= 5 && this.engine.storyData.Money >= 5) {
                this.engine.show("Your stomach starts to growl...  <br>  Maybe the coins have some nutritional value?");
                this.engine.addChoice("Eat", {"Text": "Eat", "Target": key});
            }
        } else {
            this.engine.addChoice("The end.")
        }
    }

    handleChoice(choice) {
        if(choice) {
            if (choice.Text == "Eat") {
                this.engine.storyData.Money -= 5;
                this.engine.storyData.Hunger += 2.5;
            }
            if (choice.Text == "Gamble") {
                if (this.engine.storyData.Money < 5) {
                    this.engine.show("You're too broke!  You need at least 5 gold to play!");
                    this.engine.gotoScene(Location, "Casino");
                } else {
                    this.engine.gotoScene(Casino);
                }
            } else {
                this.engine.show("&gt; "+choice.Text);
                this.engine.gotoScene(Location, choice.Target);
            }
        } else {
            this.engine.gotoScene(End);
        }
    }
}

class Casino extends Scene {
    create() {
        if (Math.random() > 0.5) {
            this.engine.storyData.Money = Math.round(this.engine.storyData.Money * 1.5);
            this.engine.show("&gt; You won!");
            this.engine.show("Money: " + this.engine.storyData.Money +  " Hunger: " + this.engine.storyData.Hunger);
        } else {
            this.engine.storyData.Money = Math.round(this.engine.storyData.Money / 1.5);
            this.engine.show("&gt; You lost!");
            this.engine.show("Money: " + this.engine.storyData.Money +  " Hunger: " + this.engine.storyData.Hunger);
        }
        if (this.engine.storyData.Money < 5) {
            this.engine.show("You have no more money to gamble.");
            this.engine.addChoice("leave", {"Text": "stop",
                "Target": "Casino"
            });
            return;
        }
        this.engine.addChoice("gamble", {"Text": "continue",
            "Target": "Casino"
        });
        this.engine.addChoice("stop gambling", {"Text": "stop",
            "Target": "Casino"
        });
    }

    handleChoice(choice) {
        if (choice.Text == "continue") {
            this.engine.gotoScene(Casino);
        } else {
            console.log(choice);
            this.engine.show("&gt; You stop");
            this.engine.gotoScene(Location, "Casino");
        }
    }
}

class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
}

Engine.load(Start, 'myStory.json');
