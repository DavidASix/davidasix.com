const c = module.exports;

c.siteName = "DavidASix";
c.titlePrefix = 'DavidASix';
c.url = "davidasix.com";

c.api = 'https://api.davidasix.com'

c.plausible_domain = process.env.NODE_ENV === "production"
? "davidasix.com"
: "na";

c.google_tag = process.env.NODE_ENV === "production"
? "G-"
: "na";


c.sectionPadding = "w-full px-0 md:px-4 lg:px-10 xl:px-48 2xl:px-80 flex flex-col items-center";
c.contentContainer = "max-w-[1250px] md:px-0";