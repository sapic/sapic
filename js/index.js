background = null;
var oddball = {
   toggle: true,
   refresh: false,
   hidememes: false,
   ref: 0
};
var loadedBack = null;
var currentBGInfo = null;
var bgSaveInfo = {
   url: null,
   images: [],
};

var gAds = [
   '<ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-6718897784778373" data-ad-slot="7589608163" data-ad-format="auto"></ins>',
   '<ins class="adsbygoogle" style="display:inline-block;width:930px;height:180px" data-ad-client="ca-pub-6718897784778373" data-ad-slot="3019807768"></ins>',
   '<ins class="adsbygoogle" style="display:inline-block;width:728px;height:90px" data-ad-client="ca-pub-6718897784778373" data-ad-slot="4177836562"></ins>'
];
var version = '{{#vernum}}';
var backgroundsList = [
   'http://cdn.steamcommunity.com/economy/image/U8721VM9p9C2v1o6cKJ4qEnGqnE7IoTQgZI-VTdwyTBeimAcIoxXpgK8bPeslY9pPJIvB5IWW2-452kaM8heLSRgleGBp7RJxO94PvF90-StAl5z5OYSUWTjFxbU02aQe-apwlFmMZUsfRmhkpsZu94EC595SOKo4TzXhQ',
   'http://cdn.steamcommunity.com/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywUlj3Hz8JQD_k62zmnzAEbeQUdVBitsTVCj831QvuYDe0T1IhlssMAiXk4kwJ_MbbiZTIzc12VVfgOBKdipgm4D3E2vZA6Vo7m8bpffg6-vYLPLepsZ4si3kth',
   'http://cdn.steamcommunity.com/economy/image/tlNaNU_g3XH6RFG0zV3r-w4fkIQLkNMxLoqCrim7o1x_WG3OFvybY1qdTUrrPaVxAwqJl17SkSklh5-2KLiiW3Jcfo4I9IhhW8ABTPJ3u3ZJWdXMA4zMc3zWjqk2rbMJLlYulAf_3TNY1hoX5SLlNQNfhsNQiM49edff9zD84FwwX23G',
   'http://cdn.steamcommunity.com/economy/image/VIUbvgoMQo2PJ7q9EJSHpOzJ0Q9OfEzNW-lpp_RyzwOdjixFUxAEny_-pkM29Mku4dzIHBs-DtVQ5HS_9XHOBJCKPwVNGBedLqPqRS--1ymrj5RHRmBTjwzrMaPvMd0FytpsExZCFMMv5PcVOeOIY-CEwUdGYVaQB-w1o75iiwDSiSxN',
   'http://cdn.steamcommunity.com/economy/image/U8721VM9p9C2v1o6cKJ4qEnGqnE7IoTQgZI-VTdwyTBeimAcIoxXpgK8bPeslY9pPJIvB5IWW2-452kaM8heLSRgleGAprVJxe94baMhhbP9Cl53v-NAXDzjSkON1D-cfLr3kQVgNZF_ckurx5tMuoxSXJ95SOK8Ro2GBQ',
   'http://cdn.steamcommunity.com/economy/image/-L4j3a-QwWvDV8NCunNMtUDy6Wzr4M8rF5kQWF6VBBIxtRQm9oyHeWOO37ycEwI_Tefwf76ijTMclA1AX5YFFTyxB2bohJR7YtOTuoVZHDgHtKUv5_fQaUfESA1A0EcUYe5Tcbjalyk2loXgxVpALRq0qiSyq9Z_QstNAUbXQhN-shQu',
   'http://cdn.steamcommunity.com/economy/image/U8721VM9p9C2v1o6cKJ4qEnGqnE7IoTQgZI-VTdwyTBeimAcIoxXpgK8bPeslY9pPJIvB5IWW2-452kaM8heLSRgleGBpLZBwO94bqZ81OmsWQso7bJOUWbqGxOF3mTBebr6wFBtYJ0tJEz0wpwe7dkGWJ95SOK5GoWH9w',
   'http://cdn.steamcommunity.com/economy/image/U8721VM9p9C2v1o6cKJ4qEnGqnE7IoTQgZI-VTdwyTBeimAcIoxXpgK8bPeslY9pPJIvB5IWW2-452kaM8heLSRgleGBpbZIwO94OaYh0bOkDQ8oueUSV2bjSUaM3mWWfL36kQZhYMEucUjww55K6doGUZ95SOLfgjg9EA',
   'http://cdn.steamcommunity.com/economy/image/Zp_2ZGvfczsLttxIS01TA97TPNUvr31733gPUq-rG6SvlMGfMsM1KatvwLZtLR2J08YlxnrtP2PUdRJKrqgao6KQ0t8syyYrqjKMsHRnA46ZlXmdJ7NiOYokVQK2vQqgr86Gxn2WcH7_J5TrNzEIm9PCK512tWtwin8AVrjrC_ngk8GX',
   'http://cdn.steamcommunity.com/economy/image/U8721VM9p9C2v1o6cKJ4qEnGqnE7IoTQgZI-VTdwyTBeimAcIoxXpgK8bPeslY9pPJIvB5IWW2-452kaM8heLSRgleGBr7RNwu94b6kh1rL6XF9w7e5DAjG2FkeH1jSQKb37nVE0NpwqdRmmlptM5o8BCp95SOLQrFOUKA',
   'http://cdn.steamcommunity.com/economy/image/U8721VM9p9C2v1o6cKJ4qEnGqnE7IoTQgZI-VTdwyTBeimAcIoxXpgK8bPeslY9pPJIvB5IWW2-452kaM8heLSRgleGApbZLxO94aKQo1-asX1kp6uZPUjzrHkeHgTDBfe-rxlljYJQqdkrxyMwb7Y0CDJ95SOIWw5bAzQ',
   'http://cdn.steamcommunity.com/economy/image/U8721VM9p9C2v1o6cKJ4qEnGqnE7IoTQgZI-VTdwyTBeimAcIoxXpgK8bPeslY9pPJIvB5IWW2-452kaM8heLSRgleGApLZNyO94b6h_hej9DFQmu-ZHAjDlGEHW0TLHK-arklBlPZx8JkrxxJhI7t5eUJ95SOKYaskhXw',
   'http://cdn.steamcommunity.com/economy/image/dIYw9S9LGCpyDKnFVrgkrMzK-kRrOxZqpsJ637JebAu9jQcOdldeONLVtTtw2Gomwd_jVz55VHKtz2fHs11tDLCJFE5oX00604j5PWmSdCGLjL8MYycJKPbFdY_9SyAKv4URADFTGGmDy7MxKJF8ZsHdugUyIwxloJ52iP5OLwjyigcG',
   'http://cdn.steamcommunity.com/economy/image/U8721VM9p9C2v1o6cKJ4qEnGqnE7IoTQgZI-VTdwyTBeimAcIoxXpgK8bPeslY9pPJIvB5IWW2-452kaM8heLSRgleGApLZNyO94ZPIqg-f_CFwov7USBjSwFxLT1zeXfeuqwAQ3MZwnJ06gxpwfv4xUWp95SOIxq0nqrw',
   'http://cdn.steamcommunity.com/economy/image/uzXhRtM1Nd4Zk79t4hni5AN5K_eXRTuezV1sdwb_qkNyPta9iilzzLlKo5PEeaxuDmwy5MIHeYbGUHFvB_yrRH86xf2UIWDOuBfvld0zsmlEP26_n1kk3JEMNCYe779HcWuf5cwqY8q5UPDNnmW-flNoZrDLXS3FmQFmd0m-7kU9Oda1',
   'http://cdn.steamcommunity.com/economy/image/MtXlHWF55M17HMMx2SfBJ4qZL6wlCeqNr9IQKz3BiYD73tLmOGWi39vF38__R4-th4w2v3BLqJWk3w0zPMKIh_bawaYmbbHd2piTyeYNkarN32PkLBH1z_qBGnwrhsjcooXDvncztILd3ISSpA7I7drbPu4nFfTZ_I5BcyXTzNS02dLu',
   'http://cdn.steamcommunity.com/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywUlj3Hz8JQD_k62zmnzAEbeQUdVBitsTVCj831QvuYDe0T1IhgvMAHiXlukAQqbbTsNjQ_K13EAqNbBaQ88lHuCCVku8Y3DI7ipOJTKwvq59eULepsZx-Fpjs_',
   'http://cdn.steamcommunity.com/economy/image/rQ7gZXEkjBGjsMg5Or1BcBVCKtQ1VIJRd34bI95bCddkBdeeKDjKAwNp1Mcc3Q_6GFczx2AWwEl8cwY731gI0GkBxN42MNkBAjSYwQWXEf1SBG-SPkidEyN_R3bATEWAY1uWwWpliVJWdoOdFZQZv05SZpw6SM5ZI3xCIclNS4ArAteW',
   'http://cdn.steamcommunity.com/economy/image/sfR45LDLPdnSVqFMYlp9cQm4slX0uzOZBphyVoa8NdZ4_08f6dd7y3KPvbJEOjP7BK2rRqH5cYENlW9Oh7800XX7XF_332jJc9LxtF1wLfxO_vUW-6Us2weZLlXJ_iOFLqBbEvvUO8sjwOa5T3ch7lT7ohWtoHiWUZkuAM33cII3-E8X',
   'http://cdn.steamcommunity.com/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywUlj3Hz8JQD_k62zmnzAEbeQUdVBitsTVCj831QvuYDe0T1Ihts8gNiXk-xlYsNbO2Y241JFXGU6EIXqxipgvoWSVnscI2V4WzpO0CeF_ns4qTLepsZ5Tim8WM',
   'http://cdn.steamcommunity.com/economy/image/egvugw4EkL-or6YqpmdFWcJHJDJKdJ7_fGF1MEKBDf6zANl4VxjWrQh2utSABwvTz1I9IR823Od3bGgoQ4IM-b4EyjhJEMWvCSv20plNFdSFAWB0RG-BvS41LDBUxUGq5QvLIxNIxfpZbb-I1EtOnpIAZHcUb9TzLWYoNVnFGq_8B9lw',
   'http://cdn.steamcommunity.com/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywUlj3Hz8JQD_k62zmnzAEbeQUdVBitsTVCj831QvuYDe0T1IhgvMAHiXk6lAR9YrPjNDVlK1HDVvRfXvY58FjuDXZjscQ1VY7lo7kFe126vIbHLepsZ2INpctV',
   'http://cdn.steamcommunity.com/economy/image/t86yq5cpAaCwRYDLpsptCA-CeBrTWQ_gZItT0UIsJa9-xYVQzjVHshCcnDWAqiOCApdhCYYbTfhvhk7JQy8kqHPBlhDQPVSwEcHQM5ngPYVIxDRT3UIQojjZDIAOazL-esvABoFmV7YRi55p37ZilQbAaAvbRBDpMN1ZhltvN_kxwoVY',
   'http://cdn.steamcommunity.com/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywUlj3Hz8JQD_k62zmnzAEbeQUdVBitsTVCj831QvuYDe0T1Ihhs8kBiXk5yFh9ZbHtYTIxI1PHB_NdWa0-o1i5UCZkvMM1DILj875SeAW-ttaVLepsZ16V6HJk',
   'http://cdn.steamcommunity.com/economy/image/U8721VM9p9C2v1o6cKJ4qEnGqnE7IoTQgZI-VTdwyTBeimAcIoxXpgK8bPeslY9pPJIvB5IWW2-452kaM8heLSRgleGApbVNxu94aaB6guT5WAsl6eYSUzS2GUnR0TfHKeiplgJsPZN_dUyrx8kbutpUXJ95SOI5AtY8rw',
   'http://cdn.steamcommunity.com/economy/image/nIVT_Trkt6lru8Y-XYMADyTJmUx-lLnpv3UVJLllSKhVjmQGY_jxu8ti2sB7406FKdyAXyvW-_G0eAg8uGZJr1iKd0Z98OK5yj-WxmKpUIJjj94Nd4imq7sgHiSnclivA4B3DHek5biZKoCbdfkMlXSL1Ap92q6y4ihOffJ0D_saiWQO',
   'http://cdn.steamcommunity.com/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywUlj3Hz8JQD_k62zmnzAEbeQUdVBitsTVCj831QvuYDe0T1IhjscMHiXlqkAUpN7rnY242dFOXBfhfDqBopVjtUSRluJ82AtPmp-5QK1-5ttCQLepsZ2Js7cg7',
   'http://cdn.steamcommunity.com/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywUlj3Hz8JQD_k62zmnzAEbeQUdVBitsTVCj831QvuYDe0T1IhgtMEAiXk8kgMiMrXhNTJlJF2UWfcKBKM-plvtW3Fgu5U7UYK3pLlVKgvts4DBLepsZ5UWXj2j',
   'http://cdn.steamcommunity.com/economy/image/U8721VM9p9C2v1o6cKJ4qEnGqnE7IoTQgZI-VTdwyTBeimAcIoxXpgK8bPeslY9pPJIvB5IWW2-452kaM8heLSRgleGBr7ZMx-94O_Ys17P4CFwivrRGXTblSxOA1z6Qcb37xVM2N8Undhrxw5lN7dhVUZ95SOKr6GN5Nw',
   'http://cdn.steamcommunity.com/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywUlj3Hz8JQD_k62zmnzAEbeQUdVBitsTVCj831QvuYDe0T1IhntMUBiXk7wAUvbbezYGFlJVXAWfFYCKdvow3tCyMwvcI1V4S38b9ffAXntdPALepsZ5iNQ86u',
   'http://cdn.steamcommunity.com/economy/image/U8721VM9p9C2v1o6cKJ4qEnGqnE7IoTQgZI-VTdwyTBeimAcIoxXpgK8bPeslY9pPJIvB5IWW2-452kaM8heLSRgleGAp7ZNwe94ZfMv2Of5CF8n7bMVVTDjH0eA1jSSLr73xwVtZpR4cBuqxZcc6NdeWp95SOKzz5hkZg',
   'http://cdn.steamcommunity.com/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywUlj3Hz8JQD_k62zmnzAEbeQUdVBitsTVCj831QvuYDe0T1IhttccBiXk-lwd_NrvmZDUyK1ORWPNbDq1irFq-XHFm65A6VtLvorpTKA_utdPOLepsZylT2C2c',
   'http://cdn.steamcommunity.com/economy/image/dJuUMJnFLLZMajdZDGbv28zXXoHdtSL2mKTkQ-iAp3y9kKPLwNlqpOyzK6cqBqFRwcJHkoj3YO6Tqflb6YOme7CUsIve0Xmm7e5noTNMv1aLmhvD16oiosT16UCnleIhusjgwIDee6KwpCmscEiwQJPCSMnU-G-qzfLvEqXD4jeWrZQ=',
   'http://cdn.steamcommunity.com/economy/image/YUW2gparb2KJ3RQroMNoDdkJfDPS22EiXRPHMUQlIKqoToF5z7cpcCkECNWGoyaH1BxlIIeZIzpWHtopRSYhraVKkjnRvzpyKFlE05_pOICeTzx22MF-YA8Wm2ZbZDH_qBbDd4u0bnN1GQ-O3u00ldUYPHbRzCh_CESeNlIzYv_nSYFx',
   'http://cdn.steamcommunity.com/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywUlj3Hz8JQD_k62zmnzAEbeQUdVBitsTVCj831QvuYDe0T1Ihhs8kBiXk4xlMuY7rhNTVmc1WSUKUGWK1ioA6-WXVisZ5mUoWzpuwDfwXpsYPCLepsZ3N1ARHC',
   'http://cdn.steamcommunity.com/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywUlj3Hz8JQD_k62zmnzAEbeQUdVBitsTVCj831QvuYDe0T1IhsvMgMiXk-yVgjZOLiY29jI1yUBfcLWqM49wvvXSM3up8xANWw9u5ecA3tsIqSLepsZxGYyNE_',
   'http://cdn.steamcommunity.com/economy/image/4pqc9ZWgcwNGJ1N3QsQXNFrWVkTR0H1DkumAbaYiX5MrkasOzLw1Eeb-T4lkpFm-V8NPV4SSP1uZ5J11pyFelCaVuE7StCYT56MDj33uR7kdkBYB28piAcbo3W_tY02TKc7uUoK9chbk4h7Sa7kfrgaaQ1fdzjQbzrvcaL1iHpBklqsG',
   'http://cdn.steamcommunity.com/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywUlj3Hz8JQD_k62zmnzAEbeQUdVBitsTVCj831QvuYDe0T1IllsMAAiXluwAJ9YbC3NGcyIAGXVfEMDaFqowm7XSVh6sNlB47n8-JVcVrrtdOTLepsZwltQqgs',
   'http://cdn.steamcommunity.com/economy/image/UQntbeGsl5e7PBNvSM7QDulFJ9yl3JnXb_LAdawomKmYAtqWuLDRhRvlD5Furp6E5FA-z_Ce289k_91trSuZrpUGydamuMKHGrhDl3fkgIOuA2acqMeGlTmnkXa3aNqvz1ydnPrjlIVL_VnINeKJxeVVMM-uxdeLPvCaJbZqj_TXBdqe',
   'http://cdn.steamcommunity.com/economy/image/8YYJSqNZlPbeDuryEvukYUnKw_vnKZq2CsA56PYd7MY4jT6x-kXS5H7X9gw0m-rrRN_a6LJr2K4BzSTw9x7twTWJLfHkTcHmf4q6Ci3R9OwOhoK77SmB7AzHNrrvV67Aa9B67b4SlLYpnKZSbtau-xGI1bPlYNfrXZJivblZtskphw==',
   'http://cdn.steamcommunity.com/economy/image/U8721VM9p9C2v1o6cKJ4qEnGqnE7IoTQgZI-VTdwyTBeimAcIoxXpgK8bPeslY9pPJIvB5IWW2-452kaM8heLSRgleGApbNPwO94PqMp1rKsD14mvOUTVj2yF0DQgWWVe-b6lFI2ZpZ_IBnzkcsb79hSDJ95SOLwP2SMpQ'
];

