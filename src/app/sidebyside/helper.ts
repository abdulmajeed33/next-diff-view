import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';


export const Table_Pattern: RegExp = /\|.*\|\s*\n(?:\|.*\|\s*\n)+(?!\| --- \|)\|.*\|\s*\n/g;
export const Table_Pattern_Only_Occurrence: RegExp = /\|.*\|\s*\n(?:\|.*\|\s*\n)+(?!\| --- \|)\|.*\|\s*\n/;

// get the table contents from the markdown content
export function getTableContents(tablePattern: RegExp, markdownContent: string): string[] {
  // Find all occurrences of table content in markdown format
  const allTableMatches = markdownContent.match(tablePattern) || [];
  const tableContents: string[] = [];

  if (allTableMatches.length > 0) {
    allTableMatches.forEach((tableContent: string) => {
      tableContents.push(tableContent.trim());
    });
  }

  return tableContents;
}


// clean the markdown content to remove unnecessary spaces and \n and ---
export function cleanMarkdown(markdownContent: string): string {
  // Replace multiple \n with single \n
  let cleanedContent = markdownContent.replace(/\n+/g, '\n');
  // Remove unnecessary spaces
  cleanedContent = cleanedContent.replace(/\n\s+\n/g, '\n');
  // Remove ---
  cleanedContent = cleanedContent.replace(/---\n/g, '');

  return cleanedContent;
}

// strip off the markdown content to remove unnecessary spaces and \n
export function stripOffMdContent(mdContent: string): string {
  if (!mdContent) {
    return "";
  }

  const lines: string[] = mdContent.split("\n");

  const strippedLines: string[] = lines.map(line => line.trim());
  const strippedContent: string = strippedLines.join("\n");

  return strippedContent;
}

// convert markdown to html
export const markdownToHtml = async (content: string) => {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeStringify)
    .use(rehypeHighlight)
    .process(content);

  return result.toString();
};
