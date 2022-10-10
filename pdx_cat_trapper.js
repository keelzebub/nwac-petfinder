window.respondToVisibility = (element, callback) => {
  const options = { threshold: 1.0 };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.target === element && entry.isIntersecting) {
        callback();
        observer.disconnect();
      }
    });
  }, options);

  observer.observe(element);
}

window.complexCounter = (currentCount, totalCount, countNode) => {
  let timeout = 20;
  if (currentCount > (totalCount - 3)) {
    timeout = 200;
  } else if (currentCount > (totalCount - 10)) {
    timeout = 100;
  } else if (currentCount > (totalCount - 30)) {
    timeout = 50;
  }

  setTimeout(() => {
    countNode.textContent = ++currentCount;

    if (currentCount < totalCount) {
      complexCounter(currentCount, totalCount, countNode);
    }
  }, timeout);
};

window.onload = function() {
  const tnrTitleNode = document.evaluate("//p[contains(., 'Cats TNR')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  const rescuedTitleNode = document.evaluate("//p[contains(., 'Cats/Kittens Rescued')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  const caregiversTitleNode = document.evaluate("//p[contains(., 'Caregivers Helped')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

  const tnrCountNode = tnrTitleNode.previousSibling;
  const rescuedCountNode = rescuedTitleNode.previousSibling;
  const caregiversCountNode = caregiversTitleNode.previousSibling;

  const tnrCount = parseInt(tnrCountNode.textContent, 10);
  const rescuedCount = parseInt(rescuedCountNode.textContent, 10);
  const caregiversCount = parseInt(caregiversCountNode.textContent, 10);

  tnrCountNode.textContent = 0;
  rescuedCountNode.textContent = 0;
  caregiversCountNode.textContent = 0;

  respondToVisibility(tnrCountNode, complexCounter.bind(null, 0, tnrCount, tnrCountNode));
  respondToVisibility(rescuedCountNode, complexCounter.bind(null, 0, rescuedCount, rescuedCountNode));
  respondToVisibility(caregiversCountNode, complexCounter.bind(null, 0, caregiversCount, caregiversCountNode));
}