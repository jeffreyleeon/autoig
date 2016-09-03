/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var system = require('system');
var username = system.args[1];
var password = system.args[2];
var page = require('webpage').create();

page.open('https://instagram.com/accounts/login/',
    function (status) {
        if (status === "success") {
            function clickElement (identifier, method, position) {
                var point = page.evaluate(function (iden, meth, pos) {
                    if (meth === "id") {
                        var element = document.getElementById(iden);
                    } else if (meth === "tag") {
                        var element = document.getElementsByTagName(iden)[pos];
                    } else if (meth === "class") {
                        var element = document.getElementsByClassName(iden)[pos];
                        console.log('element ' + element);
                    }
                    var rect = element.getBoundingClientRect();
                    return {
                        x: rect.left + Math.floor(rect.width / 2),
                        y: rect.top + Math.floor(rect.height / 2)
                    };
                }, identifier, method, position);
                page.sendEvent('click', point.x, point.y);
            }
            clickElement('input', 'tag', 0);
            page.sendEvent('keypress', username);

            clickElement('input', 'tag', 1);
            page.sendEvent('keypress', password);
            
            page.render('before-submit.png');
            clickElement('button', 'tag', 0);
            console.log('======successsss');
        }
        setTimeout(function () {
            var error = page.evaluate(function () {
                var element = document.getElementById('errorAlert');
                var error_message = false;
                if (element !== null) {
                    error_message = element.innerText.trim();
                }
                return error_message;
            });

            page.render('after-submit.png');
            if (!error) {
                console.log('Login Successful: ' + page.url);
            } else {
                console.log('Login Failed: ' + error);
            }

            phantom.exit(0);
        }, 5000);
    }
);
