---
title: "NextJS Feels Messy"
publish_date: "2026-05-14"
header_image: local/nextjs-to-astro.webp
---
> [!NOTE]
> I'm talking about how this code feels, which might not perfectly represent how it actually works 🤷‍♂️

I've been frustrated with NextJS lately. Well, I think my friction with Next goes back to when I started using it really. The thing that challenges me with Next is the breakdown between what is a server, and what is a client. 

Back when I started writing code for the web I wrote pure PHP, with no JavaScript (I was like 8 don't hate) and that architecture stuck with me. My mental model became "the server thinks about software, the client displays the content", and honestly for the vast majority of modern apps I think this would work fine. The server does the work, the client displays the work that was done. This setup also had the benefit of being clear about what is happening where. There was no scenario where some of the PHP code you wrote would be sent to the client and executed there. Sure you could accidentally return code or secrets to the client, PHP is certainly not bullet-proof, but it *felt* cleaner.

Sometimes I wonder if the simplicity I'm describing is just nostalgia, or if LAMP being a cleaner architecture for concern separation is true, but I feel it must be the latter, especially given the problems NextJS has been having of late.

It feels like every week I'm reading about a new exploit found in server components or React's middleware. When you aren't 100% sure where your code is running (because you're running JS on the server *and* the client), you're bound to have footgun, whether you're writing a silly crud app, or writing the NextJS core

- [CVE-2025-29927](https://projectdiscovery.io/blog/nextjs-middleware-authorization-bypass)
- [CVE-2025-55182](https://react2shell.com/)

As the lines blurred between the client and server so did my mental model. Slowly it seems like Next introduced more features that allow you to merge these two distinct environments. Client side hydration, server components, `"use client"`, `"server-only"`, these things allowed use to write server only code in files which look like they get sent to the client. When it feels easy to make this mistake, even meticulous devs will do it. I've spent many nights troubleshooting import paths the result in React code being imported into a server environment (which throws nicely and is easy to find) and server only libraries being imported to the client (which is a more painful process). These problems are largely mitigated by having strong guardrails like a well set up linter, type system, and test suite, but it *still feels messy*.

So what's the solution? Certainly not fully switching to PHP (though I find myself yearning for its simplicity sometimes) as I need solid type integration through my stack, which sometimes includes React Native applications.

One approach I've had success with (for a specific type of project) is the SSG Eleventy. I've been using Eleventy for static client websites like [Genesis Midwives](https://www.genesismidwives.ca/) and [DumboOctopusConsulting](https://www.genesismidwives.ca/) with quite a bit of success. I love the simplicity of SSG. No worry of server code being served to the client, just raw HTML CSS and JS. There is a bit of server code required (usually for submitting a form) but I've found that adding Vercel's `/api` route or CloudFlare's `/workers` enables an API in your static site that is reliable. But of course a static site with a simple API is not a one size fits all solution.

Currently I'm working on a mono-repo for a marketing site, web app, and React Native app. I've been tossing around a few ideas on what stack to approach this with while trying to avoid the pains I feel with NextJS. I (think) I've settled on a monorepo with three projects:
- **Fastify API** - usually I would go Express, but I'm excited to try something new
- **Astro** - The idea of getting the simplicity of SSR and a clear client/server boundary is intriguing to me. This will be my first Astro project, hopefully not my last!
- **React Native** - Good ole' React Native for mobile application allows me to write language in all three apps, and enables great E2E types through the projects

My hope is that Astro delivers on its promise of client server separation, if it does, it seems like it's going to be a hugely useful tool to add to my toolbelt.  My understanding is that using it as content heavy marketing site for a new SaaS or mobile app is going to yield safe end-to-end typing and a much more pleasant developer experience. Maybe it will resolve my problems with Next, and *maybe* in 10 years when I'm working with the latest flashy JS framework, I will look back at Astro the same way I currently look at PHP.

Here's hoping.