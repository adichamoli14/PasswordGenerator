//custom attribute -> '[ ]'
const inputSlider = document.querySelector('[data-lengthSlider]');
const lengthDisplay = document.querySelector('[data-lengthNumber]');
const passwordDisplay = document.querySelector('[data-passwordDisplay]');
const copyBtn = document.querySelector('[data-copy]');
const copyMsg = document.querySelector('[data-copyMsg]');
const uppercaseCheck = document.getElementById('uppercase');
const lowercaseCheck = document.getElementById('lowercase');
const numbersCheck = document.getElementById('numbers');
const symbolsCheck = document.getElementById('symbols');
const indicator = document.querySelector('[data-indicator]');
const generation = document.querySelector('.generateButton');
const allCheckBox = document.querySelectorAll('input[type=checkbox]');
const symbols = '`~!@#$%^&*()_-+=[}]}|;:",./<>?';

let password="";
let passwordLength=10;
let checkCount=0;
handleSlider();
//set circle colour to grey
setIndicator('#ccc');


//function to handle slider -> eske according password ki length ko set krr dega
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength-min)*100/(max-min)) + "% 100%";
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}` ;
}

function getRndInteger(min, max){
    
    return Math.floor(Math.random() * (max-min)) + min;
}

function generateRandomNumber(){
    return getRndInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}

function generateUpperCase(){
    //String.fromCharCode ascii to alphabets mei channge krr deta hai
    return String.fromCharCode(getRndInteger(65,91));
}

function generateSymbol(){
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper=true;
    if (lowercaseCheck.checked) hasLower=true;
    if (numbersCheck.checked) hasNum=true;
    if (symbolsCheck.checked) hasSym=true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength>8){
        setIndicator('#0f0');
    }
    else if((hasUpper || hasLower) && (hasNum || hasSym) && passwordLength>6){
        setIndicator('#ff0');
    }
    else{
        setIndicator('#f00');
    }
};

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = 'copied';
    }
    catch(e){
        copyMsg.innerText ='failed';
    }
    //to make copy wala span visible
    copyMsg.classList.add("active");

    setTimeout(() =>{
        copyMsg.classList.remove("active");
    },2000);
};

function handleCheckBoxChange(){
    checkCount=0;
    allCheckBox.forEach((checkbox) => {
        if(checkbox.checked)
            checkCount++;
    });
    //special condition
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
};

allCheckBox.forEach ((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
});


inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
});

copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value){
        copyContent();
    }
});

//fisher yates method
function shufflePassword(array){
    for(let i= array.length -1; i>0; i--){
        const j = Math.floor(Math.random() * (i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}


generation.addEventListener('click', () => {
    // if koi bhi checkbox selected nhi hai
    if(checkCount<=0)
        return;

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

//-------New password creation----------

    //remove old password
    password="";

    let funArr =[];

    if(uppercaseCheck.checked)
        funArr.push(generateUpperCase);

    if(lowercaseCheck.checked)
        funArr.push(generateLowerCase);

    if(numbersCheck.checked)
        funArr.push(generateRandomNumber);

    if(symbolsCheck.checked)
        funArr.push(generateSymbol);


    //selected checkboxes ki chije include
    for(let i=0; i<funArr.length; i++){
        password += funArr[i]();
    }

    //remaining addition
    for(let i=0; i<passwordLength-funArr.length; i++){
        let randIndex = getRndInteger(0,funArr.length);
        password += funArr[randIndex]();
    }

    //shuffle the password , password ka array bna k pass kiya hai
    password = shufflePassword(Array.from(password));

    //password disp
    passwordDisplay.value = password;

    //calc strength
    calcStrength();



});

