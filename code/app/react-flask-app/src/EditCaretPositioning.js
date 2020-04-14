const EditCaretPositioning = {}

export default EditCaretPositioning;

function getCaretPosition (node) {
    var range = window.getSelection().getRangeAt(0),
        preCaretRange = range.cloneRange(),
        caretPosition,
        tmp = document.createElement("div");

    preCaretRange.selectNodeContents(node);
    preCaretRange.setEnd(range.endContainer, range.endOffset);
    tmp.appendChild(preCaretRange.cloneContents());
    caretPosition = tmp.innerHTML.length;
    return caretPosition;
}


if (window.getSelection && document.createRange) {
    //saves caret position(s)
    EditCaretPositioning.saveSelection = function getHTMLCaretPosition(element) {
        var textPosition = getCaretPosition(element),
            htmlContent = element.innerHTML,
            textIndex = 0,
            htmlIndex = 0,
            insideHtml = false,
            htmlBeginChars = ['&', '<'],
            htmlEndChars = [';', '>'];
        
        
        if (textPosition == 0) {
          return 0;
        }
        
        while(textIndex < textPosition) {
        
          htmlIndex++;
        
          // check if next character is html and if it is, iterate with htmlIndex to the next non-html character
          while(htmlBeginChars.indexOf(htmlContent.charAt(htmlIndex)) > -1) {
            // console.log('encountered HTML');
            // now iterate to the ending char
            insideHtml = true;
        
            while(insideHtml) {
              if (htmlEndChars.indexOf(htmlContent.charAt(htmlIndex)) > -1) {
                if (htmlContent.charAt(htmlIndex) == ';') {
                  htmlIndex--; // entity is char itself
                }
                // console.log('encountered end of HTML');
                insideHtml = false;
              }
              htmlIndex++;
            }
          }
          textIndex++;
        }
        
        //console.log(htmlIndex);
        //console.log(textPosition);
        // in htmlIndex is caret position inside html
        return htmlIndex;
    };
    //restores caret position(s)
    EditCaretPositioning.restoreSelection = function(containerEl, savedSelStart, savedSelEnd) {
        console.log("restoring to " + savedSelStart);
        var charIndex = 0, range = document.createRange();
        range.setStart(containerEl, 0);
        range.collapse(true);
        var nodeStack = [containerEl], node, foundStart = false, stop = false;

        while (!stop && (node = nodeStack.pop())) {
            if (node.nodeType === 3) {
                var nextCharIndex = charIndex + node.length;
                if (!foundStart && savedSelStart >= charIndex && savedSelStart <= nextCharIndex) {
                    range.setStart(node, savedSelStart - charIndex);
                    foundStart = true;
                }
                if (foundStart && savedSelEnd >= charIndex && savedSelEnd <= nextCharIndex) {
                    range.setEnd(node, savedSelEnd - charIndex);
                    stop = true;
                }
                charIndex = nextCharIndex;
            } else {
                var i = node.childNodes.length;
                while (i--) {
                    nodeStack.push(node.childNodes[i]);
                }
            }
        }

        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    }



} else if (document.selection && document.body.createTextRange) {
  //saves caret position(s)
    EditCaretPositioning.saveSelection = function(containerEl) {
        var selectedTextRange = document.selection.createRange();
        var preSelectionTextRange = document.body.createTextRange();
        preSelectionTextRange.moveToElementText(containerEl);
        preSelectionTextRange.setEndPoint("EndToStart", selectedTextRange);
        var start = preSelectionTextRange.text.length;

        return {
            start: start,
            end: start + selectedTextRange.text.length
        }
    };
    //restores caret position(s)
    EditCaretPositioning.restoreSelection = function(containerEl, savedSelStart, savedSelEnd) {
        console.log("restoooring to " + savedSelStart);
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(containerEl);
        textRange.collapse(true);
        textRange.moveEnd("character", savedSelEnd);
        textRange.moveStart("character", savedSelStart);
        textRange.select();
    };

}