var donators = [
   '76561198055336237',
   '76561198369942542',
   '76561198048498731',
   '76561198028933492',
   '76561198015966799',
   '76561198120160633',
   '76561198354093369',
   '76561198111211059'
];

var banners = [
   ['donations.jpg', 'https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=YUNGXPRNGZPNL'],
   ['noads.jpg', 'http://i.imgur.com/g9C38bN.gif'],
   ['song.jpg', 'http://www.youtube.com/watch?v=r50JFfofHes'],
   ['git.jpg', 'https://www.github.com/SAPIC/SAPIC']
];
var leftOffset = {
   0: 508,
   1: 648,
   2: 188
};

var getCurDate = function() {
   var today = new Date();
   var dd = today.getDate();
   var mm = today.getMonth() + 1; //January is 0!

   var yyyy = today.getFullYear();
   if (dd < 10) {
      dd = '0' + dd
   }
   if (mm < 10) {
      mm = '0' + mm
   }
   return yyyy + '-' + mm + '-' + dd + '_0000';
};

var curDate = getCurDate();
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
   32: ['#w1', 'Workshop_Middle_Right.png'],
   33: ['#w1', 'Workshop_Right.png'],
};

function convertDataURIToBinary(dataURI) {
   var base64 = dataURI.split(';base64,')[1];
   var raw = window.atob(base64);
   var rawLength = raw.length;
   var array = new Uint8Array(new ArrayBuffer(rawLength));

   for (i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
   }
   return array;
}

