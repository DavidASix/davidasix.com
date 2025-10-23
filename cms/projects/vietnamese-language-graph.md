---
title: "Vietnamese Language Graph"
slug: "vietnamese-language-graph"
category: "Python"
original_link: "https://davidasix.com/projects/vietnamese-language-graph"
start_date: "2024-01-20"
completed_date: "2024-02-02"
active_development: false
short_description: "A Python script utilizing Pandas and Obsidian to visualize Vietnamese compound words, aiding in my vocabulary expansion."
github_url: "https://github.com/DavidASix/vietnamese-language-graph"
has_privacy_policy: false
has_data_delete: false
logo: "local/viet_lang_graph_logo_ce7c5acacb.jpg"
features:
  - "Data Conversion"
  - "Data Visualization"
  - "YouTube Video"
technologies:
  - "obsidian"
  - "python"
  - "pandas"
  - "xml"
---

Xin chào các bạn!

I'm in the process of learning Vietnamese, and something I want to focus on is expanding my vocabulary! Vietnamese has quite a few differences from English, but an important one is the low morpheme to word ratio. Vietnamese creates more complicated words (or words in different tenses) through creating compound words. When you learn a single morpheme word in Vietnamese, you can usually build on that word to create more complex words around the same idea. This project utilizes Python and Obsidian to visualize these compound words to improve vocabulary while learning the language.

## Video

To see how this project was created, and get a glimpse of my problem-solving method, [check out the video here](https://www.youtube.com/watch?v=cTIb9MuCV0k)

![Image](local/thumbnail_fede44d034.jpg)

## Project Summary

This Python project takes a Vietnamese to English dictionary in the form of an XML file. It manipulates the XML data into a Pandas DataFrame, and then passes it to a search function. There are two search functions in the project:

reverse_search_method Reverse search method receives a DataFrame of words, then takes each word and splits it into morphemes and reverses the list. It iterates the morphemes, creates a word with a morpheme length equal to the iterated index, then reverses the word to put it back in proper order. This sub-word is then added to the connection list for the main word. This method is deprecated, in favor of dict_match_search_method, as it creates false positives in some words, linking to words that are not in the dictionary (i.e. morphemes used to add meaning to a compound word, but which are not words in their own right) and misses some connections to morpheme combinations created by using the center morphemes of a four (or higher) morpheme word.

dict_match_search_method Dictionary match search method receives a DataFrame of words and iterates it. For each word, it creates an array of all the possible sub-words that could exist in it. For instance, the word sinh hóa học (biochemistry) consists of five possible sub-words:

    One Morpheme

- sinh
- hóa
- học

    Two Morphemes

- sinh hóa
- hóa học

These words are compared against a filtered dictionary DataFrame containing only words with the same morpheme length as the sub-word. If a word exists in the dictionary a connection is made between the root word and the sub-word. This method is slightly slower than reverse_search_method, but ensures 100% connection with existing words from the dictionary, and removes all dead links.

After running the script, 23000 markdown files will be outputted, which can then be imported into an Obsidian Vault. This will result in a graph view like the following:

![Image](local/node_graph_21263b2e21.png)

## How to use

You can use this project to visualize Vietnamese as well! Required Software:

- Obsidian
- Python
- source.txt

## Instructions:

    Clone [this repository](https://github.com/DavidASix/vietnamese-language-graph) to your computer

    run python main.py

    Open Obsidian

    Click Open another vault (bottom of left navigation bar)

    Click Open folder as Vault

    Select the folder ObsidianVault in this repository

Obsidian will take some time to index and import this vault. That time is greatly decreased by not opening the Graph View until the indexing is complete.

## Sources

Quang Hiển's Vietnamese Dictionary