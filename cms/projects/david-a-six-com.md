---
title: "DavidASix.com"
slug: "david-a-six-com"
category: "Web"
original_link: "https://davidasix.com/projects/david-a-six-com"
start_date: "2023-08-06"
completed_date: "2024-06-28"
active_development: false
short_description: "DavidASix.com is the online portfolio and creative sandbox of David. The site hosts a myriad of content, all managed with Stapi CMS hosted on a VPS."
github_url: "https://github.com/DavidASix/davidasix.com"
project_url: "https://davidasix.com"
has_privacy_policy: false
has_data_delete: false
logo: "./images/icon_750px_e6059c91eb.png"
screenshots:
  - "./images/Screenshot_from_2024_07_01_11_55_23_bda718820d.png"
  - "./images/Screenshot_from_2024_07_01_11_55_45_04a1a92c78.png"
  - "./images/Screenshot_from_2024_07_01_12_07_30_091a39207c.png"
features:
  - "Client CMS"
  - "Nested Dynamic Routes"
  - "Bento Box Design"
  - "Infinite Scroll"
  - "Mobile Optimization"
  - "Animation"
technologies:
  - "NextJS"
  - "Strapi CMS"
  - "Tailwind CSS"
---

DavidASix.com is my personal portfolio website, and it has gone through many iterations over  the years. I've been writing and re-writing my personal space online for over 14 years, and I'm sure this current iteration will change sometime in the future.

Previously my site was named dave6.com, as I was gifted the domain from my father. With his encouragement I was introduced to web development, starting out with a simple HTML website. Through the years my site has evolved, spending a long while as a PHP site backed by MySQL, all the way to its current build as a NextJS site, backed by StrapiCMS running on a Digital Ocean droplet.

![Image](./images/Screenshot_from_2024_07_01_12_11_36_f96f39db55.png)

## Concept

This site is meant to house my projects and portfolio, but also to serve as a portfolio piece. The site displays my ability to design multiple layouts, multiple content loading systems, and implement clear clean API routes to handle content delivery

### Layouts

**Bento Box **- The homepage sports a Bento Box layout, built with CSS grid. I implemented glass morphisim over an animated gradient, as well as a group focus effect for each element when hovered

**Aside Information** - The Excel page contains an aside design, with some summary information in a sticky content box to the right, and the main scroll-able content on the left

**Classic List **- The Blog page contains a classic content list, with a single item per row. The list items are served in chronological order.

**Section List** - The Projects page contains a sectioned content list. It lists all of my projects, broken up by their category. The categories and projects are both sorted by chronological order of most recent project.

### Content Loading Systems

**Button Loader** - the Blog page contains a button loader. The user must click a *Load More *button to have more content load in.

**Pre-fetch Loader **- The Projects page preloads all content, and has no option to load more. This is done as the projects will be less frequently updated, and has a lower potential for lots of content to be added.

**Infinite Scroll Loader **- The Excel page contains an infinite scroll loader. Once the user reaches the end of the page, a skeleton component is shown and more content is collected from the server.

![Image](./images/Screenshot_from_2024_07_01_12_24_00_35f79b9d9d.png)