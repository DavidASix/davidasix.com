---
title: "Bugs - Orisinal Game"
slug: "bugs-orisinal-game"
category: "Python"
original_link: "https://davidasix.com/projects/bugs-orisinal-game"
start_date: "2024-02-26"
completed_date: "2024-03-05"
active_development: false
short_description: "Ferry Halim created 'Bugs', an Orisinal flash game in November 2005. In December 2020, flash was disabled. I spent a lot of time on this game in my youth and so I've recreated it in Python."
github_url: "https://github.com/DavidASix/bugs-orisinal-python"
has_privacy_policy: false
has_data_delete: false
logo: "local/bugs_218098620_bf4a9c0a1d.jpg"
screenshots:
  - "local/Screenshot_from_2024_07_09_17_42_21_f82ee273ae.png"
  - "local/Screenshot_from_2024_07_09_17_42_32_295bdb0a54.png"
  - "local/Screenshot_from_2024_07_09_17_43_04_4187428017.png"
features:
  - "User Interfaces"
  - "Hi-Score System"
  - "Music"
  - "Sound Effects"
  - "Animated Sprites"
technologies:
  - "python"
  - "pygame"
  - "JPEXS Flash Decompiler"
  - "pickels"
---

If you've been on the internet for quite some time, you may remember Orisinal, a website created by Ferry Halim to house his many flash games. Ferry created beautiful and simple games, which were a joy to play. His game "Bugs" was a family favorite in my household.

You may recall that in December 2020, Flash support was officially discontinued in Chrome, essentially killing all of these games. Orisinal opted not to move these games to a new platform, and instead let them live on in the memory of those who played them. Fortunately for anyone feeling particularily nostalgic, there are sites that still host these games through flash emulators, and **Bugs **can be played today, [here.](https://www.numuki.com/game/fh-bugs/)

![Image](local/Screenshot_from_2024_06_26_14_14_41_90e96052df.png)

## Concept

Like many developers, I'm constantly trying new things; and I decided it was time I take a crack at game development to expand my horizons. I opted to build something in Python, a language I'm comfortable with, and utilize PyGame, as it seemed a good introduction to the concepts.

Instead of coming up with a concept, story, assets, and game idea in general, I decided to first try to recreate a simple game I loved in my childhood, **Bugs**.

## Obtaining Assets

The first step I wanted to tackle was getting the game assets ready. I was prepared to screenshot the emulated game and cut out each sprite, then record the audio and splice the sound effects in Audacity. Fortunately, I learned I didn't need to do all of that work, as the flash emulators retrieve the full flash file from the server, then emulate it client side. By monitoring the network activity while starting the game, I was able to download the .swf file containing the game code.

I then discovered that you can open flash files in a decompiler, which will unpack all of the assets, and let you download them. Using JPEXS Flash Decompiler I was able to unpack the assets and pull them into my project.

![Image](local/Screenshot_from_2024_06_26_14_23_10_3a625a166d.png)

![Image](local/Screenshot_from_2024_06_26_12_00_29_5af1b88aea.png)

## Writing the code

From previous readings I have a general understanding of how games are developed. Going on that I jumped right in, creating a game loop, then a start and end screen, and finally a main file to manage my game state. The game loop was the main focus, and it came out at 124 lines of code, with 29 lines of documenting comments. The game loop imports the Player, Bubble, Bug, Health, and ScoreBoard clases, which it then manages to create the game.

The game loop runs ever 1 tick (set at 60FPS that's 0.01⅓ seconds) and performs the following functions:

- Check if there are 25 bugs spawned, if not, spawn them outside of the screen walking in
- For each bug, give them a new velocity and draw them in the new location
- If the player isn't jumping, check if they have collided with a bug
- If a collision has occurred, reduce their health, or end the game
- If the player has just finished blowing a bubble, check for bubble collisions with bugs and despawn the bugs accordingly, while increasing the score
- If the player has been hurt this tick, make them invincible for 3 seconds
- Draw everything to the screen

After a player has completed a game if they've achieved a new high score, the score is saved in a pickle file. A final screen is shown displaying their score and the total highscore; Players can then start a new game.

![Image](local/Screenshot_from_2024_06_26_12_10_02_7c80cd9c0e.png)

## Project Status

While the project is not fully completed, I have retired it from active development to focus on more pressing things. I would like to revisit the project again and finish out the remaining few missing features, then add in "play" instructions to the repository. 

Though the project isn't 100%, I have learned a lot from it. I solidified my understanding of creating and destroying class objects, I extensively broadened my understanding of gameplay loops and how to optimize them, and I learned how to source and decompile flash files.

**Bugs** gave me hours of fun as a child, and is now bringing me invaluable knowledge as an adult. Thanks Ferry Halim!