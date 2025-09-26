export const exportPdfPlaceholder = async (markdown: string) => {
  console.warn('PDF export placeholder invoked. Integrate @react-pdf/renderer or serverless PDF service.', markdown);
  return `data:application/pdf;base64,${btoa(markdown)}`;
};
