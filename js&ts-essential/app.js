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
        <div class="container mx-auto p-4">
            <h1>Hacker News</h1>
            <ul>
                @{newsFeed}
            </ul>
            <div>
                <a href="#/page/@{prevPage}">이전 페이지</a>
                <a href="#/page/@{nextPage}">다음 페이지</a>
            </div>
        </div>
    `;

    for (
        let i=(store.currentPage- 1 ) * 10;
        i<((store.currentPage * 10) >= newsFeed.length ? newsFeed.length : store.currentPage * 10);
        i++) {
        newsList.push(`
        <li>
            <a href="#/show/${newsFeed[i].id}">
                ${newsFeed[i].title} (${newsFeed[i].comments_count})
            </a>
        </li>
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
    container.innerHTML = `
    <h1>${newsContents.title}</h1>
    <div>
        <a href="#/page/${store.currentPage}">목록으로</a>
    </div>
`
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