var background = null;
var aKey = '258A446529D3202628392EB73D0A2ADD';
function crop(image, x, y, width, height, fn){
    x = x || 0;
    y = y || 0;
    width = width || 506;
    height = height || 506;
    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    var context = canvas.getContext('2d');
    $('#bgImgEl').load(function(){
        context.drawImage(document.getElementById('bgImgEl'), -x, -y);
        fn(canvas.toDataURL('image/jpeg'));
    });

}
function getImageBase64(image, fn){
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext("2d");
    var img = new Image();
    img.crossOrigin = 'anonymous';
    $('#bgImgEl').attr('src', null);

    img.onload = function(){
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        $('#bgImgEl').attr('src', canvas.toDataURL());
        fn(canvas.toDataURL());
    }

    img.src = 'http://getmy.hol.es/image.php?i=' + image;

}
function reloadImages(){
    if(window.location.hash && window.location.hash.indexOf('#login') == -1
        && window.location.hash.indexOf('#logout') == -1){
        var bg = window.location.hash.slice(1);
        if(bg.indexOf('http') == -1){
            bg = "http://" + bg;
        }
        window.localStorage.setItem('bg', bg)
    }
    background = window.localStorage.getItem('bg');
    if(background == null){
        background = 'http://cdn.steamcommunity.com/economy/image/MtXlHWF55M17HMMx2SfBJ4qZL6wlCeqNr9IQKz3BiYD73tLmOGWi39vF38__R4-th4w2v3BLqJWk3w0zPMKIh_bawaYmbbHd2piTyeYNkarN32PkLBH1z_qBGnwrhsjcooXDvncztILd3ISSpA7I7drbPu4nFfTZ_I5BcyXTzNS02dLu';
    }
    $('#bg1').css("background-image",  "url('" + background + "')");
    $('#bg2').css("background-image",  "url('" + background + "')");
    getImageBase64(background, function(lImage){
        var ImageType = $('#bgImgEl').width() > 2000 ? 1 : 0;
        var h1 = $('#hBig1').height() - 3;
        var h2 = $('#hBig2').height() - 3;
        var rOffset1 = $('#hBig1').offset().top - $('.profile_header').offset().top + 1;
        var rOffset2 = $('#hBig2').offset().top - $('.profile_header').offset().top + 1;
        crop(lImage, 508 + 140 * ImageType, rOffset1, 506, h1, function(data){
            $('#big1').attr('src', data);
        });
        crop(lImage, 1022 + 140 * ImageType, rOffset1, 100, 80, function(data){
            $('#r11').attr('src', data);
        });
        crop(lImage, 1022 + 140 * ImageType, rOffset1 + 93, 100, 80, function(data){
            $('#r12').attr('src', data);
        });
        crop(lImage, 1022 + 140 * ImageType, rOffset1 + 186, 100, 80, function(data){
            $('#r13').attr('src', data);
        });
        //SECOND
        crop(lImage, 508 + 140 * ImageType, rOffset2, 506, h2, function(data){
            $('#big2').attr('src', data);
        });
        crop(lImage, 1022 + 140 * ImageType, rOffset2, 100, 80, function(data){
            $('#r21').attr('src', data);
        });
        crop(lImage, 1022 + 140 * ImageType, rOffset2 + 93, 100, 80, function(data){
            $('#r22').attr('src', data);
        });
        crop(lImage, 1022 + 140 * ImageType, rOffset2 + 186, 100, 80, function(data){
            $('#r23').attr('src', data);
        });
        //AVATAR
        crop(lImage, 499 + 140 * ImageType, 19, 184, 184, function(data){
            $('#avatar').attr('src', data);
        });
    });
}

function createInventory(id){
    $.ajax('http://getmy.hol.es/sth.php?id=' + id).done(function(data){
        response = JSON.parse(data);
        response.backgrounds.forEach(function(back){
            var itemHolder = $("<div>", {class: "itemHolder", alt: back.name.toLowerCase() + " " + back.type.toLowerCase()});
            var item = $("<div>", {class: "item app753 context6 activeInfo"});
            var bgUrl = $("<a>", {href: "index.html#" + back.actions[0].link, class: "inventory_item_link"});
            var img = $("<img>", {src: "http://steamcommunity-a.akamaihd.net/economy/image/" + back.icon_url + "/96fx96f"});
            $(bgUrl).append(img);
            $(item).append(bgUrl);
            $(itemHolder).append(item);
            $('#cardsList').append(itemHolder);
        });
        $(response.page).find('.profile_customization').each(function(){
            $('.profile_customization_area').append(this);
        });
        addArrows();
    });
}


