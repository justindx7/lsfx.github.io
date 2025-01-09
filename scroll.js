document.addEventListener('DOMContentLoaded', function () {
  const scrollButton = document.getElementById('scrollToNext');

  scrollButton.addEventListener('click', function (e) {
    e.preventDefault(); // Prevent default anchor behavior

    // Find the next <h2> element after the current one in the DOM
    const allH2s = document.querySelectorAll('h2');
    const currentH2 = document.querySelector('h2'); // The first <h2> element

    // Find the index of the current <h2> and get the next one
    const currentIndex = Array.from(allH2s).indexOf(currentH2);
    const nextH2 = allH2s[currentIndex + 1];

    if (nextH2) {
      // Scroll smoothly to the next <h2>
      nextH2.scrollIntoView({ behavior: 'smooth' });
    } else {
      console.warn('Next <h2> not found!');
    }
  });
});
