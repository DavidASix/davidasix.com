import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios';


import NavigationLayout from '@/components/NavigationLayout';
import { Formula, FormulaSkeleton } from 'src/components/Excel';

// Initialize Firebase
import c from 'src/assets/constants';

const itemsPerPage = 4;

export const getServerSideProps = async () => {
  let formulas = [];
  let max_page = 0
  try {
    const {data} = await axios.post(`${c.domain}/api/cms/excel`, {page: 1, itemsPerPage})
    formulas = data.formulas;
    max_page = data.max_page;
  } catch (err) {
    console.log(err);
  }
  return { props: { formulas_str: JSON.stringify(formulas), max_page } };
};


export default function Excel({formulas_str, max_page}) {
  const [formulas, setFormulas] = useState(JSON.parse(formulas_str) || []);
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPage, setMaxPage] = useState(max_page * 1);
  const [loadingNextPage, setLoadingNextPage] = useState(false);
  const formulaListRef = useRef(null);

  useEffect(() => {
    const checkScrollEnd = () => { 
      if (formulaListRef.current) {
        const formulaListTop = formulaListRef.current.getBoundingClientRect().top + window.scrollY;
        const formulaListHeight = formulaListRef.current.clientHeight;
        const formulaListLoadNewBuffer = 100;
        const loadMoreLocation = formulaListTop + formulaListHeight - formulaListLoadNewBuffer;
        const { scrollTop, clientHeight } = document.documentElement;
        const scrolledLoad = (scrollTop + clientHeight) >= loadMoreLocation;

        if (scrolledLoad && !loadingNextPage && currentPage !== maxPage) {
          loadNextPage();
        }
      }
    }

    window.addEventListener('scroll', checkScrollEnd);

    // Return function to kill listener when component unmounts
    return () => {
        window.removeEventListener('scroll', checkScrollEnd);
    };
  }, [maxPage]);

  async function loadNextPage() {
    try {
      const {data} = await axios.post('/api/cms/excel', {page: currentPage + 1, itemsPerPage})
      await new Promise(resolve => setTimeout(resolve, 500));
      setFormulas([...formulas, ...data.formulas])
      setCurrentPage((prev) => prev + 1);
    } catch (err) {
      console.log(err)
      alert('Could not find more formulas.')
    } finally {
      setLoadingNextPage(false);
    }
  }

  return (
    <>
      <Head>
        <title>{`Excel | ${c.siteName}`}</title>
      </Head>
      <NavigationLayout>

        <section className={`nav-padding col-12 row justify-content-center align-items-start stickyParent`}>
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
            <h3 className={`fs-1 col-12 col-lg-10 mb-2`}>
              The Hall of Formulas
            </h3>
          <div 
            id="formulaList" 
            ref={formulaListRef}
            className='col-12 col-lg-6 row order-lg-1 order-2'>
            {formulas.map((formula, i) => <Formula {...formula} key={i} /> )}
            {loadingNextPage && <FormulaSkeleton />}
            {currentPage === maxPage && <p className="text-center col-12">That's all for now!</p>}
          </div>
          <div
            className={`d-flex col-lg-4 px-3 row sticky-lg-top order-lg-2 order-1`}
            style={{ zIndex: 30, top: 40 + 8 + 8  + 8 }}
          >
            <div className={`frosted col-12 rounded-4 d-flex flex-column p-3 mb-3`}>
              <h5 className="header-font m-0 mb-1">Excel & Me</h5>
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
