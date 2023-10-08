import Head from 'next/head';
import React from 'react'
import cs from "src/styles/common.module.css";

import NavigationLayout from 'src/components/NavigationLayout/';
import CurveHeader from 'src/components/CurveHeader';

let policies = [
  {title: 'Midwife Assist', url: '/privacy-policies/midwife-assist'}
] 

export default function PrivacyPolicies() {
  return (
    <>
      <Head>
        <title>Privacy Policies | DavidASix</title>
      </Head>
      <NavigationLayout>
        <section className={`${cs.header}`} />


        <section className={`row d-flex justify-content-center align-items-start align-content-start ${cs.maxSection} ${cs.heroSection} ${cs.stickyParent} p-0`}>
          <div className={`col-12 p-0 ${cs.center} flex-column`} style={{zIndex: 30}}>
            <h2 className={`m-3 mb-0 headerFont display-1 text-center`}>
                Privacy Policies
            </h2>
            <h3 className={`m-3 mt-0 headerFont display-6 text-center`}>
                for DavidASix software
            </h3>
          </div>
          <div
            className={`row col-lg-8 col-12`}
            style={{ zIndex: 30, top: 40 + 8 + 8 + 16 + 16 }}
          >
            <div className={`${cs.frosted} col-12 rounded-3 d-flex flex-column p-3 mb-3 ${cs.center}`}>
                <ol className='headerFont'>
                  {policies.map((p, i) => (
                    <li key={i} className='headerFont h4 my-4'>
                      <a className='headerFont h3 mb-4' href={p.url}>
                        {p.title}
                      </a>
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
