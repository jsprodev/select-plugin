let itemsArray = [];
// count: when a request is made , every time options are generated dynamically counter has to incremented likewise
let count = 0;

// associate your plugin with jquery so that it can be initialized with it
jQuery.fn.myPlugin = function(className) {

    // get the select element and its parent
    let select = document.querySelector('.' + className);
    let parent = select.parentElement;
    // assign name attribute to select
    select.name = 'sp';
    select.classList.add('hide');

    if (className === 'singleSelect') {
        // create input span 
        let searchSpan = document.createElement('span');
        searchSpan.className = 'search-span';
        // create input to search the items
        let searchInput = document.createElement('input');
        searchInput.className = 'search-input';
        searchInput.placeholder = 'Type atleast 3 characters';
        // append the input to input span
        searchSpan.appendChild(searchInput);
        parent.appendChild(searchSpan);
        // search function onkeypress
        searchOnKeyPress('search-input', parent, className);
    } else {
        // create span which will have seached chips in it
        select.multiple = true;
        let chipSpan = document.createElement('span');
        chipSpan.classList.add('search-input');
        chipSpan.style = 'display: inline-block';
        // create input span
        let searchSpan = document.createElement('span');
        searchSpan.className = 'search-span';
        searchSpan.style = 'line-height: 29px';
        // create input to search
        let searchInput = document.createElement('input');
        searchInput.className = 'tags-input';
        searchInput.placeholder = 'Type atleast 3 characters';
        // append search input in seaarch span
        searchSpan.appendChild(searchInput);
        // append search span in chip span
        chipSpan.appendChild(searchSpan);
        // append chip span in parent element
        parent.appendChild(chipSpan);
        // search function onkeypress
        searchOnKeyPress('tags-input', parent, className);
    }
}

function searchOnKeyPress(inputClassName, parent, selectClassName) {
    let xhr = null;
    let input, res, items, increment = 0;
    let itemsSpan = document.createElement('span');
    itemsSpan.id = 'itemsSpan';
    let ul = document.createElement('ul');
    ul.id = 'items';
    document.querySelector('.' + inputClassName).addEventListener('keyup', function(event) {
        input = document.querySelector('.' + inputClassName);
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
                    // for every request in singleSelect remove all the options
                    let select = document.querySelector('.' + selectClassName);
                    if (selectClassName === 'singleSelect') {
                        for (let i = select.options.length - 1; i >= 0; i --) {
                            console.log(select.options[i] + ' i am fired ');
                            select.options[i] = null;
                        }
                    }
                    for (let i  = 0; i < res.length; i ++) {
                        // console.log(res[i].name); // debugging
                        // create options for hidden select
                        let opt = document.createElement('option');
                        opt.value = res[i].name;
                        opt.innerHTML = res[i].name;
                        select.appendChild(opt);
                        // create li's of response recieved 
                        items = document.createElement('li');
                        items.innerHTML = res[i].name;
                        ul.appendChild(items);
                        itemsSpan.appendChild(ul);
                        parent.appendChild(itemsSpan);
                        input.classList.add('search-input-0-border-radius');
                        // change input value to selected upon click
                        selectElement(input, ul, items, i, selectClassName);
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

function selectElement(input, ul, items, index, selectClassName) {
    document.querySelector('#' + 'items').children[index].addEventListener('click', function() {
        // get the select element
        let select = document.querySelector('.' + selectClassName);
        // if multiselect
        if (selectClassName === 'multiSelect') {
            // get parent element
            let parent = (input.parentElement).parentElement;
            // create chip span
            let chip = document.createElement('span');
            chip.classList.add('chip');
            // assign value of selected item to chip , and check for uniqueness
            if (itemsArray.indexOf(this.innerHTML) === -1) {
                itemsArray.push(this.innerHTML);
                chip.innerText = this.innerHTML;
                // add selected attribute to selected option
                let option = select.options[index + count];
                option.setAttribute('selected', true);
                 // create close button for chip
                let closeBtn = document.createElement('span');
                closeBtn.classList.add('close-btn');
                closeBtn.innerHTML = '&times';
                // append close button to chip
                chip.appendChild(closeBtn);
                // append chip to parent 
                parent.appendChild(chip);
                // change the input to placeholder text
                input.value = '';
                input.placeholder = 'Type atleast 3 characters';
                // console.log(itemsArray);
            }
            // eventlistener for close button of chip
            let closeBtns = document.querySelectorAll('.close-btn');
            for (let i = 0; i < closeBtns.length; i ++) {
                closeBtns[i].addEventListener('click', function() {
                    this.parentElement.style.display = 'none';
                });
            }
            // remove the rest of options which are not selected
            let length = select.options.length;
            for (let i = length-1; i >= count; i --) {
                if (select.options[i].selected == false) {
                    select.options[i] = null;
                }
            }
            count ++;
        } else { 
            input.value = this.innerText;
            let option = select.options[index];
            option.setAttribute('selected', true);
            // remove the rest of options which are not selected
            for (let i = select.options.length - 1; i >= count; i --) {
                if (select.options[i].selected == false) {
                    select.options[i] = null;
                }
            }
        }
        ul.remove();
        input.classList.remove('search-input-0-border-radius');
    });
}