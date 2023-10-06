import Head from 'next/head';
import React from 'react'
import cs from "src/styles/common.module.css";

import NavigationLayout from 'src/components/NavigationLayout/';
import CurveHeader from 'src/components/CurveHeader';

const policy = [
    {
        title: 'Introduction',
        paragraphs: [
            `Welcome to Midwife Assist, developed by Davidasix. This Privacy Policy is designed to help you understand how we collect, use, and safeguard your information while using our mobile application. We respect your privacy and are committed to protecting your personal data.`,
        ]
    },
    {
        title: 'Data Collection',
        paragraphs: [
            `We do not collect any personal data or information from users of the Midwife Assist app. We do not gather or store any user data, including patient information entered into the app. The Midwife Assist app operates in an offline mode, and no data is transmitted over the internet through the app.`,
        ]
    },
    {
        title: 'User Responsibility',
        paragraphs: [
            `Any information you enter into the Midwife Assist app, including patient records, is solely your responsibility. We do not access, share, or store this information in any way.`,
            `We provide base-level security in the form of a PIN or biometric lock within the app. While we encourage users to use these security features, we emphasize that they should not solely rely on them for the security of patient data.`,
            `Users are expected to ensure the security of their devices and comply with the applicable governmental standards for data protection in their place of residence.`,
        ]
    },
    {
        title: 'Updates to Privacy Policy',
        paragraphs: [
            `We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. It is your responsibility to review this policy periodically for any updates.`,
        ]
    },
    {
        title: 'Contact Us',
        paragraphs: [
            `If you have any questions or concerns about our Privacy Policy or the Midwife Assist app, please contact us at midwifeassist@davidasix.com`,
            `By using the Midwife Assist app, you agree to the terms outlined in this Privacy Policy.`,
        ]
    },
];

export default function MidwifeAssist() {
  return (
    <>
      <Head>
        <title>Midwife Assist | DavidASix</title>
      </Head>
      <NavigationLayout>
        <section className={`${cs.header}`} />

        <section className={`row d-flex justify-content-center align-items-start align-content-start ${cs.maxSection} ${cs.heroSection} ${cs.stickyParent} p-0`}>
          <div className={`col-12 p-0 ${cs.center} flex-column`} style={{zIndex: 30}}>
            <h2 className={`m-3 mb-0 headerFont display-1 text-center`}>
                Midwife Assist
            </h2>
            <h3 className={`m-3 mt-0 headerFont display-6 text-center`}>
                An app for midwives
            </h3>
            <p className={`text-center d-none d-lg-flex`}>
              This privacy policy governs the use of Midwife Assist, a mobile application developed by DavidASix.
            </p>
          </div>
          <div
            className={`row col-lg-8 col-12`}
            style={{ zIndex: 30, top: 40 + 8 + 8 + 16 + 16 }}
          >
            <div className={`${cs.frosted} col-12 rounded-3 d-flex flex-column p-3 mb-3`}>
                <h2 className="headerFont m-0 mb-1 h5">
                    Privacy Policy for Midwife Assist
                </h2>
                <span>Effective Date: 2023-10-06</span>
                <ol className='headerFont'>
                    {policy.map((section, i) => (
                    <li className='headerFont h4 my-4'>
                        <h3 className='headerFont h3 mb-4'>{section.title}</h3>
                        {section.paragraphs.map((p, j) => (
                            <p className='h6 my-3'>
                                {p}
                            </p>
                        ))}
                    </li>
                    ))}
                </ol>

            </div>
          </div>

          <CurveHeader style={{zIndex: 10}}/>
        </section>

      </NavigationLayout>
    </>
  );
}
