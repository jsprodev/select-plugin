jQuery.fn.myPlugin = function(className) {

    if (className === 'singleSelect') {
        singleSelect('singleSelect');
    } else {
        console.log(`Initilize your select with class named 'myPlugin'`);
    }



function singleSelect(className) {

    // get the select element and its parent
    let select = document.querySelector('.' + className);
    let parent = select.parentElement;
    select.classList.add('hide');

    // create input to search the items
    let searchSpan = document.createElement('span');
    searchSpan.className = 'searchSpan';
    let searchInput = document.createElement('input');
    searchInput.className = 'search-input';
    searchInput.placeholder = 'Search: Type atleast 3 characters';
    searchSpan.appendChild(searchInput);
    parent.appendChild(searchSpan);

    // search function onkeypress
    searchOnKeyPress('search-input');
}

function searchOnKeyPress(className) {
    let xhr = null;
    
    console.log(searchInput);

    let input, res, items, increment = 0;

    let itemsSpan = document.createElement('span');
    itemsSpan.id = 'itemsSpan';
    let ul = document.createElement('ul');
    ul.id = 'items';

    document.querySelector('.' + className).addEventListener('keyup', function(event) {
        input = document.querySelector('.' + className);

        if (input.value.length == 0) {
            ul.remove();
            input.classList.remove('search-input-0-border-radius');
        }

        // bypass xhr on left and right arrow key press
        if (event.key == 'ArrowLeft' || event.key == 'ArrowRight' || event.key == 'ArrowUp' || event.key == 'ArrowDown') {
            return false;
        }

        if (input.value.length >= 3) {
            if (xhr != null) {
                xhr.abort();
                console.log('abort is fired');
            }

            ul.innerHTML = '';
            xhr = new XMLHttpRequest();

            xhr.onload = function () {
                if (xhr.status >= 200 && xhr.status < 400) {
                    res = JSON.parse(xhr.responseText);
                }
                // make li's of search results
                if (res != null) {
                    for (let i  = 0; i < res.length; i ++) {
                        console.log(res[i].name); // debugging 
                        items = document.createElement('li');
                        items.innerHTML = res[i].name;
                        ul.appendChild(items);
                        itemsSpan.appendChild(ul);
                        parent.appendChild(itemsSpan);
                        input.classList.add('search-input-0-border-radius');
                        // change input value to selected upon click
                        document.querySelector('#items').children[i].addEventListener('click', function() {
                            input.value = this.innerText;
                            ul.remove();
                            input.classList.remove('search-input-0-border-radius');
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


}

        // hover items on arrow down and arrow up
        // if (event.key == 'ArrowUp' || event.key == 'ArrowDown') {
        //     console.log('ArrowUp or ArrowDown is fired');
        //     let itemsLength  = ul.children.length;

        //     if (ul.children.length > 0) {
        //         if (increment == 0) {
        //             console.log('if is fired ' + increment + ' , ' + itemsLength);
        //             ul.children[increment].style.backgroundColor = '#5AC8FA';
        //             ul.children[increment].style.color = 'white';
        //             increment ++;
        //         } else if (increment > 0 && increment < itemsLength) {
        //             console.log('else if is fired ' + increment + ' , ' + itemsLength);
        //             ul.children[increment - 1].style.backgroundColor = 'white';
        //             ul.children[increment - 1].style.color = 'black';
        //             ul.children[increment].style.backgroundColor = '#5AC8FA';
        //             ul.children[increment].style.color = 'white';
        //             increment ++;
        //         } else {
        //             console.log('else is fired ' + increment + ' , ' + itemsLength);
        //             ul.children[increment - 1].style.backgroundColor = 'white';
        //             ul.children[increment - 1].style.color = 'black';
        //             increment = 0;
        //             return false;
        //         }
        //     }
        //     return false;
        // }


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