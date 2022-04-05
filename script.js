const container=document.querySelector('.container')
const intro=document.querySelector('.intro');
const introText='WELCOME TO YOUR LITTLE LIBRARY'.split('');

const bookCardsContainer=document.querySelector('.bookCardsContainer');

const addBookSection=document.querySelector('.container > div:nth-child(2)');
const showAddBookSection=document.querySelector('.menuIcon')
const backIcon=document.querySelector('.iconContainer')

const confirmedDeleteContainer=document.querySelector('.confirmDeleteContainer');
const confirmedText=document.querySelector('.confirmDeleteContainer>div:first-child');
const finalDeleteBtn=document.querySelector('.confirm');
const canceledDelete=document.querySelector('.cancel')
let deleteCardObj;

for(let i=0;i<introText.length;i++){
    const text=document.createElement('span');
    text.className='text';
    text.append(introText[i]);
    intro.append(text)
    text.style.left=`-${document.body.offsetWidth}px`
    setTimeout(()=>{
        text.style.left='0';   
    },100*(i+1))
    if(i==introText.length-1){
        text.addEventListener('transitionend',()=>{
            setTimeout(()=>{
                intro.style.opacity=0;
                setTimeout(()=>{
                    intro.style.display='none';
                    if(document.body.offsetWidth<=600){
                        container.style.gridTemplateColumns='1fr';
                    }else{
                        container.style.gridTemplateColumns='minmax(300px,1fr) 3fr';
                        addBookSection.style.display='flex'
                    }
                    
                    bookCardsContainer.style.display='grid'
                    confirmedDeleteContainer.style.top=`-${bookCardsContainer.offsetHeight}px`;
                },500)
            },2000)
            
        })
    }
}

// library
const myLibrary=JSON.parse(localStorage.getItem('library')) || [];
myLibrary.forEach((bookObj)=>{
    createBookInfoCard(bookObj);
})



function createBookInfoCard(obj){
    const container=document.createElement('div');
    container.classList='bookCard';
    container.id=obj.title;
    if(obj.hasRead){
        container.style.border='solid 1px rgb(0, 255, 0)'
    }

    const deleteBtn=document.createElement('img');
    deleteBtn.classList='deleteBtn';
    deleteBtn.src='cross.svg';
    deleteBtn.alt='Delete';
    deleteBtn.addEventListener('click',()=>{
        confirmedText.textContent=`Do you want to delete '${obj.title}' ?`
        confirmedDeleteContainer.style.top=`${container.offsetTop}px`;
        confirmedDeleteContainer.style.left=`${container.offsetLeft}px`;
        confirmedDeleteContainer.style.width=`${container.offsetWidth}px`;
        deleteCardObj=obj
    })

    const title=document.createElement('div');
    title.classList='titleInCard';
    title.textContent=obj.title;

    const author=document.createElement('div');
    author.classList='authorInCard';
    author.textContent=obj.author;

    let previousNumber=obj.currentPage; // to be used with switch when switch is one and off again
    const currentPage=document.createElement('input');
    currentPage.classList='noDefault currentPage';
    currentPage.type='text';
    currentPage.placeholder=obj.currentPage
    currentPage.addEventListener('input',()=>{
        if(currentPage.value.length<1){
            // just to stop error from second condition
        }else if(!currentPage.value[currentPage.value.length-1].match(/[0-9]/)){
            currentPage.value=currentPage.value.slice(0,currentPage.value.length-1);
            return
        }else if(+currentPage.value>+obj.totalPages){
            currentPage.value=obj.totalPages;
        }
        if(currentPage.value==obj.totalPages){
            switchBtn.checked=true;
            container.style.border='solid 1px rgb(0, 255, 0)';
        }else{
            container.style.border='none';
            switchBtn.checked=false;
        }
        pageNumber.textContent=currentPage.value ;
        previousNumber=currentPage.value ;
        // change the current page value of obj
        obj.currentPage=currentPage.value;
        // save every input changes in local storage
        localStorage.setItem('library',JSON.stringify(myLibrary))
    })

    const pageNumber=document.createElement('span')
    pageNumber.textContent=obj.currentPage;

    const page=document.createElement('div');
    page.classList='pagesInfoInCard';
    page.append(pageNumber,currentPage,` / ${obj.totalPages} ${obj.totalPages<=1?'page':'pages'}`)
    
    const switchBtn=document.createElement('input');
    switchBtn.type='checkbox';
    switchBtn.id='checkedAlreadyRead';
    switchBtn.classList='noDefault';
    switchBtn.disabled=true; // disable the input unless it is in editing mode
    switchBtn.checked=obj.hasRead;
    switchBtn.addEventListener('input',()=>{
        if(switchBtn.checked){
            currentPage.value=obj.totalPages;
            pageNumber.textContent=obj.totalPages;
            container.style.border='solid 1px rgb(0, 255, 0)'
        }else{
            currentPage.value=previousNumber;
            pageNumber.value=previousNumber;
            container.style.border='none'
        }
        obj.currentPage=currentPage.value;
        obj.hasRead=switchBtn.checked;
        localStorage.setItem('library',JSON.stringify(myLibrary))
    })

    const editBtn=document.createElement('button');
    editBtn.classList='editBtn buttonInCard';
    editBtn.type='button';
    editBtn.textContent='Edit';
    
    const confirmEditBtn=document.createElement('button');
    confirmEditBtn.classList='confirmEditBtn buttonInCard';
    confirmEditBtn.type='button';
    confirmEditBtn.textContent='Confirm';

    editBtn.addEventListener('click',()=>{
        switchBtn.disabled=false;
        currentPage.style.display='inline-block';
        pageNumber.style.display='none'
        editBtn.style.display='none';
        confirmEditBtn.style.display='inline-block';
    })

    confirmEditBtn.addEventListener('click',()=>{
        switchBtn.disabled=true;
        currentPage.style.display='none';
        pageNumber.style.display='inline-block';
        confirmEditBtn.style.display='none';
        editBtn.style.display='inline-block';
    })
    container.append(deleteBtn,title,author,page,switchBtn,editBtn,confirmEditBtn)
    bookCardsContainer.append(container)
}

