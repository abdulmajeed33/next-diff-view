"use client";

import { useEffect, useState } from "react";
import { Table_Pattern, Table_Pattern_Only_Occurrence, cleanMarkdown, getTableContents, markdownToHtml, stripOffMdContent } from "./helper";
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer-continued';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { after, before } from "./data";



export default function Page(){

  const [htmlTableOfBeforeMarkdown, setHtmlTableOfBeforeMarkdown] = useState<string[]>([]);
  const [htmlTableOfAfterMarkdown, setHtmlTableOfAfterMarkdown] = useState<string[]>([]);


  const [processedBeforeMarkdown, setProcessedBeforeMarkdown] = useState<string>("");
  const [processedAfterMarkdown, setProcessedAfterMarkdown] = useState<string>("");

  const [finalBeforeMarkdown, setFinalBeforeMarkdown] = useState<string>("");
  const [finalAfterMarkdown, setFinalAfterMarkdown] = useState<string>("");

  const [isLoadingBeforeMarkdown, setIsLoadingBeforeMarkdown] = useState<boolean>(true);
  const [isLoadingAfterMarkdown, setIsLoadingAfterMarkdown] = useState<boolean>(true);

  useEffect(() => {
    const cleanedBeforeMarkdown = cleanMarkdown(before);
    const cleanedAfterMarkdown = cleanMarkdown(after);

    const strippedBeforeMarkdown = stripOffMdContent(cleanedBeforeMarkdown);
    const strippedAfterMarkdown = stripOffMdContent(cleanedAfterMarkdown);

    setProcessedBeforeMarkdown(strippedBeforeMarkdown);
    setProcessedAfterMarkdown(strippedAfterMarkdown);
  }, [finalBeforeMarkdown, finalAfterMarkdown]);

  useEffect(() => {
    const tablesHtml: string[] = [];
    const tableContentsBefore: string[] = getTableContents(Table_Pattern, processedBeforeMarkdown);

    tableContentsBefore.forEach((content) => {
      markdownToHtml(content).then((html) => {
        tablesHtml.push(html.replace(/\r?\n|\r/g, "") + '\n');
      });

      setHtmlTableOfBeforeMarkdown(tablesHtml);
    });
  }, [processedBeforeMarkdown]);

  useEffect(() => {

    let updatedContentBefore = processedBeforeMarkdown;

    for (let html of htmlTableOfBeforeMarkdown) {
      updatedContentBefore = updatedContentBefore.replace(Table_Pattern_Only_Occurrence, html.toString());
    }

    if (updatedContentBefore !== '') setFinalBeforeMarkdown(updatedContentBefore);

    setIsLoadingBeforeMarkdown(false);
  }, [htmlTableOfBeforeMarkdown]);

  useEffect(() => {
    const tableAfterHtml: string[] = [];
    const tableContentsAfter: string[] = getTableContents(Table_Pattern, processedAfterMarkdown);

    tableContentsAfter.forEach((content) => {
      markdownToHtml(content).then((html) => {
        tableAfterHtml.push(html.replace(/\r?\n|\r/g, "") + '\n');
      });

      setHtmlTableOfAfterMarkdown(tableAfterHtml);
    });
  }, [processedAfterMarkdown]);

  useEffect(() => {

    let updatedContentAfter = processedAfterMarkdown;

    for (let html of htmlTableOfAfterMarkdown) {
      updatedContentAfter = updatedContentAfter.replace(Table_Pattern_Only_Occurrence, html.toString());
    }

    if (updatedContentAfter !== '') setFinalAfterMarkdown(updatedContentAfter);

    setIsLoadingAfterMarkdown(false);
  }, [htmlTableOfAfterMarkdown]);

  const sidebySideStyles = {
    diffContainer: {
      color: 'white',
      padding: '10px',
      margin: '10px 0',
      borderRadius: '5px',

    },
    codeFold: {
      backgroundColor: '#c5c7d0',
      padding: '10px',
      borderRadius: '5px',
      margin: '10px 0',
    },
    titleBlock: {
      backgroundColor: '#c5c6d0',
      padding: '10px',
      margin: '10px 0',
    },
    wordAdded: {
      backgroundColor: '#66a9b1',
      color: 'black',
      padding: '10px',
      margin: '10px 20px',
    },
    wordRemoved: {
      backgroundColor: '#ab6169',
      color: 'black',
      padding: '10px',
      margin: '10px 20px',
    },
    line: {
      color: 'white',
      padding: '10px',
      margin: '10px 0',
      verticalAlign: 'middle',
    },
    lineNumber: {
      color: 'white',
      padding: '10px',
      margin: '10px 0',
      verticalAlign: 'middle',
    },

  };

  if (isLoadingBeforeMarkdown || isLoadingAfterMarkdown) return <div>Loading...</div>

      

    return(
       <>
      <ReactDiffViewer
        oldValue={isLoadingBeforeMarkdown || isLoadingAfterMarkdown ? '' : finalBeforeMarkdown}
        newValue={isLoadingBeforeMarkdown || isLoadingAfterMarkdown ? '' : finalAfterMarkdown}
        leftTitle={'Before'}
        rightTitle={'After'}
        styles={sidebySideStyles}
        // useDarkTheme={true}
        splitView={true}
        compareMethod={DiffMethod.TRIMMED_LINES}
        renderContent={(source: string) => {
          // console.log("source",source);
          return (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw] as any}
              // children={source}
              components={{
                h1: ({ node, ...props }) => (
                  <h1 className="text-3xl font-bold my-10" {...props} />
                ),
                h2: ({ node, ...props }) => (
                  <h2 className={`text-2xl font-bold py-2  border-b-2 border-gray-100 `} {...props} />
                ),
                h3: ({ node, ...props }) => (
                  <h3 className="text-xl font-bold my-2" {...props} />
                ),
                h4: ({ node, ...props }) => (
                  <h4 className="text-lg font-bold my-2" {...props} />
                ),
                h5: ({ node, ...props }) => (
                  <h5 className="text-lg font-bold my-2" {...props} />
                ),
                h6: ({ node, ...props }) => (
                  <h6 className="text-lg font-bold my-2" {...props} />
                ),
                hr: ({ node, ...props }) => <hr className="my-4" {...props} />,
                p: ({ node, ...props }) => <p className="text-lg my-2" {...props} />,
                a: ({ node, ...props }) => (
                  <a className="text-blue-600 no-underline" {...props} />
                ),
                ul: ({ node, ...props }) => (
                  <ul className="list-disc list-inside" {...props} />
                ),
                ol: ({ node, ...props }) => (
                  <ol className="list-decimal list-inside" {...props} />
                ),
                li: ({ node, ...props }) => (
                  <li className="text-lg" {...props} />
                ),
                strong: ({ node, ...props }) => {
                  return <strong className={`font-bold`} {...props} />
                },
                blockquote: ({ node, ...props }) => (
                  <blockquote className="border-l-4 border-gray-500 pl-4 my-2" {...props} />
                ),
                pre: ({ node, ...props }) => (
                  <pre className="bg-gray-800" {...props} />
                ),
                code: ({ node, ...props }) => (
                  <code className="bg-gray-800 p-1" {...props} />
                ),
                del: ({ node, ...props }) => {
                  return <del className={`delete no-underline bg-red-500`} {...props} />
                },
                ins: ({ node, ...props }) => {
                  return <ins className={`insert no-underline bg-green-500`} {...props} />
                },
                table: ({ node, ...props }) => (
                  <table className="table-auto w-full" {...props} />
                ),
                tr: ({ node, ...props }) => (
                  <tr className="border px-1 border-black" {...props} />
                ),
                td: ({ node, ...props }) => (
                  <td className="border px-1 text-sm border-black " {...props}

                  />
                ),
                th: ({ node, ...props }) => (
                  <th className="border px-1 border-black" {...props} />
                ),

              }}
            >
              {source}
            </ReactMarkdown>


          )
        }}

      />

       </>
    )

}