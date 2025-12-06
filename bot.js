// Infinite Craft bot
// Original code by The Coding Sloth,with help from ChatGPT: https://www.youtube.com/watch?v=g-U2st6-MZI , Video published 1st January 2025
// Recompiled by Mykal Mayne (Mykzeman), 5th December 2025 

// I wrote this code by investigating the code snippets from the video above and adapting them to work with the current version of the game. I DID NOT COPY AND PASTE AS THERE WAS NO CODE TO BEGIN WITH.

// Please check out the original video and support The Coding Sloth on YouTube!
// With the update to the video description, you are incentivised to join the infinite craft discord server. https://discord.com/invite/NSMut3Wx3Y.

// View the README file for more information.
// Simulate drag and drop
function simulateDragAndDrop(element, startX, startY, targetX, targetY, steps = 10) {
  // Helper function to create and trigger mouse events
  function triggerMouseEvent(target, eventType, clientX, clientY){
    const event = new MouseEvent(eventType, {
  bubbles: true,
  cancelable: true,
  clientX,
  clientY,
  view: window,
    });
    // Dispatch the event to the target element
    target.dispatchEvent(event);
  }
  console.log(`Start: (${startX}, ${startY}), Target: (${targetX}, ${targetY})`);
  triggerMouseEvent(element, "mousedown", startX, startY);// Initial mousedown event
  // Variables to track position and motion
  let currentX = startX;
  let currentY = startY;
  const deltaX = (targetX - startX) / steps;
  const deltaY = (targetY - startY) / steps;
  // Promise to handle motion and dragging
  return new Promise((resolve) => {
    function moveMouse() {
      currentX += deltaX;
      currentY += deltaY;

      triggerMouseEvent(document, "mousemove", currentX, currentY);
      if (Math.abs(currentX - targetX)<Math.abs(deltaX)&&Math.abs(currentY - targetY) <Math.abs(deltaY)){
        triggerMouseEvent(document,"mouseup", targetX,targetY);
        console.log("draganddrop completed.");

        element.style.position="absolute";
        element.style.left=`${targetX}px`;
        element.style.top=`${targetY}px`;

        resolve();
      } else {
        requestAnimationFrame(moveMouse);
      }
    }
    requestAnimationFrame(moveMouse);
  });
}
// Main bot function
async function test() {
  // Load and save pairs from localStorage
  const processedPairs=new Set(JSON.parse(localStorage.getItem("processedPairs")) || []);
  function saveProcessedPairs(){
    localStorage.setItem("processedPairs",JSON.stringify(Array.from(processedPairs)));
  }
  // Click the clear button
async function clickClearButton() {
  const clearBtn=document.getElementsByClassName("clear")[0];
  if (clearBtn) {
    clearBtn.click();
    console.log("clearButton clicked");
  // Problem:need to confirm to clear the crafting area
    await new Promise((resolve) => setTimeout(resolve, 500)); //
  } else {
    console.error("Clear button not found");
  }
}

// Process a combination of two items
async function processCombination(firstItem,secondItem, targetX, targetY) {
  // Get the bounding boxes and calculate center points
  const firstRect = firstItem.getBoundingClientRect();
  const secondRect = secondItem.getBoundingClientRect();
  const firstStartX = firstRect.x + firstRect.width / 2;
  const firstStartY = firstRect.y + firstRect.height / 2;
  const secondStartX = secondRect.x + secondRect.width / 2;
  const secondStartY = secondRect.y + secondRect.height / 2;
  // Simulate drag and drop for both items
  await simulateDragAndDrop(firstItem, firstStartX, firstStartY, targetX, targetY);
  await simulateDragAndDrop(secondItem, secondStartX, secondStartY, targetX, targetY);
  // Problem: clearing happens every time after processing a combination
  // Clear items after processing
  await clickClearButton();
  
}// Process all item combinations in a row
// Update:Updated variable name to appropriate element name
async function processItems(itemWrappers) {
// Get items in the row
  const items = itemWrappers.getElementsByClassName("item");
  // Loop through first item
    for (let i = 0; i < items.length; i++) {
      // Loop through second item
    for (let j = 0; j < items.length; j++) {
      // Skip if same item or already processed
      if(processedPairs.has(`${i},${j}`)) {
        continue;
      }
      // Mark pair as processed
        processedPairs.add(`${i},${j}`);
        saveProcessedPairs();
        // Process the combination

        await processCombination(items[i], items[j], 500, 100);
      
    }
  }
}
// Get all item rows and process them
  const itemWrappers = document.getElementsByClassName("item-wrapper");
  // Loop through each row
  for (let row of itemWrappers) {
    await processItems(row);
  }
}// For every item, indefinitly if truly infinite, loop through the test function,(additional code to make it infinite)
for (let item of document.getElementsByClassName("item")) {
await test();}