finalDeleteBtn.addEventListener('click',()=>{
    // search through the list of cards and delete the card
    document.querySelectorAll('.bookCard').forEach((card)=>{
        if(deleteCardObj.title==card.id){
            card.remove()
        }
    })
    const indexOfObj=myLibrary.findIndex((obj)=>{
                        return JSON.stringify(obj)==JSON.stringify(deleteCardObj)
                    })
    // remove from library
    myLibrary.splice(indexOfObj,1)
    localStorage.setItem('library',JSON.stringify(myLibrary))
    
    // remove the confirm div after delete
    confirmedDeleteContainer.style.top=`-${document.body.offsetHeight}px`
})
canceledDelete.addEventListener('click',()=>{
    // canceling the delete remove the confirm div
    confirmedDeleteContainer.style.top=`-${document.body.offsetHeight}px`
})

showAddBookSection.addEventListener('click',()=>{
    if(getComputedStyle(addBookSection).display=='none'){
        addBookSection.style.display='flex'
        container.style.gridTemplateColumns=document.body.offsetWidth>=600?'minmax(300px,1fr) 3fr':'1fr';
    }else{
        addBookSection.style.display='none'
        container.style.gridTemplateColumns='1fr';
    }
})

backIcon.addEventListener('click',()=>{
    addBookSection.style.display='none'
    container.style.gridTemplateColumns='1fr';
})


// inputs
const inputs=document.querySelectorAll('input');
const title=document.querySelector('#title');
const author=document.querySelector('#author');
const totalPages=document.querySelector('#totalPages');
const hasRead=document.querySelector('#checkedAlreadyRead');

const errorMessage=document.querySelector('.errorDisplay');

const pageRangeContainer=document.querySelector('.pageRangeContainer');
const pageNumberRange=document.querySelector('#alreadyReadPage')
const numberOFPageThatHasRead=document.querySelector('.numberOFPageThatHasRead');

// button to add book in library
const addBtn=document.querySelector('form>div:last-child>button');

