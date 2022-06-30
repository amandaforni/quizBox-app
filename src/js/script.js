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
        window.location.replace(window.location.href.substr(0, (window.location.href.lastIndexOf("/"))) + "/index.html?auth=" + userAuth);
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
    if (authKey === 'admin') {
        $('[data-auth=admin]').show();
    } else {
        $('[data-auth=admin]').hide();
    } 

    loadQuizzes();
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
    window.location.replace(window.location.href.substr(0, (window.location.href.lastIndexOf("/"))) + "/login.html");
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

$('.close').on('click', function() {
    $(this).parent().fadeOut();

    if ($(this).parent().hasClass('quiz-save-overlay')) {
        $('.edit-quiz-page').hide();
        $('.dashboard').show();
        loadQuizzes();
    }
});

/*Quizzes functionality*/ 

$('.reload').on('click', function() {
    loadQuizzes();
});

$('.add-new').on('click', function() {
    $('.question').not(':first').remove();
    $('.quiz-editor input').val('');
    $('.quiz-editor h2').text('Add a new quiz');
    $('.option').not('.def-opt').remove();
    $('#save-quiz').attr('data-id', 'new');
    $('.1-add').show();
    $('.1-div, .1-del').hide();
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

async function loadQuizzes() {
    $('.quiz-grid').empty();

    try {
        const response = await fetch('http://localhost:5000/quiz/getQuizzes')
        const data = await response.json();

        if (data.length == 0) {
            $('.quiz-grid').text("Oh no, no quizzes have been made yet!");
        }

        for (let i = 0; i < data.length; i++) {
            let quizTile = document.createElement('div');
            $(quizTile).attr({'data-id': data[i]._id, 'class':'quiz-tile column'});
            let titleSpan = document.createElement('span');
            titleSpan.classList = 'tile-info';
            $(titleSpan).text(data[i].title);
            let buttonDiv = document.createElement('div');
            buttonDiv.classList = 'tile-buttons';
            let openButton = document.createElement('button');
            openButton.classList = 'open-quiz';
            $(openButton).text('open');

            let quizData = data[i].questions;

            if (userAuth == 'admin') {
                $(quizTile).attr('data-info', JSON.stringify(quizData));
                let editButton = document.createElement('button');
                editButton.classList = 'edit-quiz';
                $(editButton).text('edit');
                let deleteButton = document.createElement('button');
                deleteButton.classList = 'delete-quiz';
                $(deleteButton).text('delete');
                buttonDiv.append(editButton, openButton, deleteButton);
            } else if (userAuth == 'assistant') {
                $(quizTile).attr('data-info', JSON.stringify(quizData));
                buttonDiv.append(openButton);
            } else {
                let questionsOnly = [];
                for (j = 0; j < quizData.length; j ++) {
                    questionsOnly.push(quizData[j].question);
                }
                
                $(openButton).addClass('student-open');
                $(quizTile).attr('data-info', JSON.stringify(questionsOnly));
                buttonDiv.append(openButton);
            }
            
            quizTile.append(titleSpan, buttonDiv);
            $('.quiz-grid').append(quizTile);
        }
    }
    catch (err) {
        $('.quiz-grid').text('Something has gone wrong! Please contact WebbiSkools helpdesk.')
        console.log('Get quizzes error:' + err)
    }
}

$(document).on('click', '.open-quiz', function() {
    var quizTitle = $(this).parent().parent().children('.tile-info').text();
    var quizData = JSON.parse($(this).parent().parent().attr('data-info'));

    if ($(this).hasClass('student-open')) {
        $('.student-quiz-name').text('');
        $('.quiz-q-preview').empty();

        for (let i = 0; i < quizData.length; i ++) {
            let number = i + 1;
            let questionSpan = document.createElement('span');
            questionSpan.classList = 'student-preview q-' + number;
            $(questionSpan).text(number + '. ' + quizData[i]);
            $('.quiz-q-preview').append(questionSpan);
        }

        $('.student-quiz-name').text(quizTitle);
        $('.dashboard').hide();
        $('.quiz-student-preview').show();
        return;
    } else {
        $('.print-quiz-name').text('');
        $('.print-questions').empty();

        for (let i = 0; i < quizData.length; i ++) {
            var number = i + 1;
            let questionDiv = document.createElement('div');
            questionDiv.classList = 'question-block column';
            let questionSpan = document.createElement('span');
            $(questionSpan).text(number + '. ' + quizData[i].question);
            let answersDiv = document.createElement('div');
            answersDiv.classList = 'print-answer-list column';

            for (let j = 0; j < quizData[i].options.length; j ++ ) {
                let answerSpan = document.createElement('span');
                if (j == 0) {
                    $(answerSpan).text('a. ' + quizData[i].options[j]);
                }
                if (j == 1) {
                    $(answerSpan).text('b. ' + quizData[i].options[j]);
                }
                if (j == 2) {
                    $(answerSpan).text('c. ' + quizData[i].options[j]);
                }
                if (j == 3) {
                    $(answerSpan).text('d. ' + quizData[i].options[j]);
                }

                $(answersDiv).append(answerSpan);
            }

            $(questionDiv).append(questionSpan, answersDiv);
            $('.print-questions').append(questionDiv);
        }
        
        $('.print-quiz-name').text(quizTitle);
        $('.dashboard').hide();
        $('.quiz-assistant-preview').show();
    }
});

$(document).on('click', '.edit-quiz', function() {
    $('.question').not(':first').remove();
    $('.quiz-editor h2').text('Edit quiz');
    var quizTitle = $(this).parent().parent().children('.tile-info').text();
    var quizId = $(this).parent().parent().attr('data-id');
    $('#save-quiz').attr('data-id', quizId);
    var quizData = JSON.parse($(this).parent().parent().attr('data-info'));
    for (let i = 0; i < quizData.length; i ++) {
        var number = i + 1;

        if (number == 1) {
            $('#q-1').val(quizData[i].question);

            for (let j = 0; j < quizData[i].options.length; j ++) {
                if (j == 0) {
                    $('#1-a').val(quizData[i].options[j]);
                }
                if (j == 1) {
                    $('#1-b').val(quizData[i].options[j]);

                    $('.1-div, .1-del').attr('style', 'display: none;');
                    $('.1-add').attr('style', 'display: inline;');
                }
                if (j == 2) {
                    var opt1 = document.createElement('div');
                    opt1.classList = 'option';
                    var label1 = document.createElement('label');
                    var input1 = document.createElement('input');
                    $(label1).attr('for', number + '-c');
                    $(label1).text('c.');
                    $(input1).attr({'type':'text', 'class':'quiz-input answer-input', 'name': number + '-c', 'id': number + '-c'});
                    $(input1).val(quizData[i].options[j]);

                    $('.1-div, .1-del, .1-add').attr('style', 'display: inline;');
                }
                if (j == 3) {
                    var opt1 = document.createElement('div');
                    opt1.classList = 'option';
                    var label1 = document.createElement('label');
                    var input1 = document.createElement('input');
                    $(label1).attr('for', number + '-d');
                    $(label1).text('d.');
                    $(input1).attr({'type':'text', 'class':'quiz-input answer-input', 'name': number + '-d', 'id': number + '-d'});
                    $(input1).val(quizData[i].options[j]);

                    $('.1-del').attr('style', 'display: inline;');
                    $('.1-div, .1-add').attr('style', 'display: none;');
                }

                $(opt1).append(label1, input1);
                $('.quiz-answers-1').append(opt1);
            }
        } else {
            let questionWrap = document.createElement('div');
            $(questionWrap).attr({'class':'question', 'data-number': number});
            let qLabel = document.createElement('label');
            $(qLabel).attr('for','q-' + number);
            $(qLabel).text(number + '.');
            let qInput = document.createElement('input');
            $(qInput).attr({'type':'text','class':'quiz-input question-input', 'name': 'q-' + number, 'id':'q-' + number});
            $(qInput).val(quizData[i].question);

            let answersList = document.createElement('div');
            $(answersList).attr({'class':'answers-list','data-number':number});
            let inputList = document.createElement('div');
            inputList.classList = 'quiz-answers-' + number;
            
            let addOption = document.createElement('a');
            addOption.classList = 'add-option';
            $(addOption).text('+ add another option');
            let divider = document.createElement('span');
            $(divider).attr('class','divider');
            $(divider).text(' | ');
            let removeOption = document.createElement('a');
            $(removeOption).attr('class','remove-option');
            $(removeOption).text('delete last answer');

            for (let j = 0; j < quizData[i].options.length; j ++) {
                var opt1 = document.createElement('div');
                opt1.classList = 'option';
                var label1 = document.createElement('label');
                var input1 = document.createElement('input');

                if (j == 0) {
                    $(label1).attr('for', number + '-a');
                    $(label1).text('a.');
                    $(input1).attr({'type':'text', 'class':'quiz-input answer-input', 'name': number + '-a', 'id': number + '-a'});
                    $(input1).val(quizData[i].options[j]);
                }
                if (j == 1) {
                    $(label1).attr('for', number + '-b');
                    $(label1).text('b.');
                    $(input1).attr({'type':'text', 'class':'quiz-input answer-input', 'name': number + '-b', 'id': number + '-b'});
                    $(input1).val(quizData[i].options[j]);

                    $(divider).attr('style', 'display: none;');
                    $(removeOption).attr('style', 'display: none;');
                    $(addOption).attr('style', 'display: inline;');
                }
                if (j == 2) {
                    $(label1).attr('for', number + '-c');
                    $(label1).text('c.');
                    $(input1).attr({'type':'text', 'class':'quiz-input answer-input', 'name': number + '-c', 'id': number + '-c'});
                    $(input1).val(quizData[i].options[j]);

                    $(divider).attr('style', 'display: inline;');
                    $(removeOption).attr('style', 'display: inline;');
                    $(addOption).attr('style', 'display: inline;');
                }
                if (j == 3) {
                    $(label1).attr('for', number + '-d');
                    $(label1).text('d.');
                    $(input1).attr({'type':'text', 'class':'quiz-input answer-input', 'name': number + '-d', 'id': number + '-d'});
                    $(input1).val(quizData[i].options[j]);

                    $(removeOption).attr('style', 'display: inline;');
                    $(divider).attr('style', 'display: none;');
                    $(addOption).attr('style', 'display: none;');
                }

                $(opt1).append(label1, input1);
                inputList.append(opt1);
            }

            $(answersList).append(inputList, addOption, divider, removeOption);
            $(questionWrap).append(qLabel,qInput, answersList);
            $('.quiz-questions').append(questionWrap);
        }
    }

    $('#quiz-title').val(quizTitle);

    $('.dashboard').hide();
    $('.edit-quiz-page').show();
});

async function saveQuiz(quizData) {
    try {
        const response = await fetch('http://localhost:5000/quiz/saveQuiz', {
            method: 'post',
            body: JSON.stringify(quizData),
            headers: {'Content-Type': 'application/json'}
        });
        const data = await response.json();

        $('.quiz-save-overlay').show();
    }
    catch (err) {
        console.log('save quiz error: ' + err);
    }
}

async function updateQuiz(quizData) {
    try {
        const response = await fetch('http://localhost:5000/quiz/updateQuiz', {
            method: 'post',
            body: JSON.stringify(quizData),
            headers: {'Content-Type': 'application/json'}
        });
        const data = await response.json();

        $('.quiz-save-overlay').show();
    }
    catch (err) {
        console.log('update quiz error: ' + err);
    }
}

$('#save-quiz').on('click', function() {
    let i = 1;  
    var fullQuiz = {};
    let quizTitle = $('#quiz-title').val();
    var questionList = [];

    $('.question').each(function() {
        var questionMap = {};
        let optionsList = [];
        let qNumber = i++;
        let quizQuestion = $('#q-' + qNumber).val();

        var optionA = $('#' + qNumber + '-a').val();
        var optionB = $('#' + qNumber + '-b').val();
        var optionC = $('#' + qNumber + '-c').val();
        var optionD = $('#' + qNumber + '-d').val();
        if (optionA !== undefined) {
            optionsList.push(optionA);
        }
        if (optionB !== undefined) {
            optionsList.push(optionB);
        }
        if (optionC !== undefined) {
            optionsList.push(optionC);
        }
        if (optionD !== undefined) {
            optionsList.push(optionD);
        }

        questionMap['question'] = quizQuestion;
        questionMap['options'] = optionsList;
        questionList.push(questionMap);
    });

    if ($(this).attr('data-id') !== 'new') {
        fullQuiz['quizId'] = $(this).attr('data-id');
    }

    fullQuiz['title'] = quizTitle;
    fullQuiz['questions'] = questionList;

    if ($(this).attr('data-id') !== 'new') {
        updateQuiz(fullQuiz);
        return;
    } else {
        saveQuiz(fullQuiz);
    }
});

$('.remove-question').on('click', function() {
    let currentQuizLength = parseInt($(this).parent().children('.quiz-questions').children('.question').last().attr('data-number'));
    if (currentQuizLength == 2) {
        $('.remove-question').hide();
    }
    $('.quiz-questions').children('.question').last().remove();
});

$('.add-question').on('click', function() {
    let currentQuizLength = $(this).parent().children('.quiz-questions').children('.question').last().attr('data-number');
    let newLength = parseInt(currentQuizLength) + 1;
    
    if (newLength > 1) {
        $('.remove-question').show();
    }
    
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
    let divider = document.createElement('span');
    $(divider).attr({'class':'divider', 'style':'display:none;'})
    $(divider).text(' | ');
    let removeOption = document.createElement('a');
    $(removeOption).attr({'class':'remove-option', 'style':'display:none;'})
    $(removeOption).text('delete last answer');
    $(answersList).append(inputList, addOption, divider, removeOption);
    
    $(questionWrap).append(qLabel,qInput, answersList);
    $('.quiz-questions').append(questionWrap);
});

$(document).on('click', '.add-option', function() {
    let optionsDiv = $(this).parent().children();
    let options = $(optionsDiv).children().length;
    let number = $(this).parent().attr('data-number');
    let letter;

    if (options == 2) {
        letter = 'c';
        $(optionsDiv).parent().children('.divider, .remove-option').show();
    } else if (options == 3) {
        letter = 'd';
        $(optionsDiv).parent().children('.divider, .add-option').hide();
        $(optionsDiv).parent().children('.remove-option').show();
    } else {
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

$(document).on('click', '.remove-option', function() {
    let number = $(this).parent().attr('data-number');
    let optionsDiv = $(this).parent().children('.quiz-answers-' + number);
    let options = $(optionsDiv).children().length;

    if (options == 3) {
        $(optionsDiv).parent().children('.add-option').show();
        $(optionsDiv).parent().children('.divider, .remove-option').hide();
    } else if (options == 4) {
        $(optionsDiv).parent().children('.divider, .add-option').show();
        $(optionsDiv).parent().children('.remove-option').show();
    } else {
        return;
    }

    $(optionsDiv).children().last().remove();
});

async function deleteQuiz(quizId) {
    let id = {quizId}

    try {
        const response = await fetch('http://localhost:5000/quiz/deleteQuiz', {
            method: 'post',
            body: JSON.stringify(id),
            headers: {'Content-Type': 'application/json'}
        });
        const data = await response.json();
        loadQuizzes();
    }
    catch (err) {
        console.log('delete quiz error:' + err); 
    }
}

$(document).on('click', '.delete-quiz', function() {
    let quizId = $(this).parent().parent().attr('data-id');

    deleteQuiz(quizId);
});

/*For assistant view*/
$('.print-info button').on('click', function() {
   $(this).parent().fadeOut(); 
});

/*For user management*/
$('.mng-users').on('click', function() {
    $('.dashboard').hide();
    $('.content-page').hide();    
    $('.user-mng-page').show();
});

$('.to-dash').on('click', function() {
    $('.content-page').hide();
    $('.dashboard').show();
});


