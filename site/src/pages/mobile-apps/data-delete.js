import Head from 'next/head';
import React from 'react'
import cs from "src/styles/common.module.css";

import NavigationLayout from 'src/components/NavigationLayout/';

const apps = [
    {
        title: 'Just Dogs',
        steps: [
            {
                title: 'Please Note',
                stepText: "Data is only collected for users who have purchased an in-app purchase, like removal of ads. If you have not purchased a service in JustDogs, you have had no data collected.",
            },
            {
                title: 'Open the app',
                stepText: "From your phone, open the JustDogs app",
            },
            {
                title: 'Press the reset',
                stepText: "Press and hold the reset button (indicated by 💫) for 5 seconds. This will open a dialogue box for the next step.",
            },
            {
                title: 'Reset your data',
                stepText: "Click OK on the dialogue box. This will erase your data from the server, which will also revert any in-app purchases you made. You will no longer have access to the purchases you made, no refund will be processed as your information will no longer be available.",
            },
        ]
    }
];

export default function DataDelete() {
  return (
    <>
      <Head>
        <title>Data Delete Request | DavidASix</title>
      </Head>
      <NavigationLayout>
        <section className={`${cs.header}`} />

        <section className={`row d-flex justify-content-center align-items-start align-content-start ${cs.maxSection} ${cs.heroSection} ${cs.stickyParent} p-0`}>
          <div className={`col-8 p-0 ${cs.center} flex-column`} style={{zIndex: 30}}>
            <h2 className={`m-3 mb-0 headerFont display-1 text-center`}>
                Data deletion
            </h2>
            <h3 className={`m-3 mt-0 headerFont display-6 text-center`}>
                Because some info is just for you
            </h3>
            <p className={`text-center d-none d-lg-flex`}>
              This page contains detailed instructions on how to delete any and all personal data you've shared with the developer via their software's. Begin by selecting the software you use, and then follow the instructions provided.
            </p>
          </div>
          <div
            className={`row col-lg-8 col-12`}
            style={{ zIndex: 30, top: 40 + 8 + 8 + 16 + 16 }}
          >
            <div className={`${cs.frosted} col-12 rounded-3 d-flex flex-column p-3 mb-3`}>
                {apps.map((app, i) => (
                    <React.Fragment key={i}>
                    <h2 className="headerFont m-0 mb-1 h2">
                        {app.title}
                    </h2>
                    <span>Account Delete Instructions</span>
                    <ol className='headerFont'>
                        {app.steps.map((section, j) => (
                        <li key={j} className='headerFont h4 my-4'>
                            <h3 className='headerFont h4 mb-4'>{section.title}</h3>
                            <p className='h6 my-3'>
                                {section.stepText}
                            </p>
                        </li>
                        ))}
                    </ol>
                </React.Fragment>
                ))}
                

            </div>
          </div>

        </section>

      </NavigationLayout>
    </>
  );
}
