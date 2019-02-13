import debounce from 'lodash-cli';

const text = document.querySelector('.search');
const url = "https://en.wikipedia.org/w/api.php?action=opensearch&limit=5&format=json&origin=*"
var suggest = document.querySelector('.suggest');
var output = document.querySelector('.output');
var _ = require('lodash');

text.oninput =  _.debounce(getData, 250);

function getData() {
    var query = text.value;
    fetch(`${url}&search=${query}`)
    .then(response => response.json())
    .then(data => {
        if(data[1]) {
            console.log(data);
            output.innerHTML='';
            suggest.innerHTML='';
            var item = null;
            for(var i=0; i<6; i++) {
                item = document.createElement('li');
                if(i!==0) {
                    item.id = 'list';
                    item.innerHTML = data[1][i-1];
                }
                if(i===0) item.innerHTML = '----------您要搜尋的是----------';
                suggest.appendChild(item);
            }
            const select = suggest.querySelectorAll('#list');
            select.forEach(function(n, index){
                n.addEventListener('click', function(e) {
                    const endpoint = encodeURI(`https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=&origin=*&titles=${data[1][index]}`);
                    fetch(`${endpoint}`)
                    .then(res => res.json())
                    .then(context => {
                        var item_id = Object.keys(context.query.pages)[0];
                        if(context.query.pages[item_id].extract !== "")
                            output.innerHTML=context.query.pages[item_id].extract;
                        else
                        output.innerHTML="<p>There's no context !</p>";
                    })
                })
            })
        }
        else {
            output.innerHTML='';
            suggest.innerHTML='';
        }
    })
  . catch(err => console.log(err))
}