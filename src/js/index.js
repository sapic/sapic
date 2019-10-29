import store from './store.everything.min.js'
import $ from './jquery.min.js'
import interact from './interact-1.2.9.min.js'
import ClipboardJS from './clipboard.js'
// import kofiwidget from './kofi.js'

window.$ = window.jQuery = $

var background = null;
var loadedBack = null;
var currentBGInfo = null;
var rAdsCount = 0;

var oddball = {
    refresh: false,
    hideBacks: false,
    refreshAngle: 0,
    holiday: false
};

var payload = {
    toggles: {
        SSSC_Enable: false,
        SSSC_Long: false,
        SSSC_Long_Minus70: false,
        SSSC_Rezied: false,
        AWSC_Enable: true,
        AWSC_Long: true,
        AWSC_Long_Minus70: false,
        AWSC_Resized: false,
        WSSC_Enable: false,
    },
    cropInfo: {
        order: {
            AWSC: 1,
            SSSC: 2,
            WSSW: 3,
        },
        customHeight: {
            AWSC: null,
            SSSC: null,
        }
    },
    background: null
};

var bgSaveInfo = {
    url: null,
    images: [],
};

var gAds = [
    '<ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-6718897784778373" data-ad-slot="7589608163" data-ad-format="auto"></ins>',
    '<ins class="adsbygoogle" style="display:inline-block;width:930px;height:180px" data-ad-client="ca-pub-6718897784778373" data-ad-slot="3019807768"></ins>',
    '<ins class="adsbygoogle" style="display:inline-block;width:728px;height:90px" data-ad-client="ca-pub-6718897784778373" data-ad-slot="4177836562"></ins>'
];

var backgroundsList = [
    'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/items/295930/e0f6de356eceb0706cf41f73406e79332766c0b1.jpg',
    'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/items/291930/67834da7ad6066a9fb0465bcff3bdbb0ca2c1052.jpg',
    'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/items/250760/3a483407f99b88c9f7572f37e64c92e3da37b3f1.jpg',
    'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/items/275200/168ae783ee29521e9e913a2b52f0c6f0ae6aa45a.jpg',
    'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/items/315850/53b7a0268f7780fe8c54529e2da172249b1fc7a3.jpg',
    'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/items/407330/b2b163f6eb8d22b01558d32704a5ae0b650c3267.jpg',
    'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/items/586620/c20f030f4a1f1f1acc416798a38620bc677881a4.JPG',
    'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/items/334560/68655a232a95859e1ee231ec321df597034df9b9.jpg',
    'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/items/246580/376bd17e6090c09e146eecdbe89277cff68dd78b.jpg',
    'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/items/357340/89bc1540601c476a8b1f39c2e5974dd8c4c5b164.jpg',
    'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/items/250420/0e8e91fda048556cf14a4926d62131e6c9355b3a.jpg',
    'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/items/301520/9acec2e625d7783cc470d4d67c5098da531864b1.jpg',
    'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/items/264320/7c8d85e76a849d5e84a0fe5b9130a4f4994ac174.jpg',
    'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/items/316260/65ff97e1371404850fd4ff655fc4488650ff346a.jpg',
    'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/items/324270/47a3cc4bc1756429008081dcec154c441bf5683d.jpg'
];

var donators = [
    '76561198055336237',
    '76561198369942542',
    '76561198048498731',
    '76561198028933492',
    '76561198015966799',
    '76561198120160633',
    '76561198354093369',
    '76561198111211059',
    '76561198071282886',
    '76561198083625927',
    '76561198078940441',
    '76561198047151845'
];

var banners = [
    ['donate.png', 'https://paypal.me/steamdesign'],
    ['share.png', 'https://twitter.com/intent/tweet?url=https%3A%2F%2Fsteam.design%2F&text=I%20made%20a%20cool%20Steam%20profile%20with%20this!%20It%27s%20so%20cool!%3A'],
    ['git.png', 'https://www.github.com/SAPIC/SAPIC']
];

var leftOffset = {
    0: 508,
    1: 648,
    2: 188,
    3: 545
};

var ImagesNames = {
    0: ['#avatar', 'Avatar.png'],

    10: ['#big1', 'Artwork_Middle.png'],
    11: ['#r11', 'Artwork_Right_Top.png'],
    12: ['#r12', 'Artwork_Right_Middle.png'],
    13: ['#r13', 'Artwork_Right_Bottom.png'],

    20: ['#big2', 'Screenshot_Middle.jpg'],
    21: ['#r21', 'Screenshot_Right_Top.jpg'],
    22: ['#r22', 'Screenshot_Right_Middle.jpg'],
    23: ['#r23', 'Screenshot_Right_Bottom.jpg'],

    30: ['#w1', 'Workshop_Left.png'],
    31: ['#w1', 'Workshop_Middle_Left.png'],
    32: ['#w1', 'Workshop_Middle.png'],
    33: ['#w1', 'Workshop_Middle_Right.png'],
    34: ['#w1', 'Workshop_Right.png'],
};

