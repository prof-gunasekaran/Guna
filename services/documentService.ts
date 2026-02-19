
import { PDFProcessResult } from '../types';

declare const pdfjsLib: any;
declare const mammoth: any;

const hasTamilCharacters = (text: string): boolean => {
  const tamilRange = /[\u0B80-\u0BFF]/;
  return tamilRange.test(text);
};

export const processDocument = async (file: File): Promise<PDFProcessResult> => {
  const extension = file.name.split('.').pop()?.toLowerCase();

  if (extension === 'pdf') {
    return processPDF(file);
  } else if (extension === 'docx') {
    return processWord(file);
  } else {
    throw new Error("ஆதரிக்கப்படாத கோப்பு வகை.");
  }
};

const processPDF = async (file: File): Promise<PDFProcessResult> => {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  
  const pdf = await loadingTask.promise;
  let fullText = "";
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    
    let lastY: number | null = null;
    let pageText = "";

    for (const item of textContent.items) {
      if ('str' in item) {
        if (lastY !== null && Math.abs(item.transform[5] - lastY) > 5) {
          pageText += "\n";
        }
        pageText += item.str;
        lastY = item.transform[5];
      }
    }
    
    fullText += pageText + "\n\n";
  }

  const finalContent = fullText.trim();
  
  return {
    title: file.name.replace(/\.pdf$/i, ''),
    content: finalContent || "மன்னிக்கவும், இந்த PDF கோப்பிலிருந்து உரையைப் பிரித்தெடுக்க முடியவில்லை."
  };
};

const processWord = async (file: File): Promise<PDFProcessResult> => {
  const arrayBuffer = await file.arrayBuffer();
  try {
    const result = await mammoth.extractRawText({ arrayBuffer });
    const finalContent = result.value.trim();
    
    return {
      title: file.name.replace(/\.docx$/i, ''),
      content: finalContent || "மன்னிக்கவும், இந்த Word கோப்பிலிருந்து உரையைப் பிரித்தெடுக்க முடியவில்லை."
    };
  } catch (error) {
    console.error("Word processing error:", error);
    throw new Error("Word கோப்பைப் படிப்பதில் பிழை ஏற்பட்டது.");
  }
};
