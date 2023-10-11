import Head from 'next/head';
import React from 'react'
import cs from "src/styles/common.module.css";

import NavigationLayout from 'src/components/NavigationLayout/';
import CurveHeader from 'src/components/CurveHeader';

const policy = [
    {
        title: 'Introduction',
        paragraphs: [
            "Welcome to JustDogs, developed by DavidASix. Your privacy is important to us, and this Privacy Policy is here to explain how we collect, use, and protect your personal information when you use our app.",
            "By using the JustDogs app, you agree to the terms outlined in this Policy. If you do not agree with these terms, please refrain from using the app."
        ]
    },
    {
        title: 'Data Collection',
        paragraphs: [
            "We collect email addresses for user data purposes, but only when a user makes an in-app purchase. If you do not make an in-app purchase, no data will be collected from you.",
            "Each user will be assigned an anonymous User ID (UID) to track purchases and improve your experience."
        ]
    },
    {
        title: 'Advertisements',
        paragraphs: [
            "JustDogs reserves the right to use Facebook Ad Network services to deliver relevant advertisements to you. Please review Facebook's Privacy Policy for information on how they handle your data."
        ]
    },
    {
        title: 'App Store Rules and Regulations',
        paragraphs: [
            "Users must comply with the rules and regulations of their respective app stores (e.g., Apple App Store, Google Play Store) while using this app. Failure to do so may result in your account being suspended or terminated."
        ]
    },
    {
        title: 'Data Security',
        paragraphs: [
            "We take your data security seriously and implement reasonable measures to protect it. However, please be aware that no method of data transmission over the internet or electronic storage is completely secure, and we cannot guarantee the absolute security of your information."
        ]
    },
    {
        title: 'Changes to Privacy Policy',
        paragraphs: [
            "This Privacy Policy may be updated from time to time to reflect changes in our practices or for legal compliance. We will notify you of any significant changes through the app or via email if applicable. Your continued use of the App after any changes to this Policy signifies your acceptance of those changes."
        ]
    },
    {
        title: 'Contact Information',
        paragraphs: [
            "If you have any questions or concerns regarding this Privacy Policy or the App, you can contact the developer, DavidASix, at justdogs@davidasix.com."
        ]
    }
];


export default function MidwifeAssist() {
  return (
    <>
      <Head>
        <title>Just Dogs | DavidASix</title>
      </Head>
      <NavigationLayout>
        <section className={`${cs.header}`} />

        <section className={`row d-flex justify-content-center align-items-start align-content-start ${cs.maxSection} ${cs.heroSection} ${cs.stickyParent} p-0`}>
          <div className={`col-12 p-0 ${cs.center} flex-column`} style={{zIndex: 30}}>
            <h2 className={`m-3 mb-0 headerFont display-1 text-center`}>
                Just Dogs
            </h2>
            <h3 className={`m-3 mt-0 headerFont display-6 text-center`}>
                Stop doom scrolling, start dog scrolling
            </h3>
            <p className={`text-center d-none d-lg-flex`}>
              This privacy policy governs the use of JustDogs, a mobile application developed by DavidASix.
            </p>
          </div>
          <div
            className={`row col-lg-8 col-12`}
            style={{ zIndex: 30, top: 40 + 8 + 8 + 16 + 16 }}
          >
            <div className={`${cs.frosted} col-12 rounded-3 d-flex flex-column p-3 mb-3`}>
                <h2 className="headerFont m-0 mb-1 h5">
                    Privacy Policy for JustDogs
                </h2>
                <span>Effective Date: 2023-10-06</span>
                <ol className='headerFont'>
                    {policy.map((section, i) => (
                    <li key={i} className='headerFont h4 my-4'>
                        <h3 className='headerFont h3 mb-4'>{section.title}</h3>
                        {section.paragraphs.map((p, j) => (
                            <p key={j} className='h6 my-3'>
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
