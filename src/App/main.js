import './main.scss'
const ProgressBar = require('progressbar.js')
const {$} = window

function initProgressBar() {
    let bar = new ProgressBar.Line('#progress-bar', {
        strokeWidth: 2,
        easing: 'easeInOut',
        duration: 1400,
        color: 'rgb(85, 112,71)',
        trailColor: 'transparent',
        trailWidth: 3,
        svgStyle: {width: '100%', height: '100%', borderRadius: "10px"}
    });
    bar.animate(0.15);
}

function createYearOptions() {
    let currYear = new Date().getFullYear()

    $("#fake_supporter_birthYear").append(`<option value="">出生年份</option>`);
    
    for (var i = 0; i < 80; i++) {
        let option = `<option value="01/01/${currYear-i}">${currYear-i}</option>`

        $("#fake_supporter_birthYear").append(option);
        $('#en__field_supporter_NOT_TAGGED_6').append(option);
    }
}

const resolveEnPagePetitionStatus = () => {
	let status = "FRESH";
	// console.log(window);
	if (window.pageJson.pageNumber === 2) {
		status = "SUCC"; // succ page
	} else {
		status = "FRESH"; // start page
	}

	return status;
};

const initForm = () => {
    console.log('init form')

    // $('#center_sign-submit').click(function(e){
    //     e.preventDefault();
    //     $("#fake-form").submit();
    //     console.log("fake-form submitting")
    // }).end()
    
    $.extend($.validator.messages, {
        required: "此欄位為必填",
    });

    $.validator.addMethod( //override email with django email validator regex - fringe cases: "user@admin.state.in..us" or "name@website.a"
        'email',
        function(value, element){
            return this.optional(element) || /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/i.test(value);
        },
        'Email 格式錯誤'
    );

    $.validator.addMethod(
        "taiwan-phone",
        function (value, element) {
            
            const phoneReg6 = new RegExp(/^(0|886|\+886)?(9\d{8})$/).test(value);
			const phoneReg7 = new RegExp(/^(0|886|\+886){1}[2-8]-?\d{6,8}$/).test(value);

            if ($('#fake_supporter_phone').val()) {
                return (phoneReg6 || phoneReg7)
            }
            console.log('phone testing')
            return true
        },
        "電話格式不正確，請只輸入數字 0912345678 和 02-23612351")

    $.validator.addClassRules({ // connect it to a css class
        "email": {email: true},
        "taiwan-phone" : { "taiwan-phone" : true }
    });

    $("#fake-form").validate({
        errorPlacement: function(error, element) {
            console.log(error)
            element.parents("div.form-field:first").after( error );
        },
        submitHandler: function(form) {
            
            $('#en__field_supporter_firstName').val($('#fake_supporter_firstName').val());
            $('#en__field_supporter_lastName').val($('#fake_supporter_lastName').val());
            $('#en__field_supporter_emailAddress').val($('#fake_supporter_emailAddress').val());
    
            if (!$('#fake_supporter_phone').prop('required') && !$('#fake_supporter_phone').val()) {
                $('#en__field_supporter_phoneNumber').val('0900000000');
            } else {
                $('#en__field_supporter_phoneNumber').val($('#fake_supporter_phone').val());
            }
            $('#en__field_supporter_NOT_TAGGED_6').val($('#fake_supporter_birthYear').val());
            $('#en__field_supporter_questions_7276').val(($('#fake_optin').prop("checked") ? "Y": "N"));
            
            console.log('en form submit')
            // console.log($('form.en__component--page').serialize())
            
            $("form.en__component--page").submit();
        },
        invalidHandler: function(event, validator) {
            // 'this' refers to the form
            var errors = validator.numberOfInvalids();
            if (errors) {
                console.log(errors)
                var message = errors == 1
                    ? 'You missed 1 field. It has been highlighted'
                    : 'You missed ' + errors + ' fields. They have been highlighted';
                $("div.error").show();
            } else {
                $("div.error").hide();
            }
        }
    });
}

function initPageEventHandler () {

    $(".hidden-part").hide()

    // $('.to-top-btn').click(function(e){
    //     $('#center_sign-submit').trigger('click')    
    // }).end()

    $('#center_sign-submit').click(function(e){
        e.preventDefault();
        
        if (!$("#center_sign-submit").hasClass("active")) {
            $(".hidden-part").fadeIn();
            $("#center_sign-submit").addClass("active");
        } else {
            $("#fake-form").submit();
            console.log("fake-form submitting");
        }

    }).end()

    $('.close-form-link').click(function(e){
        e.preventDefault();
        $(".hidden-part").fadeOut()
        $("#center_sign-submit").removeClass("active")
    }).end()

    // mobile transplant
    $(".sink--prev").on('click', function() {
        console.log('left')
        var $curPoint = $('.sink__spot.active');
        if($curPoint.next().length > 0) {
            $curPoint.next().trigger('click');
        }
        else {
            console.log($('.sink__spot:eq(0)'))
            $('.sink__spot:eq(0)').trigger('click');
        }
    })
    $(".sink--next").on('click', function() {
        console.log('right')
        var $curPoint = $('.sink__spot.active');
        if($curPoint.prev().length > 0) {
            $curPoint.prev().trigger('click');
        }
        else {
            console.log($('.sink__spot:eq(0)'))
            $('.sink__spot:last-child').trigger('click');
        }
    })
    $('.close-link').click(()=> {
        $('.sink__countries').removeClass('active');
        if ($('.sink__countries').hasClass('active')) {
            $('.sink__taiwan').css('z-index', 2)
        } else {
            $('.sink__taiwan').css('z-index', 4)
        }
    })

}

$(document).ready(function() {
    console.log( "ready!" );
    initPageEventHandler();
    initForm();
    initProgressBar();
    createYearOptions();
});
