# DavidASix Portfolio Website

Welcome to the repository of my portfolio website. This project is a combination of a front-end site and a Content Management System (CMS). The front-end is built with Next.js and the CMS is powered by FireCMS. Both parts are hosted through a single Firebase project.

## Project Structure

The project is divided into two main directories:

- [`cms`](# "cms"): Contains the code for the CMS powered by FireCMS.
- [`site`](# "site"): Contains the code for the front-end website built with Next.js.

Each directory has its own set of dependencies and scripts defined in their respective [`package.json`](# "cms/package.json") files.

## Tech Stack
### Front-End
The front-end of the portfolio is built using [Next.js](# "https://nextjs.org/") in order to take advantage of the power of React as well as the simplicity of Server Side Rendering. The front-end code is located in the [`site`](# "site") directory.

### CMS
The CMS is built using [FireCMS](# "https://firecms.co/"), a headless CMS powered by Firebase. It provides an intuitive interface for managing the content of the portfolio. The CMS is configured in the [`cms`](# "cms") directory.

### Firebase
For simplicity the whole project is created with Firebase. Previously I have hosted my portfolio sites on a VPS running NGINX, but the simplicity of hosting and managing data in one location is hard to beat. This project makes use of the following Firebase features:
* **Hosting**
    The site and CMS are both hosted on Firebase hosting, taking advantage of their experimental web framework settings.
* **Firestore Database** & **Storage**
    The CMS stores collections and uploaded files here
* **Authentication**
    Used to log into the CMS
* **Analytics**
    Integrated with Google Analytics proper, views and actions per page are monitored here.
* **Functions**
    Used for server side rendering as well as secure API routes

## License

In short, if you're not DavidASix, please don't re-host these sites. This being said, feel free to use the code as reference.
This project is licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International (CC BY-NC-ND 4.0) License - see the LICENSE.md file for details.

## Contact

If you have any questions or feedback, feel free to reach out to me at [david@davidasix.com](# " mailto:david@davidasix.com?subject=Regarding%20DavidASix.com%20on%20Github ").

Thank you for visiting my portfolio repository!

## Like my work? 
[<img 
    height='50' 
    style='border:0px;height:50px;' 
    src='https://storage.ko-fi.com/cdn/kofi5.png?v=3' 
    border='0' 
    alt='Buy Me a Coffee at ko-fi.com' />](https://ko-fi.com/davidasix)

## I'm open to work!

[<img 
    height='50' 
    style='border:0px;height:50px;' 
    src='https://content.linkedin.com/content/dam/me/business/en-us/amp/brand-site/v2/bg/LI-Logo.svg.original.svg' 
    border='0' 
    alt='Connect with me on Linkedin' />](https://www.linkedin.com/in/davidasix/)