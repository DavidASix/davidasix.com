import Head from 'next/head';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import React from 'react'
import cs from "src/styles/common.module.css";

import NavigationLayout from 'src/components/NavigationLayout/';

// Initialize Firebase
import firebaseConfig from 'src/assets/firebase-config.json';
import constants from 'src/assets/constants';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Get a list of cities from your database
async function getExcelFormulas() {
  const formulaCollection = collection(db, 'formulas');
  let formulas = await getDocs(formulaCollection)
  formulas = formulas.docs.map(doc => doc.data())
  return formulas;
}

const ExcelFormula = ({title, description, formula_with_whitespace}) => (
  <div className={`container-fluid col-12 px-3`}>
    <h2 className={``}>{title}</h2>
    <p className={``}>
      {description}
    </p>
    <div className={`p-3 mt-3 mb-4 d-flex align-items-center frosted rounded-4`}>
      <code className={`p-0 m-0`}>
        <pre className="m-0" style={{whiteSpace: 'pre-wrap', wordBreak: 'break-all'}}>{formula_with_whitespace}</pre>
      </code>
    </div>
  </div>
);

export const getServerSideProps = async ({ searchParams }) => {
  // Get Blog snapshot
  let formulas_str = await getExcelFormulas();
  formulas_str = JSON.stringify(formulas_str);
  return { props: { formulas_str } }
}

export default function Excel({formulas_str}) {
  const formulas = JSON.parse(formulas_str);
  return (
    <>
      <Head>
        <title>{`Excel | ${constants.siteName}`}</title>
      </Head>
      <NavigationLayout>

        <section className={`nav-padding col-12 row justify-content-center align-items-start ${cs.stickyParent}`}>
          <div className={`col-10 col-lg-8 row justify-content-center`} style={{zIndex: 30}}>
            <h1 className={`fs-d1 text-center text-nowrap`}>
              Microsoft Excel
            </h1>
            <p className={`text-center`}>
              Excel is a tool I think everyone should know a little about, and one that I know a lot about.
              <br />
              In my many years working with Excel I have created and uncovered some clever formulas. I’ve included some of my favorite works below to impress and amaze.
            </p>
          </div>
            <h3 className={`fs-1 col-12 col-lg-10`}>
              The Hall of Formulas
            </h3>
          <div className='col-12 col-lg-6 row order-lg-1 order-2'>
            {formulas.map((formula, i) => (
              <React.Fragment key={i}>
                <ExcelFormula {...formula} />
              </React.Fragment>
            ))}
          </div>
          <div
            className={`d-flex col-lg-4 px-3 row sticky-lg-top order-lg-2 order-1`}
            style={{ zIndex: 30, top: 40 + 8 + 8  + 8 }}
          >
            <div className={`frosted col-12 rounded-4 d-flex flex-column p-3 mb-3`}>
              <h5 className="headerFont m-0 mb-1">Excel & Me</h5>
              <p>Some people have a love hate relationship with Spreadsheets; I have a love love relationship with them.</p>
              <p>Over my many years of experience with Excel I've always challenged myself to push the boundaries, making sheets and reports that are as small as possible while still being easy for a user to utilize</p>
              <p>I've been an Excel beta feature tester for years, subscribing on my personal Microsoft account as trying out the new features is so fun.</p>
              <h6 className="mt-1 fw-bold">Excel Highlights</h6>
              <ul>
                <li>Creating reports for C level executives in Canadian Telecom</li>
                <li>Creating reproducible accountability reporting to effect actual change in a large company</li>
                <li>Selling hundreds of spreadsheet reports online due to great UI design</li>
                <li>Pushing Excel's capabilities with Power Query, Data Models, 3D maps, and advanced functions</li>
              </ul>
              <h6 className="fw-bold">TL;DR</h6>
              <p>Excel rocks and I rock at Excel.</p>
            </div>
          </div>

        </section>

      </NavigationLayout>
    </>
  );
}
