export interface MarkdownError {
  line: number;
  message: string;
  suggestion: string;
  match: string;
}

export function validateMarkdown(markdown: string): MarkdownError[] {
  const errors: MarkdownError[] = [];
  const lines = markdown.split('\n');

  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    
    // Check for heading without space (e.g., #Name instead of # Name)
    const headingNoSpace = line.match(/^(#{1,6})([^\s#])/);
    if (headingNoSpace) {
      errors.push({
        line: lineNumber,
        message: `Heading missing space after "${headingNoSpace[1]}"`,
        suggestion: `Add a space: ${headingNoSpace[1]} ${headingNoSpace[2]}`,
        match: headingNoSpace[0],
      });
    }

    // Check for list without space (e.g., -Item instead of - Item)
    // But ignore italic/bold markers (e.g., *text* or **text**)
    const listNoSpace = line.match(/^(\s*)([-*+])([^\s])/);
    if (listNoSpace && listNoSpace[3] !== '-' && listNoSpace[3] !== '*' && listNoSpace[3] !== '+') {
      // Check if this is italic/bold syntax (has closing marker on same line)
      const marker = listNoSpace[2];
      let isItalicOrBold = false;
      
      if (marker === '*') {
        // Check for italic (*text*) or bold (**text**)
        const hasClosingMarker = line.match(/\*[^*]+\*/) || line.match(/\*\*[^*]+\*\*/);
        if (hasClosingMarker) {
          isItalicOrBold = true;
        }
      }
      
      // Only add error if it's not italic/bold syntax
      if (!isItalicOrBold) {
        errors.push({
          line: lineNumber,
          message: `List item missing space after "${listNoSpace[2]}"`,
          suggestion: `Add a space: ${listNoSpace[2]} ${listNoSpace[3]}`,
          match: listNoSpace[0],
        });
      }
    }

    // Check for link with missing brackets or parentheses
    const malformedLink = line.match(/\[([^\]]+)\]\s+\(|^[^[]*\]([^(])/);
    if (malformedLink) {
      errors.push({
        line: lineNumber,
        message: `Link syntax may be incorrect`,
        suggestion: `Use format: [text](url)`,
        match: malformedLink[0],
      });
    }
  });

  return errors;
}

