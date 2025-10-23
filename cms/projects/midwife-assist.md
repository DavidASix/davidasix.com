---
title: "Midwife Assist"
slug: "midwife-assist"
category: "Mobile Apps"
original_link: "https://davidasix.com/projects/midwife-assist"
start_date: "2021-03-28"
completed_date: "2023-03-09"
active_development: true
short_description: "Midwife Assist is an app made specifically to help Midwives with their day to day"
google_play_url: "https://play.google.com/store/apps/details?id=com.dave6.www.midwifeassist"
github_url: "https://github.com/DavidASix/midwife-assist-app"
has_privacy_policy: true
has_data_delete: false
logo: "local/App_Icon_697663ff9c.jpg"
screenshots:
  - "local/s1_1_f852aa91f3.jpg"
  - "local/s2_3ed169bffe.jpg"
  - "local/s3_59c9e22b95.jpg"
  - "local/s4_5928bfb846.jpg"
  - "local/s5_ae27fdaa36.jpg"
  - "local/s6_de1aec29e1.jpg"
  - "local/s7_d28c388789.jpg"
features:
  - "100% Local"
  - "Biometric Security"
  - "Client tracking & sorting"
technologies:
  - "react-native"
  - "redux"
  - "react-native-reanimated"
  - "react-navigation"
---

In late 2021 my then fiancée (now wife) officially began her career as a midwife. Something that she quickly came to realize is that there is a large gap in the market when it comes to Android mobile apps for midwives. There were some solutions on iPhone, but none available for her Pixel.

While I'm sure it wasn't her intention (or perhaps it was) that set me down the path of creating Midwife Assist, an app for Midwives.

My wife detailed that she would like an app which allows her to track patient information, and complete common calculations that come with midwifery (for instance, the estimated birth date, based on last menstrual period). This essential came down to an advanced "contacts" app, with special fields to hold birth information. 

In addition, a clean customized calculator to quickly uncover birth information. Atop the base functionality, the app also needed to have a heavy focus on security, specifically adherence to the PHIPA data handling guidelines.

## Design 📱

The app has gone through a few iterations changing the functionality, feel, and style. In the most recent version at time of writing (3.1) the app navigation has a focus on gesture navigation. Once on a screen (ie calculator, client) you can navigate through the screen options with swipe gestures.

I've paired the swipe gestures with a curved line style for all borders and edges. This is to evoke a calming feeling, and mirror the curves in the logo.

## Security 🔐

There are two main concerns when it comes to security of personal health information for this app.

- Data in Transit
- Data on Device

Data in transit refers to any time data leaves the device, whereas data on device refers to how accessible the data is on the device.

### Data in Transit

To ensure compliance with all likely laws of data governance, the app <u>cannot</u> connect to the internet. This was done intentionally to ensure data cannot leave the app to be copied elsewhere, potentially opening me up for legal issues. Now unfortunately this does come with some draw back, the main being that the data cannot be backed up when changing devices.

I've consulted this issue with some midwives, and they have agreed that it's worth the trade-off given the safety implications, and given that their client relationships only last a short period of time, so long term storage of records isn't required.

I'd like to address the backup issue by introducing the functionality of outputting an encrypted .midwife file, which could be imported with a password on a different device.

The other downside to not having network connectivity is it severely limits the options for monetization, but I'm alright with that as this is first and fore-most a passion project for my wife.

### Data on Device

In Ontario Canada, law requires any personal health information held by healthcare works be secured by industry standard methods. To assist with that I've implemented multiple security options. Users can choose between

- Biometric Security
- 4 Digit Pin
- No security

After completing the on-boarding tutorial users are greeted by a request to set up a security option, with a recommendation for bio-metric security. If the user selects no security they are given a message explaining the importance of device level security. I opted not to remove the "no security" option as I did not want to restrict a users choice.

After a user has selected an security measure, they will be force to enter that again if the app has been in the background for more than 10 minutes.