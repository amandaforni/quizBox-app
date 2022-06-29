/*global $ */

var userAuth;

async function loginUser(userData) {
    try {
        const response = await fetch ('http://localhost:5000/login', {
            method: 'post',
            body: JSON.stringify(userData),
            headers: {'Content-Type': 'application/json'}
        });
        const data = await response.json();

        if (data.auth) {
            userAuth = data.auth;
        } else {
            $('.login-error').text('Username or password is incorrect');
            $('.login-box input').css('border','1px solid red');
            setTimeout(() => {
                $('.login-error').text('');
                $('.login-box input').css('border','');
            }, 5000);
            return;
        }
        window.location.replace(window.location.href.substr(0, (window.location.href.lastIndexOf("/"))) + "/landing.html?auth=" + userAuth);
    }
    catch (err) {
        console.log(err);
        $('.login-error').text('Something has gone wrong, please try again');
        setTimeout(() => {
            $('.login-error').text('');
        }, 5000);
    }
}

$(window).on('load', function() {
    let queryString = window.location.search;
    if (queryString) {
        let urlParam = new URLSearchParams(queryString);
        let authParam = urlParam.get('auth');
        userAuth = authParam;
        loadDashboard(userAuth);
    }
});

function loadDashboard(authKey) {
    console.log(userAuth)
    if (authKey === 'admin') {
        $('[data-auth=admin]').show();
    } else {
        $('[data-auth=admin]').hide();
    } 
}

$('.login-btn').on('click', function() {
    let nameVal = $('#qb-username').val();
    let passVal = $('#qb-password').val();

    let userData = {
        username: nameVal,
        password: passVal
    }

    loginUser(userData).then(() => {
        loadDashboard();
    });
});

$('.logout').on('click', function() {
    window.location.replace(window.location.href.substr(0, (window.location.href.lastIndexOf("/"))) + "/index.html");
});

/*Add users*/

async function registerUser(userData) {
    try {
        const response = await fetch ('http://localhost:5000/register', {
            method: 'post',
            body: JSON.stringify(userData),
            headers: {'Content-Type': 'application/json'}
        });
        const data = await response.json();
        console.log(data);

        $('.user-mng-overlay').fadeIn();
    }
    catch (err) {
        $('.add-user-error').text('Something has gone wrong, please try again');
        setTimeout(() => {
            $('.add-user-error').text('');
        }, 5000);
        console.log(err)
    }
}

$('#add-user').on('click', function() {
    let nameVal =  $('#username').val();
    let passVal = $('#password').val();
    let authLevel = $('[name=auth-level]:checked').val();

    let userData = {
        username: nameVal,
        password: passVal,
        auth: authLevel
    }

    registerUser(userData).then(() => {
        $('#username, #password').val('');
        $('[value=student]').prop('checked', true);
    });
});

$('.user-mng-overlay button').on('click', function() {
    $(this).parent().fadeOut();
});

/*Quizzes functionality*/ 

function loadQuizzes() {
    //if basic auth, add class to open buttons
}

$('.add-new').on('click', function() {
    $('.dashboard').hide();
    $('.edit-quiz-page').show();
});

$('.cancel').on('click', function() {
     $('.confirm-overlay').fadeIn();
});

$('.confirm-overlay button').on('click', function() {
   if ($(this).hasClass('yes-cancel')) {
        $(this).parent().hide();
        $('.dashboard').show();
        $('.edit-quiz-page').hide();
   } else {
       $(this).parent().fadeOut();
   }
});

$(document).on('click', '.add-option', function() {
    let optionsDiv = $(this).parent().children();
    let options = $(optionsDiv).children().length;
    let number = $(this).parent().attr('data-number');
    let letter;
    
    if (options == 2) {
        letter = 'c';
    } else if (options == 3) {
        letter = 'd';
        $(optionsDiv).parent().children('.add-option').hide();
        //$(optionsDiv).parent().children('.add-option').text('remove option'); //fix this later - not crucial
    } else if (options > 3) {
        //$(optionsDiv).children().last().remove();
        //$(optionsDiv).parent().children('.add-option').text('+ add option');
        return;
    } else {
        alert('Quiz questions must have at least 2 answers'); //add feedback for users for 2 answers min
        return;
    }
    
    let answerWrap = document.createElement('div');
    answerWrap.classList = 'option';
    let answerLabel = document.createElement('label');
    $(answerLabel).attr('for', number + '-' + letter);
    $(answerLabel).text(letter + '.');
    let answerInput = document.createElement('input');
    $(answerInput).attr({'type':'text', 'class':'quiz-input answer-input', 'name':number + '-' + letter, 'id': number + '-' + letter});
    $(answerWrap).append(answerLabel, answerInput);
    $('.quiz-answers-' + number).append(answerWrap);
});

$('.add-question').on('click', function() {
    let currentQuizLength = $(this).parent().children('.quiz-questions').children('.question').last().attr('data-number');
    let newLength = parseInt(currentQuizLength) + 1;
    
    let questionWrap = document.createElement('div');
    $(questionWrap).attr({'class':'question', 'data-number': newLength});
    let qLabel = document.createElement('label');
    $(qLabel).attr('for','q-' + newLength);
    $(qLabel).text(newLength + '.');
    let qInput = document.createElement('input');
    $(qInput).attr({'type':'text','class':'quiz-input question-input', 'name': 'q-' + newLength, 'id':'q-' + newLength});
    
    let answersList = document.createElement('div');
    $(answersList).attr({'class':'answers-list','data-number':newLength});
    let inputList = document.createElement('div');
    inputList.classList = 'quiz-answers-' + newLength;
    let opt1 = document.createElement('div');
    opt1.classList = 'option';
    let label1 = document.createElement('label');
    $(label1).attr('for', newLength + '-a');
    $(label1).text('a.');
    let input1 = document.createElement('input');
    $(input1).attr({'type':'text', 'class':'quiz-input answer-input', 'name': newLength + '-a', 'id': newLength + '-a'});
    $(opt1).append(label1, input1);
    let opt2 = document.createElement('div');
    opt2.classList = 'option';
    let label2 = document.createElement('label');
    $(label2).attr('for', newLength + '-b');
    $(label2).text('b.');
    let input2 = document.createElement('input');
    $(input2).attr({'type':'text', 'class':'quiz-input answer-input', 'name': newLength + '-b', 'id': newLength + '-b'});
    $(opt2).append(label2, input2);
    
    $(inputList).append(opt1, opt2);
    let addOption = document.createElement('a');
    addOption.classList = 'add-option';
    $(addOption).text('+ add another option');
    $(answersList).append(inputList, addOption);
    
    $(questionWrap).append(qLabel,qInput, answersList);
    $('.quiz-questions').append(questionWrap);
});


/*For assistant view*/
$('.print-info button').on('click', function() {
   $(this).parent().fadeOut(); 
});

/*For user management*/
$('.mng-users').on('click', function() {
    $('.dashboard').hide();
    $('.user-mng-page').show();
});

$('.to-dash').on('click', function() {
    $('.user-mng-page').hide();
    $('.dashboard').show();
});


