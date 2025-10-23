---
title: "Just Dogs"
slug: "just-dogs"
category: "Mobile Apps"
original_link: "https://davidasix.com/projects/just-dogs"
start_date: "2023-10-01"
completed_date: "2023-11-01"
active_development: false
short_description: "Tired of doom-scrolling? Spend some time with mans best friend!"
google_play_url: "https://play.google.com/store/apps/details?id=com.dave6.stroller.justdogs"
github_url: "https://github.com/DavidASix/justdogs-app"
has_privacy_policy: true
has_data_delete: true
logo: "local/ic_icon_2c93adcec9.png"
screenshots:
  - "local/pawesome_26f0b455b0.jpg"
  - "local/videos_ea77c49af3.jpg"
  - "local/dogfix_40b8597d1c.jpg"
  - "local/justdogs_7aa10b6b5e.jpg"
features:
  - "API Integration"
  - "Ads via AppLovin"
  - "In-App Purchases"
  - "Infinite Content Scroll"
  - "Magic Link Auth"
  - "Email Purcase Recovery"
technologies:
  - "react-native"
  - "firebase"
  - "lottie"
  - "styled-components"
  - "mailgun"
  - "Google Cloud Functions"
---

Just Dogs is one of the first mobile apps I created, but I've recently re-hauled a large part of its code base. The app idea came from me spending too much time on Reddit on my phone, and wanting a different infinite scroll option that would only have "nice things".

The app is written with React Native, and the API is hosted through Firebase (previously on a VPS LEMN stack).

## Monetization

A goal with this app was to implement full monetization, through delivering ads and offering in-app purchases. The app serves ads via AppLovin (though my account is currently on hold, so no ads at the moment) and offers an IAP to remove adds for $1.00. 

The app does not require you to sign in, which offers an interesting challenge for IAP, as users need the ability to restore purchases on new devices.

## API

The API has 3 endpoints, and 2 Firestore collections. Its purpose is to facilitate the restoration of users purchases. When a user makes a purchase, they are prompted to enter their email. After doing so, a request is made to store their email and their IAP token. Then if a user needs to restore a purchase (ie gets a new device, re-installs the app, etc), they enter their email and receive a restoration code sent via the Mailgun API. The user can then enter the code, which is verified by the server, and if successful their purchase is restored.

## Frontend

The frontend of this app contains 2 screens, one of which is not visible to the end user. Upon launch the app displays a loading screen which matches the splash screen. During this time it verifies any previous purchases, and appropriately assigns advertising. Then it reveals the infinite scroll screen.

The InfiniteScroll initially obtains 4 images from the DogCEO API, then each time the user scrolls, it loads another. This ensures the user always has a buffer of dogs to scroll to.

This page also sports a data delete button for users who have purchased premium. This allows users to remove their email from the server, but it also removes their ability to restore a purchase in the future. This is done to be in compliance with Google Play TOS.

Download this app and spend some time with mans best friend ?