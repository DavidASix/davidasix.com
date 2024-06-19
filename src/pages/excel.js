import Head from "next/head";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

import NavigationLayout from "@/components/NavigationLayout";
import { Formula, FormulaSkeleton } from "@/components/Excel";
import c from "@/assets/constants";

const itemsPerPage = 4;

export const getServerSideProps = async () => {
  let formulas = [];
  let max_page = 0;
  try {
    const { data } = await axios.post(`${c.domain}/api/cms/excel`, {
      page: 1,
      itemsPerPage,
    });
    formulas = data.formulas;
    max_page = data.max_page;
  } catch (err) {
    console.log(err);
  }
  return { props: { formulas_str: JSON.stringify(formulas), max_page } };
};

export default function Excel({ formulas_str, max_page }) {
  const [formulas, setFormulas] = useState(JSON.parse(formulas_str) || []);
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPage, setMaxPage] = useState(max_page * 1);
  const [loadingNextPage, setLoadingNextPage] = useState(false);
  const formulaListRef = useRef(null);
  // Current page state needs to be available in the scroll listener
  // while currentPage is not displayed in the UI, I'm keeping it in state as the functionality may be used in future
  const currentPageRef = useRef(currentPage);
  useEffect(() => {currentPageRef.current = currentPage}, [currentPage]);

  useEffect(() => {
    const checkScrollEnd = () => {
      if (formulaListRef.current) {
        const formulaListTop =
          formulaListRef.current.getBoundingClientRect().top + window.scrollY;
        const formulaListHeight = formulaListRef.current.clientHeight;
        const formulaListLoadNewBuffer = 100;
        const loadMoreLocation =
          formulaListTop + formulaListHeight - formulaListLoadNewBuffer;
        const { scrollTop, clientHeight } = document.documentElement;
        const scrolledLoad = scrollTop + clientHeight >= loadMoreLocation;
        if (scrolledLoad && !loadingNextPage && currentPageRef.current !== maxPage) {
          loadNextPage();
        }
      }
    };

    window.addEventListener("scroll", checkScrollEnd);

    // Return function to kill listener when component unmounts
    return () => {
      window.removeEventListener("scroll", checkScrollEnd);
    };
  }, [maxPage]);

  async function loadNextPage() {
    setLoadingNextPage(true)
    try {
      const { data } = await axios.post("/api/cms/excel", {
        page: currentPage + 1,
        itemsPerPage,
      });
      await new Promise((resolve) => setTimeout(resolve, 750));
      setFormulas([...formulas, ...data.formulas]);
      // Due to the ref being used to check current page in the scroll event listener
      // If the event listener triggers again before the state and ref are updated,
      // the state will update multiple times, potentiall jumping above maxPage
      // The logic in this state update prevents that, maxing out the page to maxPage
      setCurrentPage((prev) => {
        return prev >= maxPage ? maxPage : prev + 1;
      });
    } catch (err) {
      console.log(err);
      alert("Could not find more formulas.");
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
        <section className={`${c.sectionPadding} w-full`}>
          <div
            className={`${c.contentContainer} w-full relative grid grid-cols-6`}
          >
            <div className="col-span-6 mb-8 md:mb-4">
              <h1 className={`text-7xl header-font text-center text-nowrap`}>
                Microsoft Excel
              </h1>
              <p className={`text-center max-w-[700px] mx-auto mt-8`}>
                Excel is a tool I think everyone should know a little about, and
                one that I know a lot about.
                <br />
                In my many years working with Excel I have created and uncovered
                some clever formulas. I’ve included some of my favorite works
                below to impress and amaze.
              </p>
            </div>

            <div className="order-2 md:order-1 col-span-6 md:col-span-4 relative h-content px-2 md:p-0">
              <h2 className={`text-4xl font-bold mt-8 mb-4 md:mt-0`}>
                The Hall of Formulas
              </h2>
              <div
                id="formulaList"
                ref={formulaListRef}
                className="flex flex-col space-y-6 md:pe-3"
              >
                {formulas.map((formula, i) => (
                  <Formula {...formula} key={i} />
                ))}
                {loadingNextPage && <FormulaSkeleton />}
                {currentPage === maxPage && (
                  <p className="text-center col-12">That's all for now!</p>
                )}
              </div>
            </div>

            <div
              className={`order-1 md:order-2 col-span-6 md:col-span-2 h-min flex md:sticky md:top-16 p-1`}
            >
              <div className={`frosted rounded-2xl flex flex-col p-3`}>
                <div className="hidden md:flex flex-col space-y-2 pb-4">
                  <h5 className="text-xl font-bold">Excel & Me</h5>
                  <p>
                    Some people have a love hate relationship with Spreadsheets;
                    I have a love love relationship with them.
                  </p>
                  <p>
                    Over my many years of experience with Excel I've always
                    challenged myself to push the boundaries, making sheets and
                    reports that are as small as possible while still being easy
                    for a user to utilize
                  </p>
                  <p>
                    I've been an Excel beta feature tester for years,
                    subscribing on my personal Microsoft account as trying out
                    the new features is so fun.
                  </p>
                </div>
                <h5 className="text-xl font-bold">Excel Highlights</h5>
                <ul className="list-disc list-inside">
                  <li>
                    Creating reports for C level executives in Canadian Telecom
                  </li>
                  <li>
                    Creating reproducible accountability reporting to effect
                    actual change in a large company
                  </li>
                  <li>
                    Selling hundreds of spreadsheet reports online due to great
                    UI design
                  </li>
                  <li>
                    Pushing Excel's capabilities with Power Query, Data Models,
                    3D maps, and advanced functions
                  </li>
                </ul>
                <b className="font-bold mt-4">TL;DR</b>
                <p>Excel rocks and I rock at Excel.</p>
              </div>
            </div>
          </div>
        </section>
      </NavigationLayout>
    </>
  );
}
