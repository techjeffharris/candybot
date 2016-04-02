candybot
========

A JavaScript Bot for the original [Candy box ! \o/][1]

# usage

## setup

1. Copy the contents of candybot.js to your clipboard
2. Open your favorite browser's developer console
3. Paste the contents of candybot.js into the console
4. Press "enter"

## Create a new bot

    > bot = new CandyBot()

## Enable Automatic Features

By default, automatic features (eat, quest, save) are disabled.  You may
tell your bot to enable them

    > bot.enableAutoEat()
    undefined
    > bot.enableAutoQuest()
    undefined
    > bot.enableAutoSave()
    undefined

You may also enable them when you instantiate your bot by passing in an 
options object

    > candybot = new CandyBot({
        autoEat: true,
        autoQuest: true,
        autoSave: true
      })

## API 
  
Coming soon!  The source is pretty easy to read though!


  [1]: http://candies.aniwey.net/