function loginFunc(){
    if(window.location.hash.indexOf('#login') !== -1){
        var userId = window.location.hash.substr(window.location.hash.indexOf("&openid.identity") -17, 17)
        window.localStorage.setItem('SteamId', userId);
        window.location.href = window.location.href.split('#')[0];
    }
    if(window.location.hash.indexOf('#logout') !== -1){
        window.localStorage.removeItem('SteamId');
        window.location.href = window.location.href.split('#')[0];
    }
}
function addArrows(){
    $('.profile_customization_header').each(function(){
        $(this).append('<span style="float: right" class="arrow down" onclick="elemDown(this);">Down &#8595;</span>' +
            '<span style="float: right" class="arrow up" onclick="elemUp(this);">Up &#8593;</span>');
    });;
}
function elemUp(elem){
    elem = $(elem).parent().parent();
    var x = $(elem).prev('.profile_customization');
    $(x).before(elem);
    $.smoothScroll({
        offset: $(elem).offset().top - 200,
        speed: 500,
        easing: 'swing'
    });
    reloadImages();
}
function elemDown(elem){
    elem = $(elem).parent().parent();
    var x = $(elem).next('.profile_customization');
    $(x).after(elem);
    $.smoothScroll({
        offset: $(elem).offset().top - 200,
        speed: 500,
        easing: 'swing'
    });
    reloadImages();
};

$(function () {
    loginFunc();

    var userId = null;
    userId = window.localStorage.getItem('SteamId');
    if(userId !== null){
        $('#steamAuth').append('<a href="#logout"><img src="data:image/png;base64,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"></a>');
        createInventory(userId);
    }
    else
    {
        $('#steamAuth').append('<a href="https://steamcommunity.com/openid/login?openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&openid.mode=checkid_setup&openid.return_to=http%3A%2F%2FSapic.GitHub.Io%2Findex.html%23login&openid.realm=http%3A%2F%2FSapic.GitHub.Io&openid.ns.sreg=http%3A%2F%2Fopenid.net%2Fextensions%2Fsreg%2F1.1&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select" class="name"><img src="http://cdn.steamcommunity.com/public/images/signinthroughsteam/sits_small.png"></a>');
        addArrows();
    }

    $('input:radio').change(
        function () {
            switch ($('input[type="radio"]:checked').val()){
                case 'nn':
                    $('#hBig1').css('height', 287);
                    $('#hBig2').css('height', 287);
                    break;
                case 'nb':
                    $('#hBig1').css('height', 287);
                    $('#hBig2').css('height', 509);
                    break;
                case 'bn':
                    $('#hBig1').css('height', 509);
                    $('#hBig2').css('height', 287);
                    break;
            }
            reloadImages();
        }
    );


    reloadImages();

    $(window).bind('hashchange', function() {
        loginFunc();
        //var val = $('input[type="radio"]:checked').val() == 'big' ? 1 : 0;
        reloadImages();
    });

    $('#filterIn').bind("change paste keyup", function() {
        $(".itemHolder").css('display', 'none');
        Enumerable.From($(".itemHolder")).Where(function(i){return i.attributes['alt'].value.indexOf($('#filterIn').val().toLowerCase()) != -1;})
            .Select().ToArray().forEach(function(elem){
                $(elem).css('display', 'block');
            });
    });
    $('#goUrl').click(function(){
        var url = $("#urlIn").val();
        if(url.indexOf('http') == -1){
            url = "http://" + url;
        }
        window.location.href = "index.html#" + url;
    });

    interact('.resizable')
        .resizable({axis: 'y' })
        .on('resizemove', function (event) {
            var target = event.target;
            // add the change in coords to the previous width of the target element
            var newHeight = parseFloat(target.style.height) + event.dy;
            if(newHeight >= 287 && newHeight <= 509){
                target.style.height = newHeight + 'px';
            }
            //target.textContent = newWidth + '×' + newHeight;
        })
        .on('resizeend', function(){
            reloadImages();
        });
    /*$(window).on({
     'mousewheel': function(e) {
     var y = window.pageYOffset;
     var up = e.originalEvent.wheelDeltaY > 0;
     var offset = 0;
     var topOff = $('#bg1').offset().top;
     switch(up){
     case true: offset = y > topOff ? topOff : 0;
     break;
     case false: offset = y >= topOff - 4 ? e.originalEvent.wheelDeltaY : topOff;
     break;
     }
     if(e.originalEvent.wheelDeltaY != offset){
     e.preventDefault();
     e.stopPropagation();
     $.smoothScroll({
     offset: offset,
     speed: 50
     });
     }
     }
     });*/
});