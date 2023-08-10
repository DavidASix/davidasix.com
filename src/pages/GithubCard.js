import { BsStoplightsFill, BsFileEarmarkCodeFill, BsFillMouse2Fill } from "react-icons/bs";
import { RiHealthBookFill } from "react-icons/ri";

import cs from "src/styles/common.module.css";
import c from "src/assets/constants";

const p = {
  slug: "stoplight",
  icon: "",
  title: "BLE Stop Light",
  description:
    "Dignissim proin volutpat praesent, adipisci potenti, veritatis quae, ut, lacus hymenaeos lacus platea vulputate habitasse rem expedita ac.",
  language: "C++, React-Native",
};
const Icon = (props) => {
  switch (props.slug) {
    case "stoplight":
      return <BsStoplightsFill {...props} />;
    case "midwife":
      return <RiHealthBookFill {...props} />;
    case "automouse":
      return <BsFillMouse2Fill {...props} />;
    default:
      return <BsFileEarmarkCodeFill {...props} />;
  }
};
const GithubCard = ({ project, data }) => {
  return (
    <div className={`col-6 p-1 ${s.cardContainer}`}>
      <div className={`rounded-2 h-100 w-100 d-flex flex-column p-3 ${cs.muted} ${s.card}`}>
        <div className={`d-flex flex-row align-items-center position-relative ${cs.muted}`}>
            <Icon slug={project} size={25} style={{ marginRight: 5 }} />
            <h4 className={`text-no-wrap text-bold ${cs.githubText} ${cs.muted}`}>
                {data.title}
            </h4>
        </div>
        <span className={`py-2 text-wrap ${cs.muted}`}>
            {data.description.length > 125 ? data.description.substring(0, 122) + '...' : data.description}
        </span>
      </div>
    </div>
  );
};

const s = {
  cardContainer: {
    minHeight: 150
  },
  card: {
    borderWidth: 1
  }
}


export default GithubCard;
