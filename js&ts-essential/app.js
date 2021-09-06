const container = document.getElementById('root');
const ajax = new XMLHttpRequest(); // let은 변수, const는 상수
const newsURL = 'https://api.hnpwa.com/v0/news/1.json';
const contentsUrl = 'https://api.hnpwa.com/v0/item/@{id}.json';
const store = {
    currentPage: 1,
};

function getData(url) {
    ajax.open('GET', url, false);
    ajax.send();
    return JSON.parse(ajax.response);
}

function newsFeed() {
    const newsFeed = getData(newsURL);
    const newsList = [];
    let template = `
        <div class="bg-gray-600 min-h-screen">
          <div class="bg-white text-xl">
            <div class="mx-auto px-4">
              <div class="flex justify-between items-center py-6">
                <div class="flex justify-start">
                  <h1 class="font-extrabold">Hacker News</h1>
                </div>
                <div class="items-center justify-end">
                  <a href="#/page/@{prevPage}" class="text-gray-500">
                    Previous
                  </a>
                  <a href="#/page/@{nextPage}" class="text-gray-500 ml-4">
                    Next
                  </a>
                </div>
              </div> 
            </div>
          </div>료
          <div class="p-4 text-2xl text-gray-700">
            @{newsFeed}        
          </div>
        </div>
    `;

    for (
        let i=(store.currentPage- 1 ) * 10;
        i<((store.currentPage * 10) >= newsFeed.length ? newsFeed.length : store.currentPage * 10);
        i++) {
        newsList.push(`
      <div class="p-6 ${newsFeed[i].read ? 'bg-red-500' : 'bg-white'} mt-6 rounded-lg shadow-md transition-colors duration-500 hover:bg-green-100">
        <div class="flex">
          <div class="flex-auto">
            <a href="#/show/${newsFeed[i].id}">${newsFeed[i].title}</a>  
          </div>
          <div class="text-center text-sm">
            <div class="w-10 text-white bg-green-300 rounded-lg px-0 py-2">${newsFeed[i].comments_count}</div>
          </div>
        </div>
        <div class="flex mt-3">
          <div class="grid grid-cols-3 text-sm text-gray-500">
            <div><i class="fas fa-user mr-1"></i>${newsFeed[i].user}</div>
            <div><i class="fas fa-heart mr-1"></i>${newsFeed[i].points}</div>
            <div><i class="far fa-clock mr-1"></i>${newsFeed[i].time_ago}</div>
          </div>  
        </div>
      </div>
    `);
    }

    template = template.replace(
        '@{newsFeed}',
        newsList.join(''));
    template = template.replace(
        '@{prevPage}',
        store.currentPage > 1 ? store.currentPage -1 : 1);
    template = template.replace(
        '@{nextPage}',
        store.currentPage * 10 >= newsFeed.length ? store.currentPage : store.currentPage + 1);
    container.innerHTML = template;
}

function newsDetail() {
    const id = location.hash.substr(location.hash.lastIndexOf('/')+1);
    const newsContents = getData(contentsUrl.replace('@{id}', id));
    let template = `
    <div class="bg-gray-600 min-h-screen pb-8">
      <div class="bg-white text-xl">
        <div class="mx-auto px-4">
          <div class="flex justify-between items-center py-6">
            <div class="flex justify-start">
              <h1 class="font-extrabold">Hacker News</h1>
            </div>
            <div class="items-center justify-end">
              <a href="#/page/${store.currentPage}" class="text-gray-500">
                <i class="fa fa-times"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="h-full border rounded-xl bg-white m-6 p-4 ">
        <h2>${newsContents.title}</h2>
        <div class="text-gray-400 h-20">
          ${newsContents.content}
        </div>
        @{comments}
      </div>
    </div>
    `;

    function makeComments(comments, called=0) {
        const commentString = [];

        for (let i = 0; i < comments.length; i++) {
            commentString.push(`
                <div style="padding-left: ${called * 40}px;" class="mt-4">
                  <div class="text-gray-400">
                    <i class="fa fa-sort-up mr-2"></i>
                    <strong>${comments[i].user}</strong> ${comments[i].time_ago}
                  </div>
                  <p class="text-gray-700">${comments[i].content}</p>
                </div>
            `);

            if (comments[i].comments.length > 0) {
                commentString.push(makeComments(comments[i].comments, called+1));
            }
        }

        return commentString.join('');
    }

    container.innerHTML = template.replace('@{comments}', makeComments(newsContents.comments));
}

function router() {
    const routePath = location.hash; // location.hash에 '#'만 들어있는 경우에는 빈값 반환
    if (routePath === '') {
        newsFeed();
    } else if (routePath.indexOf('#/page/')>=0) {
        store.currentPage = Number(routePath.substr(routePath.lastIndexOf('/')+1));
        newsFeed();
    } else if (routePath.indexOf('#/show/')>=0) {
        newsDetail();
    }
}

window.addEventListener('hashchange', router);

router();