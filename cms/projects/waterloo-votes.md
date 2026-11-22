---
title: "Waterloo Votes"
slug: "waterloo-votes"
category: "Web"
start_date: "2026-09-30"
completed_date: "2026-10-26"
active_development: false
short_description: "An independent guide to Waterloo’s 2026 mayoral election."
project_url: "https://www.waterloovotes.ca/"
has_privacy_policy: false
has_data_delete: false
screenshots:
  - "local/waterloo-votes-overview.webp"
  - "local/waterloo-votes-candidate-comparison.webp"
features:
  - "Extensive respectful data-scraping"
  - "Analysis of mayoral candidate claims"
  - "Debate video with a timestamped transcript"
  - "Candidate placement on dual-axis spectrum"
technologies:
  - "Eleventy"
  - "Liquid"
  - "JavaScript"
  - "Vercel"
---

The municipal election is one of the most important in my opinion. Decisions our local leaders make more directly affect the residence than what happens in Ottawa. Despite this, finding information about the people who are running for these impactful positions is a nightmare.

Most candidates websites have a campaign along the lines of:

> I want to make Waterloo the best city ever!
> ~ Joe Mayor

Unfortunately, that doesn't help anyone actually decide who to vote for, and absolutely doesn't tell me what they believe in.

I was frustrated with this, so I build [WaterlooVotes.ca](https://waterloovotes.ca) as an independent comparison site for our mayoral candidates in the City of Waterloo. The site brought together the public information all five candidates’ had shared and normalized the data so it was easier for voters to understand. I scraped the candidates sites and public information, then analyzed the local copies with LLM's and manually reviewed the information to remove bias. Interestingly, the LLM's added significant bias against Shannon Weber, editorializing her claims to make them sound less reliable. I adjusted the copy to be as un-biased as I could (and hey what do the LLM's know, Shannon won).

Along with my frustration, I was fueled by a sense of civic duty. I believe that voting [**is the bare minimum**](https://www.youtube.com/watch?v=LNOGN9jXGYA) you are responsible for doing, and that anyone who _can_ contribute some extra effort to participating in and protecting our democratic process should.

![A screenshot of the site's candidate comparison ](local/waterloo-votes-candidate-graph.webp)


## Promotion

![The site had 912 unique visitors](local/waterloo-votes-analytics-1.png)


Had I built the site further in advance I would have aimed to share it more, but as it stands I promoted it in three ways:
1. A poster in Mary Allen park. The QR code on the poster had a utm tag, so I can confirm it was scanned at least 21 times.
2. Replies I posted to Reddit comments in /r/waterloo about the election
3. A local Facebook group

Interestingly, it looks like ChatGPT ingested the content (maybe from Reddit) as I received many views referred from there:

![The analysis of traffic during October](local/waterloo-votes-analytics-2.png)

We had by far the biggest traffic spike _on_ election day. I imagine people were in line to vote frantically Googling to find *any information* about the candidates. I like to think that my site helped some people that day.

When I initially had this idea, I said that I'd be happy if I helped one person make a more educated vote, and I think I've done that.