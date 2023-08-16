import { GoRepo } from "react-icons/go";

import cs from "src/styles/common.module.css";

const s = {
  cardContainer: {
    minHeight: 150
  },
  card: {
    borderWidth: 1
  }
}

export default function GithubCard({ project }) {
  return (
    <div className={`col-md-6 col-12 p-2 ${s.cardContainer}`}>
      <div className={`rounded-2 h-100 w-100 d-flex flex-column p-3 ${cs.muted} ${s.card} border rounded-3`}>
        <div className={`row align-items-center position-relative ${cs.muted}`}>  
            <GoRepo size={25} className={`col-2`} />
            <div className={`col-6 p-0`}>
              <h5 className={`text-no-wrap text-bold ${cs.githubText} ${cs.muted} m-0`}>
                  {project.title}
              </h5>
              <small className={`m-0`}>
                DavidASix/{project.slug}
              </small>
            </div>
            <div className={`col-4 align-items-start`}>
              <div className={`border rounded-pill px-2`}>
                <span>
                  Some text
                </span>
              </div>
            </div>
        </div>
        <span className={`py-2 text-wrap ${cs.muted}`}>
            {project.description.length > 125 ? project.description.substring(0, 122) + '...' : project.description}
        </span>
      </div>
    </div>
  );
};

