// ==UserScript==
// @name         Guardian World Ambassador pushes hard (interval seconds)
// @version      0.1.11
// @description  batch timing
// @match        https://x.com/*
// @updateURL    https://killeveee.github.io/RunTimer_en.js
// @downloadURL  https://killeveee.github.io/RunTimer_en.js
// @require      https://killeveee.github.io/x_timer_second.js
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @connect      *
// ==/UserScript==
(function() {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
        .scheduler-btn {
            position: fixed;
            right: 20px;
            top: 20px;
            z-index: 9999;
            padding: 8px 16px;
            background: #e74c3c; /* Red color */
            color: white;
            border: none;
            border-radius: 9999px;
            cursor: pointer;
            font-weight: bold;
            font-size: 14px;
        }

        .scheduler-form {
            border: 1px solid #5e5e5e;
            position: fixed;
            right: 20px;
            top: 70px;
            background: black;
            padding: 16px;
            border-radius: 16px;
            box-shadow: rgb(101 119 134 / 20%) 0px 0px 15px, rgb(101 119 134 / 15%) 0px 0px 3px 1px;
            z-index: 9999;
            width: 300px;
            display: none;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }

        .scheduler-form input, .scheduler-form select, .scheduler-form textarea {
            width: 100%;
            max-width: 100%;
            min-width: 100%;
            margin-bottom: 12px;
            padding: 8px;
            border: 1px solid #5e5e5e;
            border-radius: 4px;
            font-size: 14px;
            box-sizing: border-box;
            background: black;
            color: white;
        }

        .scheduler-form label {
            display: block;
            margin-bottom: 6px;
            color: white;
            font-size: 13px;
            font-weight: 500;
        }

        .scheduler-form button {
            background: #e74c3c; /* Red color */
            border: none;
            border-radius: 9999px;
            padding: 8px 16px;
            font-weight: bold;
            cursor: pointer;
            font-size: 14px;
            margin-top: 8px;
        }

        .scheduler-form button:hover {
            background: #c0392b; /* Darker red on hover */
        }

        .scheduler-form #content {
            min-height: 120px;
            font-family: inherit;
            line-height: 1.5;
        }
    `;
    document.head.appendChild(style);

    const btn = document.createElement('button');
    btn.className = 'scheduler-btn';
    btn.textContent = 'Schedule';
    document.body.appendChild(btn);

    const form = document.createElement('div');
    form.className = 'scheduler-form';
    form.innerHTML = `
        <label>Started time（Please make our timezone at 24hr）</label>
        <input type="datetime-local" id="scheduler-startTime">

        <label>Minimum posting interval (second)</label>
        <input type="number" id="scheduler-minInterval" value="20" min="1">

        <label>Maximum posting interval (second)</label>
        <input type="number" id="scheduler-maxInterval" value="60" min="1">

        <label>Content（one row one tweet）</label>
        <textarea id="scheduler-c" style="height:78px;" placeholder="input content，one row one tweet"></textarea>

        <label>Random Emoji（Optional, if not filled in, it will not be added）</label>
        <textarea id="emoji-list" style="height:28px;">😊🥰😍🤗🥳😎🌟✨💫⭐️🌈🎉🎊💝💖💗💓💞💕❤️💜🧡💚💛💙🤍❤️‍🩹🎯🎪🎨🎭🎪🎡🎢🌅🌄☀️🌤️⛅️🌥️🌊🏖️🌿☘️🍀🌸🌺🌼🌻💐🌹🥀🦋🕊️🐣🐥🦄🦁🐯🦊🐨🐼🐷🐝🍎🍓🍒🍑🍊🍋🍍🥝🍇🥭🧁🍰🎂🍮🍪🍨🍧🍦🥤🧃🎈🎆🎇🏆🎖️🏅🥇👑💎💫🌠⚡️💪👊✌️🤝🙌👐🤲🫂🎵🎶🎹🎸🪕🎺📚💡💭💫🌈🎨🎯</textarea>

        <label id="show-tweetTime" style="color:#f0721f;padding:0 0 0 10px"></label>
        <label id="show-scheduleContent" style="color:#f0721f;padding:0 0 0 10px"></label>
        <button id="scheduler-generateBtn" style="background:#eff3f4;color:black;margin-right:3px">Start</button>
        <button id="scheduler-stopBtn" style="background:#f0721f">Stop</button>
        <button id="scheduler-scheduleBtn" style="background:#cdcdcd;color: #282828;float:right">View Progress</button>
    `;
    document.body.appendChild(form);
    let _x_ = "";
    btn.addEventListener('click', () => {
        _x_ = document.evaluate('//*[@id="react-root"]/div/div/div[2]/header/div/div/div/div[2]/div/button/div[2]/div/div[2]/div/div/div/span', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (!_x_){
            _x_=document.querySelector('[data-testid="SideNav_AccountSwitcher_Button"]');
            if(!_x_) {
                _x_=document.evaluate('//*[@id="layers"]/div[1]/div[2]/div/div/div/nav/a[6]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                if(!_x_)_x_ = "";
                else _x_ = _x_.href.split('x.com/')[1].split('/communities')[0];
            }
            else _x_ = "@" + _x_.querySelector('div:first-child').querySelector('div:first-child').getAttribute('data-testid').split("UserAvatar-Container-")[1]
        } else if (_x_.textContent)_x_ = _x_.textContent;
        else _x_ = "";
        console.log("username:", _x_);
        const isVisible = form.style.display === 'block';
        form.style.display = isVisible ? 'none' : 'block';
        var sc = localStorage.getItem('content');
        if (sc) {
            document.getElementById('scheduler-c').value = sc;
        }
        var tb = localStorage.getItem('tb');
        if (tb) {
            var nowTimestamp = new Date().getTime();
            var tbDeadlineTimestamp = parseInt(tb) + (24 * 60 * 60 * 1000);
            if (nowTimestamp > tbDeadlineTimestamp){
                localStorage.setItem(_x_ + 'tw', "");
                localStorage.setItem(_x_ + 'tweetNum', "");
                localStorage.setItem(_x_ + 'tc', "");
                localStorage.setItem(_x_ + 'tweetTime', "");
            }
        }
        updateSchedule();
    });
    const generateBtn = form.querySelector('#scheduler-generateBtn');
    if (generateBtn) {
        generateBtn.addEventListener('click', async () => {
            localStorage.setItem('on_off', 1);
            //getSchedeule();
            const emojisText = document.getElementById('emoji-list').value.trim();
            const emojis = Array.from(emojisText).filter(char => {
                return char.length > 1 || /\p{Emoji}/u.test(char);
            });
            localStorage.setItem('emojis', JSON.stringify(emojis));
            let c = document.getElementById('scheduler-c').value;
            if (c == '') {
                alert('Input your content');
                return;
            }
            localStorage.setItem('content', c);
            var startTimeInput = document.getElementById('scheduler-startTime').value;
            var minInterval = parseInt(document.getElementById('scheduler-minInterval').value);
            var maxInterval = parseInt(document.getElementById('scheduler-maxInterval').value);
            //var _x_ = document.evaluate('//*[@id="react-root"]/div/div/div[2]/header/div/div/div/div[2]/div/button/div[2]/div/div[2]/div/div/div/span', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.textContent;
            Run(c, startTimeInput, minInterval, maxInterval, _x_);
        });
    }
    const stopBtn = form.querySelector('#scheduler-stopBtn');
    if (stopBtn) {
        stopBtn.addEventListener('click', async () => {
            localStorage.setItem('on_off', 0);
            getSchedeule();
            updateSchedule();
        });
    }
    const scheduleBtn = form.querySelector('#scheduler-scheduleBtn');
    if (scheduleBtn) {
        scheduleBtn.addEventListener('click', async () => {
            getSchedeule();
        });
    }
    function getSchedeule() {
        var tweetTime = localStorage.getItem(_x_ + 'tweetTime');
        var scheduleContent = localStorage.getItem(_x_ + 'tc');
        var tweetNum = localStorage.getItem(_x_ + 'tweetNum');
        if (!tweetTime || !scheduleContent) {
            document.getElementById('show-scheduleContent').textContent = "nothing";
        } else {
            document.getElementById('show-tweetTime').textContent = "Scheduled" + tweetNum + "post last scheduled：" + tweetTime.replace(/"/g, '');
            document.getElementById('show-scheduleContent').textContent = scheduleContent.replace(/"/g, '');
        }
    }
    function updateSchedule() {
        var tw = localStorage.getItem(_x_ + 'tw');
        if (tw) {
            var dateObj = new Date(parseInt(tw)).toLocaleString('sv').replace(' ', 'T').slice(0, 16);;
            document.getElementById('scheduler-startTime').value = dateObj;
        }
    }
})();
