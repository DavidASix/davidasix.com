import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react'
import { collection, getDocs, query, orderBy } from 'firebase/firestore';


import NavigationLayout from 'src/components/NavigationLayout/';
import { Formula, FormulaSkeleton } from 'src/components/Excel/';

import { db } from "src/components/Firebase";

// Initialize Firebase
import constants from 'src/assets/constants';

const formulasPerPage = 4;

const getFormulas = (page) => new Promise(async (resolve, reject) => {
  const currentPage = (page || 1) * 1;
  // Get Blog snapshot
  const formulaCollection = collection(db, "formulas");
  const q = query(formulaCollection, 
    //where("status", "==", "published"),
    orderBy("created_date", "desc"));
  const snapshot = await getDocs(q);

  // Get current page of formulas
  let formulas = snapshot.docs.slice(
    (currentPage - 1) * formulasPerPage,
    currentPage * formulasPerPage
  );

  formulas = formulas.map((doc, i) => doc.data());
  formulas = await Promise.all(formulas);
  return resolve(formulas);
});

const getMaxPage = () => new Promise(async (resolve, reject) => {
  const formulaCollection = collection(db, "formulas");
  const q = query(formulaCollection);
  const snapshot = await getDocs(q);
  // Organize pagination information
  const numberOfPages = Math.ceil(snapshot.size / formulasPerPage);
  return resolve(numberOfPages);
});

export default function Excel() {
  const [formulas, setFormulas] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPage, setMaxPage] = useState(null);
  const [loadingNextPage, setLoadingNextPage] = useState(false);

  const formulaListRef = useRef(null);
  // Current page state needs to be available in the scroll listener
  // while currentPage is not displayed in the UI, I'm keeping it in state as the functionality may be used in future
  const currentPageRef = useRef(currentPage);
  useEffect(() => {currentPageRef.current = currentPage}, [currentPage]);;

  useEffect(() => {
    // Likely does not need to be Async, but I might add an async call here later
    const setInitialFormulas = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      const fetchedFormulas = await getFormulas(1);
      setFormulas(fetchedFormulas)
      const maxPageFetch = await getMaxPage();
      setMaxPage(maxPageFetch);
    }
    setInitialFormulas();
  }, []);

  useEffect(() => {
    const checkScrollEnd = () => { 
      if (formulaListRef.current) {
        const formulaListTop = formulaListRef.current.getBoundingClientRect().top + window.scrollY;
        const formulaListHeight = formulaListRef.current.clientHeight;
        const formulaListLoadNewBuffer = 100;
        const loadMoreLocation = formulaListTop + formulaListHeight - formulaListLoadNewBuffer;
        const { scrollTop, clientHeight } = document.documentElement;
        const scrolledLoad = (scrollTop + clientHeight) >= loadMoreLocation;

        if (scrolledLoad && !loadingNextPage && currentPageRef.current !== maxPage) {
          loadNextPage();
        }
      }
    }

    if (maxPage !== null) {
      window.addEventListener('scroll', checkScrollEnd);
    }

    // Return function to kill listener when component unmounts
    return () => {
        window.removeEventListener('scroll', checkScrollEnd);
    };
  }, [maxPage]);

  async function loadNextPage() {
    try {
      setLoadingNextPage(true);
      const nextPage = currentPage + 1;
      const nextPageFormulas = await getFormulas(nextPage);
      await new Promise(resolve => setTimeout(resolve, 500));
      setFormulas([...formulas, ...nextPageFormulas])
      setCurrentPage(nextPage);
    } catch (err) {
      alert('Could not find more formulas.')
      console.log(err)
    } finally {
      setLoadingNextPage(false);
    }
  }

  return (
    <>
      <Head>
        <title>{`Excel | ${constants.siteName}`}</title>
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
            {/* If there are no formulas loaded yet, render a skeleton layout. */}
            {maxPage === null && Array.from({ length: 3 })
              .map((_, i) => <FormulaSkeleton index={i} key={i} />)}
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
