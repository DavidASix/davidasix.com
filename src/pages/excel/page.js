import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import React from 'react'
import cs from "@/styles/common.module.css";

import CurveHeader from '@/components/CurveHeader';

// Initialize Firebase
import firebaseConfig from '@/assets/firebase-config.json';

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
  <div className={`container-fluid col-12 py-3 mb-3 rounded-3 ${cs.frosted}`}>
    <h2 className={``}>{title}</h2>
    <p className={``}>
      {description}
    </p>
    <div className={`rounded-3 border px-3 py-1 d-flex align-items-center ${cs.frosted}`}>
      <code className={`p-0 m-0`}>
        <pre className="m-0">{formula_with_whitespace}</pre>
      </code>
    </div>
  </div>
);

export default async function Excel() {
  let formulas = await getExcelFormulas();
  return (
    <>
      <section className={`${cs.header}`} />

      <section className={`row d-flex justify-content-center align-items-start ${cs.maxSection} ${cs.heroSection} p-0`}>
        <div className={`col-12 p-0 ${cs.center} flex-column`} style={{zIndex: 30}}>
          <h2 className={`m-3 headerFont display-1`}>Hall of Formulas</h2>
          <p style={{textAlign: 'center'}}>
            In my many years working with Excel I have created and uncovered some clever formulas.
          <br />
            I’ve included some of my favourites works below to impress and amaze.
          </p>
        </div>
        <div className='col-lg-8 row me-2'>
          {formulas.map((formula, i) => (
            <React.Fragment key={i}>
              <ExcelFormula {...formula} />
            </React.Fragment>
          ))}
        </div>
        <div
          className={`d-lg-flex  d-none col-lg-2 ms-3 row sticky-top`}
          style={{ zIndex: 30, top: 40 + 8 + 8 + 16 + 16 }}
        >
          <div className={`${cs.frosted} col-12 rounded-3 d-flex flex-column p-3`}>
            <h5 className="headerFont m-0">Some thoughts on Excel</h5>
            <p>Here are some thoughts on Excel and my relationship with it</p>
            <h6 className="headerFont">TL;DR</h6>
            <p>Shorter thoughts</p>
          </div>
        </div>

        <CurveHeader style={{zIndex: 10}}/>
      </section>

    </>
  );
}
