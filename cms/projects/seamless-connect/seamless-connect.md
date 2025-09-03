---
title: "Seamless Connect"
slug: "seamless-connect"
category: "Mobile Apps"
original_link: "https://davidasix.com/projects/seamless-connect"
start_date: "2018-05-01"
completed_date: "2019-01-19"
active_development: false
short_description: "A app to share your social media's with people around you, via BLE."
google_play_url: "https://play.google.com/store/apps/details?id=com.modeinnovations.seamless"
apple_store_url: "https://appadvice.com/app/seamless-connect/1434496107"
has_privacy_policy: false
has_data_delete: false
logo: "./images/web_hi_res_512_de7cedef83.png"
screenshots:
  - "./images/Contacts_2a6656745e.jpg"
  - "./images/Discovery_cd1a2b7858.jpg"
  - "./images/Incoming_Connections_e29e612abc.jpg"
  - "./images/Incoming_Request_7213a1bb9c.jpg"
  - "./images/Contact_Details_7f2e8e7b53.jpg"
  - "./images/Profile_69c8ed0e70.jpg"
features:
  - "Security focused sharing"
  - "Constant BLE scanning"
  - "Network push notifications"
  - "2K+ Users"
  - "Available on Apple & Google"
  - "15+ Supported Social Medias"
technologies:
  - "bluetooth low energy"
  - "react-native"
  - "redux"
  - "firebase"
  - "express.js"
  - "MySQL"
---

Seamless Connect is a wireless connection sharing platform that allows you to connect all of your social account to the people around you with two taps. The app uses Bluetooth Low Energy to project and anonymous UUID, and keep track of the UUID's near you. This allows you to view the names of the people around you with Seamless, and send them a connection request. You can choose to share between 0 - 15+ different social media's with them this way

I worked with a business partner to bring Seamless Connect (hearforward called Seamless) from the idea phase, through to a successful launch. My partner handled the marketing and business side, while I completed the full-stack development. The app went through a few iterations, but ended with a __React Native__ app backed by a LEMN stack on a VPS.

## LEMN Server 🍋

This project was backed by a Linux Nginx MySql Express server running on a Digital Ocean VPS. The server boasted 29 unique API endpoints. The server used a 8 table relational database schema and utilized JSON web tokens for authentication.

While there are a lot of great pieces in the server, I am particularly proud of the authentication system, which utilized a Salt-And-Pepper based authentication, storing everything as irreversible hash strings.

## Frontend 📱

Beyond the screenshots shown on this page, Seamless went through a final iteration before my involvement was complete. The app ended with a gesture based 3 screen layout. It featured an intelligent contact page with your Seamless contacts along with your phone contacts in a single pane; A central profile page where you can add and manage your social accounts; And a discovery page, where people who you were recently near would appear, giving you the option to request a connection.

## Buyout 🪙

After the final version of Seamless was completed my business partner and I made an agreement for me to be bought out of the business, giving him full control. Doing this freed me up to work on other endeavors, but unfortunately restricts me from sharing the source code. For that reason, I am unable to provide a link to the source code I have created in this project.

Shortly after the buyout COVID occurred, which was a partial factor in my business partner taking the app off the market. I have included  the original links to each app-store on this page in-case the app is re-released in future.