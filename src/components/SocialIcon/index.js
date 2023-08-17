
import {
    FaDiscord,
    FaEnvelope,
    FaFacebookF,
    FaGithub,
    FaInstagram,
    FaLinkedinIn,
    FaMastodon,
    FaPinterest,
    FaQuora,
    FaRedditAlien,
    FaSnapchatGhost,
    FaTelegramPlane,
    FaAt,
    FaTiktok,
    FaTumblr,
    FaTwitch,
    FaWeixin,
    FaWhatsapp,
    FaTwitter,
    FaYoutube,
} from "react-icons/fa";

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

const icons = {
    FaDiscord: (props) => <FaDiscord {...props} />,
    FaEnvelope: (props) => <FaEnvelope {...props} />,
    FaFacebookF: (props) => <FaFacebookF {...props} />,
    FaGithub: (props) => <FaGithub {...props} />,
    FaInstagram: (props) => <FaInstagram {...props} />,
    FaLinkedinIn: (props) => <FaLinkedinIn {...props} />,
    FaMastodon: (props) => <FaMastodon {...props} />,
    FaPinterest: (props) => <FaPinterest {...props} />,
    FaQuora: (props) => <FaQuora {...props} />,
    FaRedditAlien: (props) => <FaRedditAlien {...props} />,
    FaSnapchatGhost: (props) => <FaSnapchatGhost {...props} />,
    FaTelegramPlane: (props) => <FaTelegramPlane {...props} />,
    FaAt: (props) => <FaAt {...props} />,
    FaTiktok: (props) => <FaTiktok {...props} />,
    FaTumblr: (props) => <FaTumblr {...props} />,
    FaTwitch: (props) => <FaTwitch {...props} />,
    FaWeixin: (props) => <FaWeixin {...props} />,
    FaWhatsapp: (props) => <FaWhatsapp {...props} />,
    FaTwitter: (props) => <FaTwitter {...props} />,
    FaYoutube: (props) => <FaYoutube {...props} />,
};

export default function SocialIcon(props) {
    const iconName = socialMediaOptions.find(obj => obj.slug === props.social).iconName;
    const Icon = icons[iconName];
    return <Icon {...props} />;
  }