var randomBackground = function() {
   var bg = backgroundsList[Math.floor(Math.random() * backgroundsList.length)];
   if (typeof bg !== 'string') {
      currentBGInfo = bg;
      console.log(bg.hls);
      return bg.steamUrl || 'https://steam.design/image/' + bg.url + '.jpg';
   } else {
      currentBGInfo = null;
      return bg;
   }
};
var randomBanner = function() {
   return banners[Math.floor(Math.random() * banners.length)];
};

function crop(x, y, width, height, type, fn) {
   x = x || 0;
   y = y || 0;
   width = width || 506;
   height = height || 506;
   var imgType = type ? 'png' : 'jpeg';
   var canvas = document.createElement('canvas');
   canvas.width = width;
   canvas.height = height;

   var context = canvas.getContext('2d');
   if ($('#bgImgEl').width() > 1000) {
      context.drawImage(document.getElementById('bgImgEl'), -x, -y);
      fn(canvas.toDataURL('image/' + imgType, 1.0));
   } else {
      $('#bgImgEl').load(function() {
         context.drawImage(document.getElementById('bgImgEl'), -x, -y);
         fn(canvas.toDataURL('image/' + imgType, 1.0));
      });
   }
}

function getImageBase64(image, fn) {
   $('#bgImgEl').attr('src', null);

   $('#bgImgEl').attr('src', image);
   $('#bgImgEl').one("load", function() {
      loadedBack = image;
      fn();
   });
}

