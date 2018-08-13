jQuery.fn.myPlugin = function(className) {

    let xhr = null;

    // get the select element and its parent
    let select = document.querySelector('.' + className);
    let parent = select.parentElement;
    select.classList.add('hide');

    // create input to search the items
    let searchSpan = document.createElement('span');
    searchSpan.id = 'searchSpan';
    let input = document.createElement('input');
    input.id = 'searchInput';
    input.placeholder = 'Search: Type atleast 3 characters';
    searchSpan.appendChild(input);
    parent.appendChild(searchSpan);

    let itemsSpan = document.createElement('span');
    itemsSpan.id = 'itemsSpan';
    let ul = document.createElement('ul');
    ul.id = 'items';

    // search function onkeypress
    document.getElementById('searchInput').addEventListener('keyup', function() {
        let input, res;
        input = document.getElementById('searchInput');
        if (input.value.length == 0) {
            ul.remove();
            input.classList.remove('search-input-0-border-radius');
        }
        if (input.value.length >= 3) {
            if(xhr != null) {
                xhr.abort();
            }
            ul.innerHTML = '';
            xhr = new XMLHttpRequest();
            xhr.onload = function () {
                if (xhr.status >= 200 && xhr.status < 400) {
                    res = JSON.parse(xhr.responseText);
                }
                // make li's of search results
                if (res != null) {
                    for (let i  = 0; i < res.length; i++) {
                        console.log(res[i].name); // debugging 
                        let items = document.createElement('li');
                        items.innerHTML = res[i].name;
                        ul.appendChild(items);
                        itemsSpan.appendChild(ul);
                        parent.appendChild(itemsSpan);
                        input.classList.add('search-input-0-border-radius');
                        // change input value to selected upon click
                        document.querySelector('#items').children[i].addEventListener('click', function() {
                            input.value = this.innerText;
                        });
                    }
                } else {
                    let noResultsFound = document.createElement('li');
                    noResultsFound.innerHTML = 'no results found';
                    ul.appendChild(noResultsFound);
                    itemsSpan.appendChild(ul);
                    parent.appendChild(itemsSpan);
                    input.classList.add('search-input-0-border-radius');
                }
            }
            xhr.open('GET', 'https://restcountries.eu/rest/v2/name/' + input.value , true);
            xhr.send();
        }        
    });

}

 // convert select options to li items
    // let itemsSpan = document.createElement('span');
    // itemsSpan.id = 'itemsSpan';
    // let ul = document.createElement('ul');
    // ul.id = 'items';
    // for(let i = 0; i < select.length; i++) {
    //     let items = document.createElement('li');
    //     items.innerHTML = select[i].innerText;
    //     ul.appendChild(items);
    // }
    // parent.removeChild(select);
    // itemsSpan.appendChild(ul);
    // parent.appendChild(itemsSpan);

    // // hide the li items span by default
    // ul.classList.add('hide');

// initializePlugin();

    // ul = document.querySelector('#items')
    // items = ul.getElementsByTagName('li');
    // for (var i = 0; i < items.length; i++) {
    //     if (items[i].innerText.toLowerCase().indexOf(input.value.toLowerCase()) > -1) {
    //         document.querySelector('#items').classList.remove('hide');
    //         document.querySelector('#items').children[i].style.display = ''
    //         // change input value to selected upon click
    //         document.querySelector('#items').children[i].addEventListener('click', function() {
    //             input.value = this.innerText;
    //         });
    //     } else {
    //         document.querySelector('#items').children[i].style.display = 'none';    
    //     }
    // }