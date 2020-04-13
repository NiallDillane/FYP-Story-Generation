const EditCaretPositioning = {}

export default EditCaretPositioning;


if (window.getSelection && document.createRange) {
    //saves caret position(s)
    EditCaretPositioning.saveSelection = function(containerEl) {
        var range = window.getSelection().getRangeAt(0);
        var preSelectionRange = range.cloneRange();
        preSelectionRange.selectNodeContents(containerEl);
        preSelectionRange.setEnd(range.startContainer, range.startOffset);
        var start = preSelectionRange.toString().length;

        return {
            start: start,
            end: start + range.toString().length
        }
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
        console.log("restoring to " + savedSelStart);
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(containerEl);
        textRange.collapse(true);
        textRange.moveEnd("character", savedSelEnd);
        textRange.moveStart("character", savedSelStart);
        textRange.select();
    };

}