function getRandomInt(min, max) {
   return Math.floor(Math.random() * (max - min)) + min;
}

function bgChanged() {
   reloadAds();
}

function noAds() {
   var bn = randomBanner();
   $('.underfr').empty().html('<a href="' + bn[1] + '" target="_blank"><img src="images/' + bn[0] + '"></a>');
   $('.rColAds').remove();
   $('.profile_badges').show();
}

var rAdsCount = 0;

function reloadAds() {
   if (rAdsCount % 10 !== 0) {
      rAdsCount++;
      return;
   }
   rAdsCount++;

   var userId = window.localStorage.getItem('SteamId');
   if (donators.indexOf(userId) !== -1) {
      return noAds();
   }

   $('.rColAds').html(gAds[0]);
   (adsbygoogle = window.adsbygoogle || []).push({});

   $('#bottomAds').html(gAds[1]);
   (adsbygoogle = window.adsbygoogle || []).push({});

   if (!userId) {
      $('#topAds').html(gAds[2]);
      (adsbygoogle = window.adsbygoogle || []).push({});
   }
}

function reloadImages() {
   if (window.location.hash && window.location.hash.indexOf('#login') == -1 &&
      window.location.hash.indexOf('#logout') == -1) {
      var bg = window.location.hash.slice(1);
      if (bg.indexOf('http') == -1) {
         bg = "http://" + bg;
      }
      window.localStorage.setItem('bg', bg)
   }
   background = window.localStorage.getItem('bg');
   if (background == null) {
      background = randomBackground();
      window.localStorage.setItem('bg', background)
   }

   $('#bg1').css("background-image", "url('" + background + "')");
   $('#bg2').css("background-image", "url('" + background + "')");

   console.log('The current background URL is:', background);
   if (background != loadedBack) {
      getImageBase64(background, function() {
         CropImages();
         bgChanged();
         if (oddball.toggle) {
            var bgheight = $('#bgImgEl').height();
            var uh = bgheight - 272;
            $('#hBig1').css('height', uh);
            $('#r11').css('height', uh);
            $('#r11r').css('height', uh);
         }
      });
   } else {
      CropImages();
   }
}

