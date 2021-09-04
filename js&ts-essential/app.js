const ajax = new XMLHttpRequest(); // let은 변수
// let ajax = new XMLHttpRequest(); // const는 불변 즉, 상수
const newURL = 'https://api.hnpwa.com/v0/news/1.json';

ajax.open('GET', newURL, false);
ajax.send();

const newsFeed = JSON.parse(ajax.response);
const ul = document.createElement('ul');

for (const newsFeedElement of newsFeed) {
    const li = document.createElement('li');
    const a = document.createElement('a');

    a.href = '#';
    a.innerHTML = `${newsFeedElement.title} (${newsFeedElement.comments_count})`;

    li.appendChild(a);
    ul.appendChild(li);
}

document.getElementById('root').appendChild(ul);