totalPages.addEventListener('input',()=>{
    if(totalPages.value.length==0) {
        numberOFPageThatHasRead.value=`0`
        pageNumberRange.max=0;
        pageNumberRange.value=0;
        return;
    }
    if(!totalPages.value[totalPages.value.length-1].match(/[0-9]+/)){
        totalPages.value=totalPages.value.slice(0,totalPages.value.length-1)
    }else{
        pageNumberRange.max=totalPages.value;
        if(pageNumberRange.value>=totalPages.value){
            numberOFPageThatHasRead.value=`${totalPages.value}`;
            pageNumberRange.value=totalPages.value;
        }
    }
    pageNumberRange.max=totalPages.value;   
    isThatAlreadyRead()
})
pageNumberRange.addEventListener('input',()=>{
    if(totalPages.value.length==0){
        pageNumberRange.max=0
    }
    numberOFPageThatHasRead.value=`${pageNumberRange.value}`;
})

hasRead.addEventListener('input',isThatAlreadyRead)

function isThatAlreadyRead(){
    if(hasRead.checked){
        pageRangeContainer.style.display='none'
        numberOFPageThatHasRead.value=totalPages.value;
    }else{
        pageRangeContainer.style.display='flex'
    }
}

numberOFPageThatHasRead.addEventListener('input',()=>{
    if(numberOFPageThatHasRead.value.length==0){
        return;
    }else if(!numberOFPageThatHasRead.value[numberOFPageThatHasRead.value.length-1].match(/[0-9]+/)){
        numberOFPageThatHasRead.value=numberOFPageThatHasRead.value.slice(0,numberOFPageThatHasRead.value.length-1)
    }else if(+numberOFPageThatHasRead.value>+totalPages.value){
        numberOFPageThatHasRead.value=totalPages.value;

    }
    pageNumberRange.value=numberOFPageThatHasRead.value
})

// window refresh and resize for responsive design

window.addEventListener('resize',()=>{
    if(document.body.offsetWidth<=600){
        container.style.gridTemplateColumns='1fr';
    }else if(document.body.offsetWidth>=600 && getComputedStyle(addBookSection).display=='flex'){
        container.style.gridTemplateColumns='minmax(300px,1fr) 3fr';
    }
    confirmedDeleteContainer.style.top=`-${document.body.offsetHeight+addBookSection.offsetHeight}px`

})

window.addEventListener('load',()=>{
    // totalPages.value=0
    pageNumberRange.max=totalPages.value;
    isThatAlreadyRead()
    inputs.forEach((input)=>{
        input.value=''
    })
})



// the constructor
function Book(author,title,totalPages,hasRead,currentPage){
    this.author=author;
    this.title=title;
    this.totalPages=totalPages;
    this.hasRead=hasRead;
    this.currentPage=currentPage;
}

let isEveryInputValid;
addBtn.addEventListener('click',()=>{
    isEveryInputValid=true; 
    inputs.forEach((input)=>{
        if(!input.validity.valid){
            input.style.border='solid 2px #d90429';
            isEveryInputValid=false;
        }else{
            input.style.border='none';
            errorMessage.style.display='none';
            if(input=title && myLibrary.some((obj)=>{
                return obj.title.toUpperCase()==title.value.toUpperCase();
            })){
                title.style.border='solid 2px #d90429';
                errorMessage.style.display='inline';
                isEveryInputValid=false;
            }
        }
        
    })
    if(isEveryInputValid){
        
        myLibrary.push(new Book(author.value,
                                title.value,
                                totalPages.value,
                                numberOFPageThatHasRead.value==totalPages.value?true:hasRead.checked,
                                numberOFPageThatHasRead.value))
        
        // store in local storage
        localStorage.setItem('library',JSON.stringify(myLibrary));

        //create card
        createBookInfoCard(myLibrary[myLibrary.length-1])

        // clear the data in input after creating cards
        inputs.forEach((input)=>{
            input.value=''
        })
        // reset the switch
        hasRead.checked=false
        pageRangeContainer.style.display='flex'
    }
})