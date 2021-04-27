# Bargario
## Motivation
I first started programming through my interest in game development and this project is a throwback to the genesis of my interest. For this, I wanted to see how the dynamics of large-scale multiplayer environments. And what better way to explore this than to make a cross-over of two genres: io games and battle royale.

## Introduction
Bargario is a clone of an old io game called agar.io crossed with the battle-royale genre. You start with a cell that grows by eating small particles and other players. All players are confined to an arena that shrinks throughout the game, encouraging players to fight until a single remains. Once a player is knocked out, they are able to observe the rest of the match.

## Technology
The game server was written in JavaScript with NodeJS with socket.io to keep a live connection between the game clients and the server. The game itself was made in Unity with C# as the main language and Socket.io for communication with the server.

## Getting Started
If you want to get the game running immediately or wish to tinker around with the code, this is the place to start!

### Prerequisites
This project can be run on Windows 10 by running the executable in bargario-windows.zip file. The game will not start until at least two users are playing at the same time.

## What I learned
As with many new endevors, mistakes were made that changed the course of the project. Firstly, I wrote the whole server code before moving over to the client. I did not research beforehand whether or not Socket.io was available on every platform I wanted to write the game for (Web, Linux, Mac, Android, Windows). C# has a single library for Socket.io and it was only compatible with windows systems. This was a grave oversight, but taught me a lesson in proper stack planning that I have since made use of in other projects. 

“You don't learn to walk by following rules. You learn by doing, and by falling over.” ― Richard Branson

## Authors

* **Jordan Hall** - *Project Developer* - [PlatinumNinja72](https://github.com/PlatinumNinja72)