var randomBgsOrder = []

var randomBackground = function () {
    if (randomBgsOrder.length < 3) {
        for (var i = 0; i < 3; i++) {
            randomBgsOrder.push(Math.floor(Math.random() * backgroundsList.length))
        }
    }

    var preloader = $('#bgPreloader')
    preloader.html('')
    for (var i = 0; i < randomBgsOrder.length; i++) {
        var bgInfo = backgroundsList[randomBgsOrder[i]]
        var image = new Image()
        image.src = bgInfo.steamUrl
        preloader.append(image)
    }

    var bg = backgroundsList[randomBgsOrder.shift()];

    if (typeof bg !== 'string') {
        currentBGInfo = bg;
        var httpsLink = bg.steamUrl.replace('http://cdn.akamai.steamstatic.com/', 'https://steamcdn-a.akamaihd.net/');
        return httpsLink || 'https://steam.design/image/' + bg.url + '.jpg';
    } else {
        currentBGInfo = null;
        return bg;
    }
};

function getImageBase64(image, fn) {
    $('#bgImgEl').attr('src', null);

    $('#bgImgEl').attr('src', image);
    $('#bgImgEl').one("load", function () {
        loadedBack = image;
        fn();
    });
}

function noAds() {
    var bn = banners[Math.floor(Math.random() * banners.length)];
    $('.underfr').empty().html('<a href="' + bn[1] + '" target="_blank"><img src="./images/' + bn[0] + '"></a>');
    $('.rColAds').remove();
    $('.profile_badges').show();
}

function reloadAds() {
    // if (!window.localStorage) return;
    // if (rAdsCount % 10 !== 0) {
    //     rAdsCount++;
    //     return;
    // }
    // rAdsCount++;

    // var userId = window.localStorage.getItem('SteamId');
    // if (donators.indexOf(userId) !== -1) {
    //     return noAds();
    // }

    // $('.rColAds').html(gAds[0]);
    // (adsbygoogle = window.adsbygoogle || []).push({});

    // $('#bottomAds').html(gAds[1]);
    // (adsbygoogle = window.adsbygoogle || []).push({});

    // $('#topAds').html(gAds[2]);
    // (adsbygoogle = window.adsbygoogle || []).push({});
}

function reloadImages() {
    if (!window.localStorage) return;
    if (window.location.hash && window.location.hash.indexOf('#login') == -1 &&
        window.location.hash.indexOf('#logout') == -1) {
        var bg = window.location.hash.slice(1);
        if (bg.indexOf('http') == -1) {
            bg = "https://" + bg;
        }
        window.localStorage.setItem('bg', bg);
    }
    $('#cSize').css('height', '');
    background = window.localStorage.getItem('bg');
    if (background === null) {
        background = randomBackground();
        window.localStorage.setItem('bg', background);
    }

    $('#bg1').css("background-image", "url('" + background + "')");
    $('#bg2').css("background-image", "url('" + background + "')");

    if (background != loadedBack) {
        getImageBase64(background, function () {
            console.log('The current background URL is:', background);
            payloadHandler();
            reloadAds();
        });
    } else {
        CropImages();
    }
}

function CropImages() {
    setTimeout(function () {
        bgSaveInfo = {
            url: background,
            images: [],
        };
        payload.background = background;
        cropAWSC();
        cropSSSC();
        miscCrop();
        payload.bgSaveInfo = bgSaveInfo;
        $(".saveButton").attr("href", "https://steam.design/raw/" + btoa(JSON.stringify(bgSaveInfo)));
    }, 1);
}

function cropAWSC() {
    if (!payload.toggles.AWSC_Enable) {
        return;
    }

    var bgWidth = $('#bgImgEl').width();
    var ImageType = bgWidth > 2000
        ? 1
        : bgWidth <= 1280
            ? 2
            : bgWidth == 2000
                ? 3 : 0;
    var height = $('#hBig1').height();
    var h1 = $('#hBig1').height();
    var rOffset1 = $('#hBig1').offset().top - $('.profile_header').offset().top + 1;

    if (payload.toggles.AWSC_Long) {
        if (payload.toggles.AWSC_Long_Minus70) {
            var rightheight = height - 70;
        }
        var rightheight = height;
    } else {
        var rightheight = 80;
        fillSmallImages(1, 11);
        fillSmallImages(1, 12);
        fillSmallImages(1, 13);
    }

    fillImage($('#r11'), 514 + leftOffset[ImageType], rOffset1, 100, rightheight, ImagesNames[11][1]);
    fillImage($('#big1'), leftOffset[ImageType], rOffset1, 506, h1, ImagesNames[10][1], true);
}

