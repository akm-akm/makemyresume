type ColorScheme = {
  primary: string;
  secondary: string;
  text: string;
  name?: string;
  tooltip?: string;
};

export async function generatePdf(
  htmlContent: string,
  colors: ColorScheme,
  fontSizeMultiplier: number = 1,
  fontFamily: string = "Merriweather, Georgia, serif"
): Promise<void> {
  console.log("📄 Generating PDF via browser print...");

  const baseFontSize = 11 * fontSizeMultiplier;

  const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Resume</title>
      <style>
        @page {
          size: A4;
          margin: 15mm;
        }
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: ${fontFamily};
          font-size: ${baseFontSize}px;
          line-height: 1.45;
          color: ${colors.text};
          background-color: #ffffff;
          padding: 0;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        
        h1 {
          font-size: 1.82em;
          font-weight: 400;
          margin-bottom: 6px;
          color: ${colors.primary};
          text-align: center;
        }
        
        h1 + p {
          text-align: center;
          margin-bottom: 10px;
          font-size: 0.77em;
        }
        
        h2 {
          font-size: 1.1em;
          font-weight: 700;
          color: ${colors.secondary};
          border-bottom: 1px solid #999999;
          padding-bottom: 2px;
          margin-top: 18px;
          margin-bottom: 10px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        h3 {
          font-size: 1.05em;
          font-weight: 700;
          margin-top: 14px;
          margin-bottom: 3px;
          color: ${colors.primary};
        }
        
        p {
          margin-top: 3px;
          margin-bottom: 3px;
        }
        
        ul {
          margin-top: 4px;
          margin-bottom: 4px;
          padding-left: 20px;
          list-style-type: disc;
        }
        
        ol {
          margin-top: 4px;
          margin-bottom: 4px;
          padding-left: 20px;
          list-style-type: decimal;
        }
        
        li {
          margin-top: 2px;
          margin-bottom: 2px;
          display: list-item;
        }
        
        a {
          color: ${colors.text};
          text-decoration: underline;
        }
        
        hr {
          border: none;
          border-top: 1px solid #cccccc;
          margin: 14px 0;
        }
        
        strong {
          font-weight: 700;
        }
        
        em {
          font-style: italic;
          color: #666666;
        }
        
        code {
          font-family: 'Courier New', monospace;
          background-color: #f4f4f4;
          padding: 1px 4px;
          border-radius: 3px;
          font-size: 0.82em;
        }
        
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      </style>
    </head>
    <body>
      ${htmlContent}
    </body>
    </html>
  `;

  // Open a new window for printing
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Please allow popups to download the PDF");
    return;
  }

  printWindow.document.write(printContent);
  printWindow.document.close();

  // Wait for content to load then print
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  console.log("✅ Print dialog opened!");
}
