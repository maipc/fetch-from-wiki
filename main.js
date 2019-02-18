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
            output.innerHTML='';
            suggest.innerHTML='';
            var item = null;
            for(var i=0; i<5; i++) {
                item = document.createElement('li');
                item.id = 'list';
                item.innerHTML += data[1][i];
                suggest.appendChild(item);
            }
            const select = suggest.querySelectorAll('#list');
            select.forEach(function(n, index){
                n.addEventListener('click', function(e) {
                    const endpoint = encodeURI(`https://en.wikipedia.org/w/api.php?action=query&prop=extracts|pageimages&piprop=original&format=json&exintro=&origin=*&titles=${data[1][index]}`);
                    fetch(`${endpoint}`)
                    .then(res => res.json())
                    .then(context => {
                        var item_id = Object.keys(context.query.pages)[0];
                        var content = context.query.pages[item_id].extract;
                        if(content === "") {
                            output.innerHTML = "<p>undefined</p>";
                        } else {
                            if(Object.keys(context.query.pages[item_id]).length > 4) {
                                var src = context.query.pages[item_id].original.source;
                                var width = context.query.pages[item_id].original.width;
                                if(width > 200) width /=10;
                                var height = context.query.pages[item_id].original.height;
                                if(height > 200) height /= 10;
                                output.innerHTML = "<img src=\"" + src + "\" width=\"" + width + "\" height=\"" + height + "\">";
                                output.innerHTML += content;
                            } else {
                                output.innerHTML = content;
                            }
                        }
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