function cropSSSC() {
    if (!payload.toggles.SSSC_Enable) {
        return;
    }
    var bgWidth = $('#bgImgEl').width();
    var ImageType = bgWidth > 2000
        ? 1
        : bgWidth <= 1280
            ? 2
            : bgWidth == 2000
                ? 3 : 0;
    var height = $('#hBig2').height();
    var h2 = $('#hBig2').height();
    var rOffset2 = $('#hBig2').offset().top - $('.profile_header').offset().top + 1;

    if (payload.toggles.SSSC_Long) {
        if (payload.toggles.SSSC_Long_Minus70) {
            var rightheight = height - 70;
        }
        var rightheight = height;
    } else {
        var rightheight = 80;
        fillSmallImages(2, 21);
        fillSmallImages(2, 22);
        fillSmallImages(2, 23);
    }

    fillImage($('#r21'), 514 + leftOffset[ImageType], rOffset2, 100, rightheight, ImagesNames[21][1]);
    fillImage($('#big2'), leftOffset[ImageType], rOffset2, 506, h2, ImagesNames[20][1], true);
}

function miscCrop() {
    var bgWidth = $('#bgImgEl').width();
    var ImageType = bgWidth > 2000 ? 1 :
        bgWidth <= 1280 ? 2 :
            bgWidth == 2000 ? 3 : 0;
    var rOffset3 = $('#w1').offset().top - $('.profile_header').offset().top + 1;

    if (payload.toggles.WSSC_Enable) {
        fillImage($('#w1'), 1 + leftOffset[ImageType], rOffset3, 119, 119, ImagesNames[30][1]);
        fillImage($('#w2'), 120 + leftOffset[ImageType], rOffset3, 119, 119, ImagesNames[31][1]);
        fillImage($('#w3'), 239 + leftOffset[ImageType], rOffset3, 119, 119, ImagesNames[32][1]);
        fillImage($('#w4'), 358 + leftOffset[ImageType], rOffset3, 119, 119, ImagesNames[33][1]);
        fillImage($('#w5'), 477 + leftOffset[ImageType], rOffset3, 119, 119, ImagesNames[34][1]);
    }

    fillImage($('#avatar'), leftOffset[ImageType] - 9, 34, 164, 164, ImagesNames[0][1]);
}

function fillSmallImages(sc, num) {
    var bgWidth = $('#bgImgEl').width();
    var ImageType = bgWidth > 2000 ? 1 :
        bgWidth <= 1280 ? 2 :
            bgWidth == 2000 ? 3 : 0;
    var defaultoffset = $('#hBig' + sc).offset().top - $('.profile_header').offset().top + 1;

    switch (num) {
        case 11:
        case 21:
            var rOffset = defaultoffset;
            break;
        case 12:
        case 22:
            var rOffset = defaultoffset + 93;
            break;
        case 13:
        case 23:
            var rOffset = defaultoffset + 186;
            break;
    }

    fillImage($('#r' + num), 514 + leftOffset[ImageType], rOffset, 100, 80, ImagesNames[num][1]);
}

