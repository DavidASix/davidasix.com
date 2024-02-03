import { buildCollection, buildProperty, buildEntityCallbacks } from "firecms";

const socialMediaOptions = [
    { name: "Discord", slug: "discord", iconName: 'FaDiscord', },
    { name: "Email", slug: "email", iconName: 'FaEnvelope', },
    { name: "Facebook", slug: "facebook", iconName: 'FaFacebookF', },
    { name: "Github", slug: "github", iconName: 'FaGithub', },
    { name: "Instagram", slug: "instagram", iconName: 'FaInstagram', },
    { name: "LinkedIn", slug: "linkedin", iconName: 'FaLinkedinIn', },
    { name: "Mastodon", slug: "mastodon", iconName: 'FaMastodon', },
    { name: "Pinterest", slug: "pinterest", iconName: 'FaPinterest', },
    { name: "Quora", slug: "quora", iconName: 'FaQuora', },
    { name: "Reddit", slug: "reddit", iconName: 'FaRedditAlien', },
    { name: "Snapchat", slug: "snapchat", iconName: 'FaSnapchatGhost', },
    { name: "Telegram", slug: "telegram", iconName: 'FaTelegramPlane', },
    { name: "Threads", slug: "threads", iconName: 'FaAt', },
    { name: "TikTok", slug: "tiktok", iconName: 'FaTiktok', },
    { name: "Tumblr", slug: "tumblr", iconName: 'FaTumblr', },
    { name: "Twitch", slug: "twitch", iconName: 'FaTwitch', },
    { name: "WeChat", slug: "wechat", iconName: 'FaWeixin', },
    { name: "WhatsApp", slug: "whatsapp", iconName: 'FaWhatsapp', },
    { name: "X (Twitter)", slug: "twitter", iconName: 'FaTwitter', },
    { name: "YouTube", slug: "youtube", iconName: 'FaYoutube', },
];


export type SocialMediaEntry = {
    socialMedia: string;
    displayName: string;
    url: string;
  };

// Callbacks are super useful
// https://firecms.co/docs/collections/callbacks
const callbacks = buildEntityCallbacks({
    onPreSave: ({values}) => {
        // Validate email url and other social urls
        return values;
    },
  });

export const socialMediaCollection = buildCollection<SocialMediaEntry>({
    name: "Social Medias",
    singularName: "Social Media",
    path: "social-media",
    group: "Site Values",
    icon: "AccountCircle",
    description: "Your social medias",
    permissions: ({ authController, user }) => ({
        read: true,
        edit: true,
        create: true,
        delete: true,
      }),
    textSearchEnabled: false,
    callbacks: callbacks,
    properties: {
        socialMedia: buildProperty({
            name: "Social Media",
            validation: { required: true },
            dataType: "string",
            enumValues: socialMediaOptions.reduce((outputVal, socialMedia) => ({...outputVal, [socialMedia.slug]: socialMedia.name}), {}),
            defaultValue: "Email",
          }),
        displayName: buildProperty({
            name: "Display Name",
            description: "Your accounts name, displayed on your website",
            dataType: "string",
            validation: { required: true },
        }),
        url: buildProperty({
            name: "URL",
            description: "The link users will click to bring them to your social media",
            dataType: "string",
            validation: { required: true, url: true },
        }),
    }
});
