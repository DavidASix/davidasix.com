const c = module.exports;

c.siteName = "DavidASix";
c.titlePrefix = 'DavidASix';
c.url = "davidasix.com";

c.cms = 'https://api.davidasix.com'

c.domain = process.env.NODE_ENV === "production"
  ? "https://davidasix-com.vercel.app"
  : "http://localhost:3000";

c.plausible_domain = process.env.NODE_ENV === "production"
? "davidasix.com"
: "na";

c.google_tag = process.env.NODE_ENV === "production"
? "G-"
: "na";


c.sectionPadding = "w-full px-0 md:px-4 lg:px-10 xl:px-32 2xl:px-64 flex flex-col items-center";
c.contentContainer = "max-w-[1500px] px-1 md:px-0";