function fillImage(element, x, y, w, h, name, changeCss) {
    if (!name) {
        name = 'unknownImage.png';
    }
    if (changeCss) {
        element.css("width", "100%");
        element.css("height", "100%");
    }
    element.css("background", "url('" + background + "') no-repeat");
    element.css("background-position", '-' + x + 'px -' + y + 'px');

    bgSaveInfo.images.push({
        name: name,
        x: Math.floor(x),
        y: Math.floor(y),
        w: Math.floor(w),
        h: Math.floor(h),
    });
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function createInventory(id) {
    if (!window.localStorage) return;
    var getitems = store.get('backpack');
    if (getitems && getitems.backgrounds !== null) {
        doInventoryThings(getitems);
    } else {
        var expire = Date.now() + 86400000;
        $.ajax('https://steam.design/backpack/' + id + '/items.json').done(function (data) {
            store.set('backpack', data, expire);
            if (data.backgrounds === null) {
                return privateInventory();
            }
            doInventoryThings(data);
        });
    }
    $("#hideBacksList, #refreshInventory, .filter").show();
    $(".guide").css("left", "0px");
}

function doInventoryThings(inventory) {
    (function () {
        var hide = store.get('hide');
        if (oddball.refresh === true) {
            clearInterval(oddball.refreshAngle);
            $("#refreshInventory").rotate({
                animateTo: 0
            });
            oddball.refresh = false;
        }

        inventory.backgrounds.forEach(function (back) {
            var httpsLink = back.actions[0].link.replace('http://cdn.akamai.steamstatic.com/', 'https://steamcdn-a.akamaihd.net/');
            if (hide === true) {
                $('.backsList').addClass('backsListHide');
            }
            var itemHolder = $("<div>", {
                class: "itemHolder",
                alt: back.name.toLowerCase()
            });
            var item = $("<div>", {
                class: "item app753 context6 activeInfo"
            });
            var bgUrl = $("<a>", {
                href: "#" + httpsLink,
                class: "inventory_item_link"
            });
            var img = $("<img>", {
                src: "https://steamcommunity-a.akamaihd.net/economy/image/" + back.icon_url + "/96fx96f"
            });
            $(bgUrl).append(img);
            $(item).append(bgUrl);
            $(itemHolder).append(item);
            $('#backsList').append(itemHolder);
        });
    })()
}

function privateInventory() {
    $('#backsList').hide();
    $('#backsList').css("max-height", "0px");
    $('#backsList').text("Either your inventory has no backgrounds, or is private.");
    $('#backsList').css("text-align", "center");
    setTimeout(function () {
        $('#backsList').show();
        $('#backsList').css("max-height", "20px");
    }, 500);
    $('#hideBacksList, #refreshInventory, .filter').toggleClass('filterHide');
}

function refreshInventory() {
    if (!window.localStorage) return;
    store.remove('backpack');
    $('#backsList').addClass('backsListHide');
    setTimeout(function () {
        $(".itemHolder").each(function () {
            $(this).remove();
        });
        userId = window.localStorage.getItem('SteamId');
        $.ajax('https://steam.design/backpack/' + userId + '/itemsRefresh.json').done(function (data) {
            var expire = Date.now() + 86400000;
            store.set('backpack', data, expire);
            doInventoryThings(data);
            setTimeout(function () {
                $('#backsList').removeClass('backsListHide');
            }, 20);
        });
    }, 150);
}

function loginFunc() {
    if (!window.localStorage) return;
    if (window.location.hash.indexOf('#login') !== -1) {
        var userId = window.location.hash.substr(window.location.hash.indexOf("&openid.identity") - 17, 17);
        window.localStorage.setItem('SteamId', userId);
        window.location.href = window.location.href.split('#')[0];
    }
    if (window.location.hash.indexOf('#logout') !== -1) {
        window.localStorage.removeItem('SteamId');
        window.location.href = window.location.href.split('#')[0];
    }
}

var arrows;

function addArrows() {
    if (arrows) {
        return;
    }
    arrows = true
    $('.profile_customization_header').not('.guide').each(function () {
        $(this).prepend('<span style="float: right" class="arrow down" onclick="moveElem(this,2);">Down <div class="fa fa-arrow-down" style="font-size:17px;"></div></span>' +
            '<span style="float: right" class="arrow up" onclick="moveElem(this,1);"">Up <div class="fa fa-arrow-up" style="font-size:17px;"></div></span>');
    });
}

function moveElem(elem, direction) {
    elem = $(elem).parent().parent();
    var x;
    if (direction == 1) {
        var elemprev = $(elem).prev('.profile_customization');
        elemprev.find('.locationvar').val($(this).val + 1);
        x = elemprev;
        $(x).before(elem);
    } else if (direction == 2) {
        x = $(elem).next('.profile_customization');
        $(x).after(elem);
    }
    $.smoothScroll({
        offset: $(elem).offset().top - 200,
        speed: 500,
        easing: 'swing'
    });
    reloadImages();
    setTimeout(function () {
        autoCropHeight();
    }, 100);
}

function getTextWidth(text, font) {
    var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    var context = canvas.getContext("2d");
    context.font = font;
    var metrics = context.measureText(text);
    return metrics.width;
}

function toggleCustomize() {
    getShareUrl(btoa(JSON.stringify(payload))).then(function (data) {
        var textWidth = getTextWidth('https://steam.design/s/' + data.ShortCode, "13px Arial");
        $('#shareWidth').css('width', Math.ceil(textWidth) + 5);
        $("#shareURL").val('https://steam.design/s/' + data.ShortCode);
    });

    $('#customize').toggle();
    $('#customizeBackground').fadeToggle();
    var hover = false;

    $('#customize').hover(function () {
        hover = true;
    }, function () {
        hover = false;
    });

    $('body').mouseup(function () {
        if (($('#customize').is(':visible')) && (!hover)) {
            closeCustomize();
        }
    });
}

function closeCustomize() {
    $('#customize').hide();
    $('#customizeBackground').fadeOut();
    addArrows();
    payloadHandler();
}

function closeCommunity() {
    $('#community_updates').hide();
    $('#customizeBackground').fadeOut();
    store.set('community', true);
}

window.customizeCheckboxHandler = function customizeCheckboxHandler(id) {
    trackClick('settings', id)
    var div = $('#' + id + '');
    var hiddenBelow = div.siblings('.hiddenBelow');

    switch (id) {
        case "SSSC_Checkbox":
            payload.toggles.SSSC_Enable = !payload.toggles.SSSC_Enable;
            if ($('#SSSC_Long_Checkbox').hasClass('checked')) {
                $('#SSSC_Long_Checkbox').trigger('click');
            }
            break;
        case "SSSC_Long_Checkbox":
            payload.toggles.SSSC_Long = !payload.toggles.SSSC_Long;
            if ($('#SSSC_Long_Minus70_Checkbox').hasClass('checked')) {
                $('#SSSC_Long_Minus70_Checkbox').trigger('click');
            }
            break;
        case "SSSC_Long_Minus70_Checkbox":
            payload.toggles.SSSC_Long_Minus70 = !payload.toggles.SSSC_Long_Minus70;
            break;
        case "AWSC_Checkbox":
            payload.toggles.AWSC_Enable = !payload.toggles.AWSC_Enable;
            if ($('#AWSC_Long_Checkbox').hasClass('checked')) {
                $('#AWSC_Long_Checkbox').trigger('click');
            }
            break;
        case "AWSC_Long_Checkbox":
            payload.toggles.AWSC_Long = !payload.toggles.AWSC_Long;
            if ($('#AWSC_Long_Minus70_Checkbox').hasClass('checked')) {
                $('#AWSC_Long_Minus70_Checkbox').trigger('click');
            }
            break;
        case "AWSC_Long_Minus70_Checkbox":
            payload.toggles.AWSC_Long_Minus70 = !payload.toggles.AWSC_Long_Minus70;
            break;
        case "WSSC_Checkbox":
            payload.toggles.WSSC_Enable = !payload.toggles.WSSC_Enable;
            break;
        default:
            console.log("How the hell?");
            break;
    }

    if (div.hasClass('checked')) {
        div.removeClass('checked');
    } else {
        div.addClass('checked');
    }
    if (hiddenBelow.length) {
        if (hiddenBelow.hasClass('hidden')) {
            hiddenBelow.removeClass('hidden');
        } else {
            hiddenBelow.addClass('hidden');
        }
    }
}

function shortenRight(showcase) {
    var bh = $('#big' + showcase + '').height();
    var uh = bh - 70;
    $('.r' + showcase + '').css('height', uh);
    $('.r' + showcase + '').addClass('shortened');
    $('.artwork_ammount_' + showcase + '').show();
}

function extendRight(showcase) {
    setTimeout(function () {
        var bh = $('#big' + showcase + '').height();
        $('.r' + showcase + '').css('height', bh);
        $('.r' + showcase + '').removeClass('shortened');
        $('.artwork_ammount_' + showcase + '').hide();
    }, 275);
}

function showDiv(showcase) {
    $('.showcase_' + showcase + '').removeClass('hidden');
}

function hideDiv(showcase) {
    $('.showcase_' + showcase + '').addClass('hidden');
}

function longImages(showcase) {
    var bh = $('#bgImgEl').height();
    var rOffset = $('#hBig' + showcase + '').offset().top - $('.profile_header').offset().top + 1;
    var autoHeight = bh - rOffset - 1;
    $('.hidelong' + showcase + '').addClass('hidden');
    $('.showlong' + showcase + '').removeClass('hidden');
    if (showcase == 1) {
        if (payload.toggles.AWSC_Resized) {
            return;
        }
    } else if (showcase == 2) {
        if (payload.toggles.SSSC_Resized) {
            return;
        }
    }
    $('#hBig' + showcase + '').css('height', autoHeight);
    $('.r' + showcase + '').css('height', autoHeight);
}

function autoCropHeight(showcase) {
    if (showcase == 1 && !payload.toggles.AWSC_Resized) {
        autoCropHeight_2(1);
        return;
    } else if (showcase == 2 && !payload.toggles.SSSC_Resized) {
        autoCropHeight_2(2);
        return;
    }

    if (payload.toggles.SSSC_Resized || payload.toggles.AWSC_Resized) {
        CropImages();
        return;
    }

    if (payload.toggles.SSSC_Long) {
        autoCropHeight_2(2);
    }
    if (payload.toggles.AWSC_Long) {
        autoCropHeight_2(1);
    }
}

window.autoCropHeight_2 = function autoCropHeight_2(showcase) {
    var bh = $('#bgImgEl').height();
    var rOffset = $('#hBig' + showcase + '').offset().top - $('.profile_header').offset().top + 1;
    var autoHeight = bh - rOffset - 1;
    if (autoHeight < 284) {
        $('.r' + showcase + '').css('height', 284);
        $('#hBig' + showcase + '').css('height', 284);
        reloadImages();
        return;
    }
    $('.r' + showcase + '').css('height', autoHeight);
    $('#hBig' + showcase + '').css('height', autoHeight);
    reloadImages();
}

function shortImages(showcase) {
    $('#hBig' + showcase + '').css('height', 506);
    $('.hidelong' + showcase + '').removeClass('hidden');
    $('.r' + showcase + '').css('height', 80);
    $('.showlong' + showcase + '').addClass('hidden');
    $('.artwork_ammount_' + showcase + '').show();
}

function loadb64() {
    window.location.href = "#" + payload.background;
    loadb64Checkboxes();
    setTimeout(function () {
        if (payload.cropInfo.customHeight.AWSC) {
            loadCustomHeight(1, payload.cropInfo.customHeight.AWSC);
        }
        if (payload.cropInfo.customHeight.SSSC) {
            loadCustomHeight(2, payload.cropInfo.customHeight.SSSC);
        }
    }, 200);
}

function loadb64Checkboxes() {
    if (payload.toggles.SSSC_Enable) {
        loadb64Checkboxes_2($('#SSSC_Checkbox'));
    }
    if (payload.toggles.SSSC_Long) {
        loadb64Checkboxes_2($('#SSSC_Long_Checkbox'));
    }
    if (payload.toggles.SSSC_Long_Minus70) {
        loadb64Checkboxes_2($('#SSSC_Long_Minus70_Checkbox'));
    }
    if (!payload.toggles.AWSC_Enable) {
        loadb64Checkboxes_2($('#AWSC_Checkbox'));
    }
    if (!payload.toggles.AWSC_Long) {
        loadb64Checkboxes_2($('#AWSC_Long_Checkbox'));
    }
    if (payload.toggles.AWSC_Long_Minus70) {
        loadb64Checkboxes_2($('#AWSC_Long_Minus70_Checkbox'));
    }
    if (payload.WSSC_Enable) {
        loadb64Checkboxes_2($('#WSSC_Checkbox'));
    }
}

function loadb64Checkboxes_2(elem) {
    var hiddenBelow = elem.siblings('.hiddenBelow');
    if (elem.hasClass('checked')) {
        elem.removeClass('checked');
    } else {
        elem.addClass('checked');
    }
    if (hiddenBelow.length) {
        if (hiddenBelow.hasClass('hidden')) {
            hiddenBelow.removeClass('hidden');
        } else {
            hiddenBelow.addClass('hidden');
        }
    }
}

function payloadHandler() {
    if (payload.toggles.SSSC_Enable) {
        showDiv(2);
        if (payload.toggles.SSSC_Long) {
            longImages(2);
            if (payload.toggles.SSSC_Long_Minus70) {
                setTimeout(function () {
                    shortenRight(2);
                }, 300);
            } else {
                extendRight(2);
            }
        } else {
            shortImages(2);
        }
    } else {
        hideDiv(2);
    }

    if (payload.toggles.AWSC_Enable) {
        showDiv(1);
        if (payload.toggles.AWSC_Long) {
            longImages(1);
            if (payload.toggles.AWSC_Long_Minus70) {
                shortenRight(1);
            } else {
                extendRight(1);
            }
        } else {
            shortImages(1);
        }
    } else {
        hideDiv(1);
    }

    if (payload.toggles.WSSC_Enable) {
        showDiv(3);
    } else {
        hideDiv(3);
    }
    reloadImages();
}

function loadCustomHeight(showcase, newHeight) {
    var bgHeight = $('#bgImgEl').height();
    var rightheight = newHeight - 70;
    if (showcase == 1) {
        $('.showcase_1').css('height', newHeight + 75);
        if (payload.toggles.AWSC_Long) {
            if (payload.toggles.AWSC_Long_Minus70 === true) {
                $('.r1').css('height', rightheight);
            } else {
                $('.r1').css('height', newHeight);
            }
        }

        if (newHeight >= 284 && newHeight <= bgHeight - 272) {
            $('#hBig1').css('height', newHeight + 'px');
        }
        payload.toggles.AWSC_Resized = true;
        $('#autoResize_AWSC').show();
        $('#autoResize_AWSC').click(function () {
            $('.showcase_1').css('height', '');
            autoCropHeight_2(1);
            $('#autoResize_AWSC').hide();
            closeCustomize();
        });
        if (payload.toggles.SSSC_Long) {
            autoCropHeight(2);
        }
    } else if (showcase == 2) {
        $('.showcase_2').css('height', newHeight + 75);
        if (payload.toggles.SSSC_Long) {
            if (payload.toggles.SSSC_Long_Minus70 === true) {
                $('.r2').css('height', rightheight);
            } else {
                $('.r2').css('height', newHeight);
            }
        }

        if (newHeight >= 284 && newHeight <= bgHeight - 272) {
            $('#hBig2').style.height = newHeight + 'px';
        }
        payload.toggles.SSSC_Resized = true;
        $('#autoResize_SSSC').show();
        $('#autoResize_SSSC').click(function () {
            $('.showcase_2').css('height', '');
            autoCropHeight_2(2);
            $('#autoResize_SSSC').hide();
            closeCustomize();
        });
        if (payload.toggles.AWSC_Long) {
            autoCropHeight(1);
        }
    }
}

function loadExtension(browser) {
    var extensionURL;
    var extensionBrowser;

    if (browser == 0) {
        extensionURL = "https://chrome.google.com/webstore/detail/steamdesign-buttons/mjmabgdoainclinjecbkdancpamdiaih"
        extensionBrowser = "Chrome"
    } else if (browser == 1) {
        extensionURL = "https://addons.mozilla.org/en-US/firefox/addon/steam-design-buttons/"
        extensionBrowser = "Firefox"
    }

    $('#extension').after(' | <a class="bb_link" href="' + extensionURL + '">' + extensionBrowser + ' Extension</a>')
}

window.onload = function () {
    if (window.location.hostname == "sapic.github.io") {
        window.location = 'https://steam.design/' + location.hash;
        return
    }

    try {
        // store.get('bgs')
        store.get('backpack')
        store.get('community')
        store.get('shared')
        store.get('hide')
    } catch (e) {
        // hack to clear store on migration
        store.clearAll()
    }

    if (navigator.userAgent.indexOf("Chrome") != -1) {
        loadExtension(0);
    } else if (navigator.userAgent.indexOf("Firefox") != -1) {
        loadExtension(1);
    }

    if (getParameterByName('base64') !== null) {
        payload = JSON.parse(atob(getParameterByName('base64')));
        store.set('shared', true);
        loadb64();
    }

    if (typeof shareinfo !== 'undefined') {
        payload = JSON.parse(atob(shareinfo));
        store.set('shared', true);
        loadb64();
    }

    $('#openCustomizeButton').click(function () {
        toggleCustomize();
    });

    $('#customizeClose').click(function () {
        closeCustomize();
    });

    $('#community_close').click(function () {
        closeCommunity();
    });

    var hideangle = 0;
    var hide = store.get('hide');
    if (hide === true) {
        hideangle = 180;
        oddball.hideBacks = true;
        $('#hideBacksList').rotate({
            animateTo: 180
        });
    }

    $('#hideBacksList').click(function () {
        oddball.hideBacks = !oddball.hideBacks;
        store.set('hide', oddball.hideBacks);
        hideangle += 180;
        $('#backsList').toggleClass('backsListHide');
        $('.filter').toggleClass('filterHide');
        $(this).rotate({
            animateTo: hideangle
        });
    });

    // $('#refreshInventory').rotate({
    //     bind: {
    //         mouseover: function () {
    //             var angle = 0;
    //             oddball.refreshAngle = setInterval(function () {
    //                 angle += 3;
    //                 $("#refreshInventory").rotate(angle);
    //             }, 15);
    //         },
    //         click: function () {
    //             oddball.refresh = true;
    //             if (!oddball.refresh) {
    //                 refreshInventory();
    //             }
    //         },
    //         mouseout: function () {
    //             if (oddball.refresh !== true) {
    //                 clearInterval(oddball.refreshAngle);
    //                 $("#refreshInventory").rotate({
    //                     animateTo: 0
    //                 });
    //             }
    //         }
    //     }
    // });

    // this.setImmediate(() => {
    var bgs = store.raw.get('bgs');
    if (!bgs || typeof bgs !== 'object') {
        var expire = new Date().getTime() + 86400000;
        $.ajax('https://steam.design/bg.json').done(function (data) {
            store.raw.set('bgs', data, expire);
            backgroundsList = data;
        });
    } else {
        backgroundsList = bgs;
    }
    // })
    loginFunc();

    setTimeout(function () {
        if (typeof fuckAdBlock === 'undefined') {
            noAds();
        }
    }, 10);

    $('.newmodal_header').append('<span class="title_text" style="padding: 32px 32px 0; display: block;">Customize Cropping</span>')

    var userId = null;
    if (!window.localStorage) return;
    userId = window.localStorage.getItem('SteamId');
    if (userId !== null) {
        $('#steamAuth').html('<a class="fa fa-sign-out" style="display:inline;position:relative;cursor:pointer;top:2px;left:-10px;color:#8f98a0;" title="Sign Out" href="#logout"></a>');
        createInventory(userId);
    } else {
        $('#invbuttons').css('margin-bottom', '0px')
        // $('#steamAuth').append('<a href="https://steamcommunity.com/openid/login?openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&openid.mode=checkid_setup&openid.return_to=http%3A%2F%2Fsteam.design%2Findex.html%23login&openid.realm=http%3A%2F%2Fsteam.design&openid.ns.sreg=http%3A%2F%2Fopenid.net%2Fextensions%2Fsreg%2F1.1&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select" class="name"><img src="https://steamcommunity-a.akamaihd.net/public/images/signinthroughsteam/sits_01.png" width="129" height="25"></a>');
    }

    reloadImages();

    $(window).bind('hashchange', function () {
        loginFunc();
        //var val = $('input[type="radio"]:checked').val() == 'big' ? 1 : 0;
        reloadImages();
    });

    $('#filterIn').bind("change paste keyup", function () {
        $(".itemHolder:not(.arrow)").css('display', 'none');
        Enumerable.From($(".itemHolder:not(.arrow)")).Where(function (i) {
            return i.attributes('alt').value.indexOf($('#filterIn').val().toLowerCase()) != -1;
        })
            .Select().ToArray().forEach(function (elem) {
                $(elem).css('display', 'block');
            });
    });
    $('#goUrl').click(function () {
        var url = $("#urlIn").val();
        if (url.length > 0) {
            if (url.match(/\.(jpeg|jpg|gif|png)$/)) {
                if (url.indexOf('http') == -1) {
                    currentBGInfo = null;
                    url = "https://" + url;
                }
            } else {
                $("#urlIn").val("Text inputted was not a direct image URL.");
            }
        } else {
            url = randomBackground();
        }
        trackClick('goURLButton', url);
        window.location.href = "#" + url;
    });

    interact('.resizable-awsc')
        .resizable({
            axis: 'y',
        })
        .on('resizemove', function (event) {
            var target = event.target;
            // add the change in coords to the previous width of the target element
            var newHeight = parseFloat(target.style.height) + event.dy;
            var showcase = newHeight + 75;
            var bgHeight = $('#bgImgEl').height();

            $('#cSize').css('height', showcase);
            if (payload.toggles.AWSC_Long) {
                if (payload.toggles.AWSC_Long_Minus70 === true) {
                    var rightheight = newHeight - 70;
                    $('.r1').css('height', rightheight);
                } else {
                    $('.r1').css('height', newHeight);
                }
            }

            if (newHeight >= 284 && newHeight <= bgHeight - 272) {
                target.style.height = newHeight + 'px';
            }

            payload.cropInfo.customHeight.AWSC = newHeight;
        })
        .on('resizeend', function () {
            payload.toggles.AWSC_Resized = true;
            $('#autoResize_AWSC').show();
            $('#autoResize_AWSC').click(function () {
                $('.showcase_1').css('height', '');
                autoCropHeight_2(1);
                $('#autoResize_AWSC').hide();
                closeCustomize();
            });
            if (payload.toggles.SSSC_Long) {
                autoCropHeight(2);
            } else {
                CropImages();
            }
        });
    interact('.resizable-sssc')
        .resizable({
            axis: 'y',
        })
        .on('resizemove', function (event) {
            var target = event.target;
            // add the change in coords to the previous width of the target element
            var newHeight = parseFloat(target.style.height) + event.dy;
            var showcase = newHeight + 75;
            var bgHeight = $('#bgImgEl').height();
            $('#sssc').css('height', showcase);
            if (payload.toggles.SSSC_Long) {
                if (payload.toggles.SSSC_Long_Minus70 === true) {
                    var rightheight = newHeight - 70;
                    $('.r2').css('height', rightheight);
                } else {
                    $('.r2').css('height', newHeight);
                }
            }

            if (newHeight >= 284 && newHeight <= bgHeight - 272) {
                target.style.height = newHeight + 'px';
            }

            payload.cropInfo.customHeight.SSSC = newHeight;
        })
        .on('resizeend', function () {
            payload.toggles.SSSC_Resized = true;
            $('#autoResize_SSSC').show();
            $('#autoResize_SSSC').click(function () {
                $('.showcase_2').css('height', '');
                autoCropHeight_2(2);
                $('#autoResize_SSSC').hide();
                closeCustomize();
            });
            if (payload.toggles.AWSC_Long) {
                autoCropHeight(1);
            } else {
                CropImages();
            }
        });

    $("#slFSize").on("change", function () {
        $('#hBig1').css('height', this.value);
        reloadImages();
    });
    $("#slSSize").on("change", function () {
        $('#hBig2').css('height', this.value);
        reloadImages();
    });
    $("#randomBG").click(function () {
        trackClick('randomBGButton');
        window.location.href = "#" + randomBackground();
    });
    $("#getBg").click(function () {
        var _goUrl = currentBGInfo && currentBGInfo.url ?
            "https://steamcommunity.com/market/listings/" + currentBGInfo.url :
            'https://images.google.com/searchbyimage?image_url=' + background;

        trackClick('getBGButton', _goUrl);

        window.open(_goUrl, '_newtab');
    });
    $(".saveButton").click(function () {
        trackClick('getZIPButton', $(this).attr('href'));
    });
    $('#openCustomizeButton').click(function () {
        trackClick('openCustomizeButton');
    });

    var clipboard = new ClipboardJS('.copy-btn');

    clipboard.on('success', function (e) {
        var el = $("#copiedNotification");

        el.fadeIn("fast", function () {
            el.fadeOut("slow");
        });

        e.clearSelection();
    });

    randomBgsOrder.push(Math.floor(Math.random() * backgroundsList.length))

    require('./jquery.smooth-scroll.min.js')
    require('./jQueryRotate.js')
    require('./social-likes.min.js')
    // setTimeout(() => {
    //     const kofi = kofiwidget()
    //     kofi.init('Support Us on Ko-fi', '#08090b', 'H2H8NYMB')
    //     const kofiHTML = kofi.getHTML()
    //     $("#kofiplace").html(kofiHTML)
    // }, 250)
}

function trackClick(where, subject) {
    ga('send', {
        hitType: 'event',
        eventCategory: 'userClick',
        eventAction: where,
        eventLabel: subject || 'click'
    });
}

function getShareUrl(base64) {
    return new Promise(function (resolve, reject) {
        var shortCode = store.get('shortCode' + base64);

        if (shortCode) {
            console.log(shortCode);
            return resolve(shortCode);
        }

        $.ajax('https://steam.design/shorten/' + base64)
            .done(function (data) {
                store.set('shortCode' + base64, data.code);
                resolve(data.code);
            });
    });
}