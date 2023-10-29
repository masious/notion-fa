window.browser = (function() {
  return window.msBrowser || window.browser || window.chrome;
})();
var obsRun = false;

const patt = /^[\u0621-\u0628\u062A-\u063A\u0641-\u0642\u0644-\u0648\u064E-\u0651\u0655\u067E\u0686\u0698\u06A9\u06AF\u06BE\u06CC\u06F0-\u06F9\u060C\u061B\u061F\u0640\u066A\u066B\u066C\u0629\u0643\u0649-\u064B\u064D\u06D5\u0660-\u0669\u0020\u2000-\u200F\u2028-\u202F]+$/

var url = new URL(document.location.href).hostname;
browser.storage.local.get('sites', function(result) {
  if (url.includes('notion')) {
    let run_against_article = post_article => {
      if (!patt.test(post_article.innerText)) return;
      post_article.style.fontFamily = 'Vazir'
      post_article.style.direction = 'rtl'
      post_article.style.textAlign = 'right'
    };

    let run_on_page = () => {
      let post_articles = document.querySelectorAll(
        'h1,h2,h3,h4,h5,h6,p,li,td,tr,pre,font,blockquote,small,center,span,a,div,strong,input'
      );
      if (!post_articles.length) return;

      let i = 0,
        len = post_articles.length;
      for (; i < len; i++) run_against_article(post_articles[i]);
    };
    obsRun = true;
    run_on_page();
    new MutationObserver(run_on_page).observe(document.body, {
      childList: true,
      subtree: true
    });

    browser.storage.onChanged.addListener(function(changes, namespace) {
      let run_against_article = post_article => {
        if (!patt.test(post_article.innerText)) return;
        post_article.style.fontFamily = 'Vazir'
        post_article.style.direction = 'rtl'
        post_article.style.textAlign = 'right'
      };

      let run_on_page = () => {
        let post_articles = document.querySelectorAll(
          'h1,h2,h3,h4,h5,h6,p,li,td,tr,pre,font,blockquote,small,center,span,a,div,strong,input'
        );
        if (!post_articles.length) return;

        let i = 0,
          len = post_articles.length;
        for (; i < len; i++) run_against_article(post_articles[i]);
      };
      if (obsRun == false) {
        run_on_page();
        new MutationObserver(run_on_page).observe(document.body, {
          childList: true,
          subtree: true
        });
      } else {
        run_on_page();
      }
    });
  } else {
  
  }
});
