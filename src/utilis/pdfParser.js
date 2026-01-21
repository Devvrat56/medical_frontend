import * as pdfjsLib from 'pdfjs-dist';

// Configure the worker to use the version from unpkg.
// This is necessary because in a standard Create React App environment, 
// the worker file is not automatically available in the build output directory
// without additional webpack configuration.
pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

/**
 * Extracts text content from a PDF file.
 * @param {File} file - The PDF file object.
 * @returns {Promise<string>} - The extracted text.
 */
export const extractTextFromPdf = async (file) => {
    try {
        const arrayBuffer = await file.arrayBuffer();

        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;

        let fullText = "";

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
                .map((item) => item.str)
                .join(" ");

            fullText += `[Page ${i}]\n${pageText}\n\n`;
        }

        return fullText;
    } catch (error) {
        console.error("Error extracting text from PDF:", error);
        throw new Error("Failed to extract text from PDF. It might be an image-only (scanned) PDF.");
    }
};