function CropImages() {
   var bgheight = $('#bgImgEl').height();
   var uh = bgheight - 272;
   var bgWidth = $('#bgImgEl').width();
   var ImageType = bgWidth > 2000 ? 1 :
      bgWidth <= 1280 ? 2 : 0;
   var h1 = $('#hBig1').height();
   var h2 = $('#hBig2').height();
   var rOffset1 = $('#hBig1').offset().top - $('.profile_header').offset().top + 1;
   var rOffset2 = $('#hBig2').offset().top - $('.profile_header').offset().top + 1;
   var rOffset3 = $('#w1').offset().top - $('.profile_header').offset().top + 1;

   bgSaveInfo = {
      url: background,
      images: [],
   };

   if (oddball.toggle) {
      fillImage($('#big1'), leftOffset[ImageType], rOffset1, 506, h1, ImagesNames[10][1], true);
      fillImage($('#r11'), 514 + leftOffset[ImageType], rOffset1, 100, h1, ImagesNames[11][1]);
   } else {
      fillImage($('#big1'), leftOffset[ImageType], rOffset1, 506, h1, ImagesNames[10][1], true);
      fillImage($('#r11'), 514 + leftOffset[ImageType], rOffset1, 100, 80, ImagesNames[11][1]);
      fillImage($('#r12'), 514 + leftOffset[ImageType], rOffset1 + 93, 100, 80, ImagesNames[12][1]);
      fillImage($('#r13'), 514 + leftOffset[ImageType], rOffset1 + 186, 100, 80, ImagesNames[13][1]);

      fillImage($('#big2'), leftOffset[ImageType], rOffset2, 506, h2, ImagesNames[20][1], true);
      fillImage($('#r21'), 514 + leftOffset[ImageType], rOffset2, 100, 80, ImagesNames[21][1]);
      fillImage($('#r22'), 514 + leftOffset[ImageType], rOffset2 + 93, 100, 80, ImagesNames[22][1]);
      fillImage($('#r23'), 514 + leftOffset[ImageType], rOffset2 + 186, 100, 80, ImagesNames[23][1]);

      fillImage($('#w1'), 1 + leftOffset[ImageType], rOffset3, 150, 150, ImagesNames[30][1]);
      fillImage($('#w2'), 156 + leftOffset[ImageType], rOffset3, 150, 150, ImagesNames[31][1]);
      fillImage($('#w3'), 309 + leftOffset[ImageType], rOffset3, 150, 150, ImagesNames[32][1]);
      fillImage($('#w4'), 464 + leftOffset[ImageType], rOffset3, 150, 150, ImagesNames[33][1]);
   }

   fillImage($('#avatar'), leftOffset[ImageType] - 9, 34, 164, 164, ImagesNames[0][1]);

   $(".saveButton").attr("href", "https://steam.design/raw/" + btoa(JSON.stringify(bgSaveInfo)));
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

function toggleLong() {
   if (!oddball.toggle) {
      var bh = $('#bgImgEl').height();
      var uh = bh - 272;
      $('#hBig1').css('height', uh);
      $('.hidelong').hide();
      $('.r1').css('height', uh);
      oddball.toggle = true;
      $('.toggletext').text('Toggle Short Images');
   } else {
      $('#hBig1').css('height', 506);
      $('.hidelong').show();
      $('.r1').css('height', 80);
      oddball.toggle = false;
      $('.toggletext').text('Toggle Long Images');
   }
   CropImages();
}

function createInventory(id) {
   var hide = store.get('hide');
   var getitems = store.get('backpack');
   if (oddball.refresh == true) {
      clearInterval(oddball.ref);
      $("#refreshInventory").rotate({
         animateTo: 0
      });
      oddball.refresh = false;
   }
   if (getitems && getitems.backgrounds !== null) {
     doInventoryThings();
   } else {
      var expire = Date.now() + 86400000;
      $.ajax('https://steam.design/backpack/' + id + '/items.json').done(function(data) {
         store.set('backpack', data, expire);
         doInventoryThings();
      });
   }
   $("#hideBacksList").show();
   $("#refreshInventory").show();
   $(".filter").show();
   $(".guide").css("left", "0px")
}

function doInventoryThings() {
  var hide = store.get('hide');
  var getitems = store.get('backpack');
  getitems.backgrounds.forEach(function(back) {
     if (hide == true) {
        $('.backsList').hide();
     }
     var itemHolder = $("<div>", {
        class: "itemHolder",
        alt: back.name.toLowerCase()
     });
     var item = $("<div>", {
        class: "item app753 context6 activeInfo"
     });
     var bgUrl = $("<a>", {
        href: "#" + back.actions[0].link,
        class: "inventory_item_link"
     });
     var img = $("<img>", {
        src: "http://steamcommunity-a.akamaihd.net/economy/image/" + back.icon_url + "/96fx96f"
     });
     $(bgUrl).append(img);
     $(item).append(bgUrl);
     $(itemHolder).append(item);
     $('#backsList').append(itemHolder);
  });
}

function refreshInventory() {
   $(".itemHolder").each(function() {
      $(this).remove();
   });
   userId = window.localStorage.getItem('SteamId');
   $.ajax('https://steam.design/backpack/' + userId + '/itemsRefresh.json').done(function() {
      createInventory(userId);
   });
};

function loginFunc() {
   if (window.location.hash.indexOf('#login') !== -1) {
      var userId = window.location.hash.substr(window.location.hash.indexOf("&openid.identity") - 17, 17)
      window.localStorage.setItem('SteamId', userId);
      window.location.href = window.location.href.split('#')[0];
   }
   if (window.location.hash.indexOf('#logout') !== -1) {
      window.localStorage.removeItem('SteamId');
      window.location.href = window.location.href.split('#')[0];
   }
}

function addArrows() {
   $('.profile_customization_header').not('.guide').each(function() {
      $(this).prepend('<span style="float: right" class="arrow down" onclick="elemDown(this);">Down <div class="fa fa-arrow-down" style="font-size:17px;"></div></span>' +
         '<span style="float: right" class="arrow up" onclick="elemUp(this);">Up <div class="fa fa-arrow-up" style="font-size:17px;"></div></span>');
   });
}

function elemUp(elem) {
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

function elemDown(elem) {
   elem = $(elem).parent().parent();
   var x = $(elem).next('.profile_customization');
   $(x).after(elem);
   $.smoothScroll({
      offset: $(elem).offset().top - 200,
      speed: 500,
      easing: 'swing'
   });
   reloadImages();
}

$(function() {
   if (window.location.hostname == "sapic.github.io") {
      window.location = 'https://steam.design/' + location.hash;
   }

   var bgs = store.get('bgs');
   if (!bgs) {
      var expire = new Date().getTime() + 86400000;
      $.ajax('https://steam.design/bg.json').done(function(data) {
         store.set('bgs', data, expire);
         backgroundsList = data;
      });
   } else {
      backgroundsList = bgs;
   }

   var hideangle = 0;
   var hide = store.get('hide');
   if (hide == true) {
      hideangle = 180;
      oddball.hidememes = true;
      $('#hideBacksList').rotate({
         animateTo: 180
      });
   }

   $('#hideBacksList').click(function() {
      oddball.hidememes = !oddball.hidememes;
      store.set('hide', oddball.hidememes);
      hideangle += 180;
      $('#backsList').toggle('show');
      $(this).rotate({
         animateTo: hideangle
      });
   });


   $('#refreshInventory').rotate({
      bind: {
         mouseover: function() {
            var angle = 0;
            oddball.ref = setInterval(function() {
               angle += 3;
               $("#refreshInventory").rotate(angle);
            }, 15);
         },
         click: function() {
            oddball.refresh = true;
            refreshInventory();
         },
         mouseout: function() {
            if (oddball.refresh !== true) {
               clearInterval(oddball.ref);
               $("#refreshInventory").rotate({
                  animateTo: 0
               });
            }
         }
      }
   });
   addArrows();

   loginFunc();
   setTimeout(function() {
      if (typeof fuckAdBlock === 'undefined') {
         noAds();
      }
   }, 10);


   var userId = null;
   userId = window.localStorage.getItem('SteamId');
   if (userId !== null) {
      $('#steamAuth').append('<a href="#logout"><img src="data:image/png;base64,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"></a>');
      createInventory(userId);
   } else {
      $('#steamAuth').append('<a href="https://steamcommunity.com/openid/login?openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&openid.mode=checkid_setup&openid.return_to=http%3A%2F%2Fsteam.design%2Findex.html%23login&openid.realm=http%3A%2F%2Fsteam.design&openid.ns.sreg=http%3A%2F%2Fopenid.net%2Fextensions%2Fsreg%2F1.1&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select" class="name"><img src="https://steamcommunity-a.akamaihd.net/public/images/signinthroughsteam/sits_01.png" width="129" height="25"></a>');
   }

   reloadImages();

   $(window).bind('hashchange', function() {
      loginFunc();
      //var val = $('input[type="radio"]:checked').val() == 'big' ? 1 : 0;
      reloadImages();
   });

   $('#filterIn').bind("change paste keyup", function() {
      $(".itemHolder:not(.arrow)").css('display', 'none');
      Enumerable.From($(".itemHolder:not(.arrow)")).Where(function(i) {
            return i.attributes['alt'].value.indexOf($('#filterIn').val().toLowerCase()) != -1;
         })
         .Select().ToArray().forEach(function(elem) {
            $(elem).css('display', 'block');
         });
   });
   $('#goUrl').click(function() {
      var url = $("#urlIn").val();
      if (url.length > 0) {
         if (url.indexOf('http') == -1) {
            currentBGInfo = null;
            url = "http://" + url;
         }
      } else {
         url = randomBackground();
      }
      window.location.href = "#" + url;
   });

   interact('.resizable')
      .resizable({
         axis: 'y'
      })
      .on('resizemove', function(event) {
         var target = event.target;
         // add the change in coords to the previous width of the target element
         var newHeight = parseFloat(target.style.height) + event.dy;
         if (newHeight >= 284) {
            target.style.height = newHeight + 'px';
         }
         if (oddball.toggle) {
            $('#r11').css('height', newHeight);
         }
         //target.textContent = newWidth + '×' + newHeight;
      })
      .on('resizeend', function() {
         reloadImages();
      });

   $("#slFSize").on("change", function() {
      $('#hBig1').css('height', this.value);
      reloadImages();
   });
   $("#slSSize").on("change", function() {
      $('#hBig2').css('height', this.value);
      reloadImages();
   });
   $("#randomBG").click(function() {
      window.location.href = "#" + randomBackground();
   });
   $("#getBg").click(function() {
      if (currentBGInfo && currentBGInfo.url) {
         window.open("https://steamcommunity.com/market/listings/" + currentBGInfo.url)
         return;
      }
      window.open('https://images.google.com/searchbyimage?image_url=' + background, '_newtab');
   });
   $("#version").html("Version #" + version);
});
