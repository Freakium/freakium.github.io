const init = (function() {
    const nameModal = new bootstrap.Modal('#namePreview');      // modal reference
    const NAME_LIST_COUNT = 24;                                 // Number of names to generate
    const LONG_NAME_CHANCE = 0.8;                               // chance of generating longer name
    const NOUN_CHANCE = 0.8;                                    // chance of using noun for primary ship name
    const VERB_CHANCE = 0.5;                                    // chance of using verb for primary ship name
    const TIMEOUT_DURATION = 3000;                              // show message time in milliseconds

    // GLOBAL FUNCTIONS
    ///////////////////////////////////////////////////////////////////////////////////////////
    
    // called by ship name buttons to open preview modal
    window.previewName = (id) => {
        let shipName = document.getElementById(id).innerHTML;
        decipherShipName(shipName);

        document.getElementById('namePreview').setAttribute('data-nameid', id);
        nameModal.show();
    }

    // NAME GENERATION
    ///////////////////////////////////////////////////////////////////////////////////////////

    // get word from a specific word group in the library of adjectives, nouns, verbs
    getWord = (group) => {
        let index = Math.floor(Math.random() * group.length);
        return group[index];
    }

    // grab a unique word that is not a repeat of given parameter
    getUniqueVerb = (shipName) => {
        let uniqueVerb = getWord(verbs);
        while(uniqueVerb === shipName) {
            uniqueVerb = getWord(verbs);
        }
        
        return uniqueVerb;
    }

    // Affix another word or preposition to the name
    generateLongName = (shipName) => {
        let randWord = Math.floor(Math.random() * 3);
        let fullShipName = "";

        switch(randWord) {
            // adjective
            case 1:
                fullShipName = `${getWord(adjectives)} ${shipName}`
                break;
            // verb
            case 2:
                fullShipName = `${shipName} ${getUniqueVerb(shipName)}`
                break;
            // noun
            default:
                let randPreposition = Math.floor(Math.random() * 3);
                let preposition = "";

                switch(randPreposition) {
                    case 1:
                        preposition = " and ";
                        break;
                    case 2:
                        preposition = " of "
                        break;
                    default:
                        preposition = " ";
                }

                // make sure there are no duplicates
                let affixName = getWord(nouns);
                while(affixName === shipName) {
                    affixName = getWord(nouns);
                }

                fullShipName = `${affixName}${preposition}${shipName}`;
        }

        return fullShipName;
    }

    // generate a list of ship names
    generateNames = () => {
        let shipNames = [];
        let i = 0;
        
        while(i<NAME_LIST_COUNT) {
            let shipName = "";

            if(Math.random() < LONG_NAME_CHANCE) {
                shipName = (Math.random() < NOUN_CHANCE) ? getWord(nouns) : getWord(verbs);
                shipName = generateLongName(shipName);
            }
            // include adjectives in singular ship name
            else {
                shipName = (Math.random() < NOUN_CHANCE)
                    ? getWord(nouns)
                    : (Math.random() < VERB_CHANCE)
                        ? getWord(verbs)
                        : getWord(adjectives);
            }
            
            // make sure there are no repeats
            const found = shipNames.find(el => el == shipName);
            if(!found) {
                shipNames.push(shipName);
                i++;
            }
        }
        
        displayNames(shipNames);
    }

    // Display names to nameList
    displayNames = (shipNames) => {
        let display = '';
        shipNames.map((shipName, index) => {
            display +=
                `<div class="col">
                    <button class="btn btn-name w-100 text-black fw-bold" id="name${index}" onclick="previewName(this.id);">${shipName}</button>
                </div>`;
        });

        document.getElementById('nameList').innerHTML = display;
    }

    // splits ship name into [Affix, Preposition, Primary] and displays it in the preview modal
    decipherShipName = (shipName) => {
        let names = shipName.split(' ');

        // add primary name
        document.getElementById('txtPrimary').value = names.pop();

        // add affix
        document.getElementById('txtAffix').value = names.length
            ? names.shift()
            : '';

        // add preposition
        document.getElementById('txtPreposition').value = names.length
            ? names.join(' ')
            : '';

        addAffix();
        addPreposition();
        addPrimary();
    }

    // USER INTERACTION
    ///////////////////////////////////////////////////////////////////////////////////////////

    // add prefix to ship name
    addPrefix = (e) => {
        let prefix = typeof e === 'undefined'
            ? document.getElementById('txtPrefix').value
            : e.target.value;

        document.getElementById('shipPrefix').innerHTML = prefix;
    }

    // clears the prefix input field
    clearPrefix = () => {
        document.getElementById('txtPrefix').value = "";
        addPrefix();
    }

    // add affix to ship name
    addAffix = (e) => {
        let affix = typeof e === 'undefined'
            ? document.getElementById('txtAffix').value
            : e.target.value;

        document.getElementById('shipAffix').innerHTML = affix;
        swapButtonHideCheck();
    }

    // add preposition to ship name
    addPreposition = (e) => {
        let preposition = typeof e === 'undefined'
            ? document.getElementById('txtPreposition').value
            : e.target.value;

        document.getElementById('shipPreposition').innerHTML = preposition;
    }

    // add primary ship name
    addPrimary = (e) => {
        let primary = typeof e === 'undefined'
            ? document.getElementById('txtPrimary').value
            : e.target.value;

        document.getElementById('shipPrimary').innerHTML = primary;
    }

    // clears the affix input field
    clearAffix = () => {
        document.getElementById('txtAffix').value = "";
        addAffix();
    }

    // clears the preposition input field
    clearPreposition = () => {
        document.getElementById('txtPreposition').value = "";
        addPreposition();
    }

    // clears the primary input field
    clearPrimary = () => {
        document.getElementById('txtPrimary').value = "";
        addPrimary();
    }

    // toggles hull and ship name colour
    toggleHullColour = (invert) => {
        let button = document.getElementById('btnInvert');
        let shipHull = document.getElementById('starshipHull');
        let shipName = document.getElementById('shipName');

        if(invert) {
            shipHull.style.backgroundImage = 'url("img/StarshipHull.jpg")';
            shipName.classList.add('text-black');
            button.removeAttribute('data-dark');
        }
        else {
            shipHull.style.backgroundImage = 'url("img/StarshipHullDark.jpg")';
            shipName.classList.remove('text-black');
            button.setAttribute('data-dark', true);
        }
    }

    // swaps the primary and affix ship names
    swapNamePosition = () => {
        let primary = document.getElementById('txtPrimary');
        let affix = document.getElementById('txtAffix');
        let newPrimary = affix.value;
        let newAffix = primary.value;
        
        primary.value = newPrimary;
        affix.value = newAffix;

        addAffix();
        addPrimary();
    }

    // copy the ship name to the clipboard
    copyNameToClipboard = () => {
        let fullName = document.getElementById('shipPrimary').innerHTML;
        let preposition = document.getElementById('shipPreposition').innerHTML;
        let affix = document.getElementById('shipAffix').innerHTML;
        let prefix = document.getElementById('shipPrefix').innerHTML;

        let wordList = [preposition, affix, prefix];
        wordList.map(word => (fullName = word !== '' ? `${word} ${fullName}` : fullName));

        // save using secure method
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(fullName.toLocaleUpperCase());
        }
        // save using 'I'm too poor for SSL' method
        else {
            let textBox = document.getElementById('txtCopy');
            textBox.value = fullName.toLocaleUpperCase();
            textBox.focus();
            textBox.select();
            document.execCommand('copy');
        }

        // display success message and disable button for set duration
        let copyBtn = document.getElementById('btnCopy');
        copyBtn.innerHTML = 'Name Copied!';
        copyBtn.setAttribute('disabled', true);
        setTimeout(() => {
            copyBtn.innerHTML = 'Copy';
            copyBtn.removeAttribute('disabled');
        }, TIMEOUT_DURATION);
    }

    // check whether or not to hide the swap button
    swapButtonHideCheck = () => {
        let swapBtn = document.getElementById('btnSwap');
        let affix = document.getElementById('shipAffix').innerHTML;

        affix
            ? swapBtn.classList.remove('d-none')
            : swapBtn.classList.add('d-none');
    }

    // highlights visited name in list
    highlightListName = () => {
        let id = document.getElementById('namePreview').dataset.nameid;
        document.getElementById(id).classList.add('btn-outline-name');
    }

    // INIT
    ///////////////////////////////////////////////////////////////////////////////////////////

    // listeners
    document.getElementById('generateBtn').addEventListener('click', generateNames);
    document.getElementById('txtPrefix').addEventListener('input', addPrefix);
    document.getElementById('clearPrefix').addEventListener('click', clearPrefix);
    document.getElementById('txtAffix').addEventListener('input', addAffix);
    document.getElementById('clearAffix').addEventListener('click', clearAffix);
    document.getElementById('txtPreposition').addEventListener('input', addPreposition);
    document.getElementById('clearPreposition').addEventListener('click', clearPreposition);
    document.getElementById('txtPrimary').addEventListener('input', addPrimary);
    document.getElementById('clearPrimary').addEventListener('click', clearPrimary);
    
    // toggle hull colour button
    const invertCheckbox = document.getElementById('btnInvert');
    invertCheckbox.addEventListener('click', () => {
        toggleHullColour(invertCheckbox.dataset.dark);
    });
    
    // swap name position button
    const swapPosition = document.getElementById('btnSwap');
    swapPosition.addEventListener('click', () => {
        swapNamePosition();
    });
    
    // copy name button
    const copyName = document.getElementById('btnCopy');
    copyName.addEventListener('click', () => {
        copyNameToClipboard();
    });

    // run on modal open
    let modalRef = document.getElementById('namePreview');
    modalRef.addEventListener('show.bs.modal', () => {
        addPrefix();
        swapButtonHideCheck();
    });

    // run on modal close
    modalRef.addEventListener('hide.bs.modal', () => {
        highlightListName();

        // save current changes to ship button
        let affix = document.getElementById('shipAffix').innerHTML;
        let preposition = document.getElementById('shipPreposition').innerHTML;
        preposition = preposition ? ` ${preposition} ` : ' ';
        let primary = document.getElementById('shipPrimary').innerHTML;

        let shipButtonId = document.getElementById('namePreview').getAttribute('data-nameid');
        document.getElementById(shipButtonId).innerHTML = `${affix}${preposition}${primary}`;
    });
    
    // initialize
    generateNames();
});
