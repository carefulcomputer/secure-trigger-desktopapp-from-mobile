I started this project to solve a problem. I wanted to trigger a desktop app from my mobile phone. In addition I wanted it to be

0. Instantaneous
0. Secure (against replay attack, shouldn't require openeing a port on my home router)
0. Low cost

Here is solution I came up with. It uses Pushbullet (https://www.pushbullet.com/) push service. It is free for 100 requests a month (thus fulfilling 3rd criteria)
Things you need..

0. Pushbullet account (https://www.pushbullet.com/). Create a free one.
0. Tasker app on your mobile phone ( https://play.google.com/store/apps/details?id=net.dinglisch.android.taskerm )
0. Pushbullet plugin on your mobile phone ( https://play.google.com/store/apps/details?id=com.gerus.push.tasker ) 
0. Google authenticator on your mobile phone (https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2 ) 
0. A desktop (linux) with node installed.

Steps to setup-

0. Login to your pushbullet account and go to 'Settings'. Hit 'create access token' and copy paste the token and save it for later use.
0. Now we need to create a key for OTP generation. Go to https://emn178.github.io/online-tools/base32_encode.html (or any other Base32 encoding website) and enter a random string (that will used as key for generating OTP's). Make sure it is not guessabale/brute foreable and reasonable length. Copy paste the encoded string and save it for later use.
0. think of a name friendly name for your desktop. that is used for sending message to it from your mobile phone. it could be any string. save this for later use.
0. on mobile phone, start google authenticator and create a new entry using the key from step 2.
0. start tasker and create a profile with following details - 
 application -> authenticator
 task -> name:pushbullet, action -> plugin:Push Tasker -> Configuration -> Note -> Device:(device name from step 3), message - %CLIP .
 Then go back to profile and long press on 'Authenticator' and select '+' (we are going to add another context). Select 'Event' -> 'Variables' -> 'Variable Set' -> %CLIP in 'variable'. save everything.
 What this does is, as soon as you copy your OTP in google authenticator, it will send a push notification using pushbullet plugin to your desktop device.
0. On your desktop, download source code from this git repo in a folder. Do a npm install to download required packages. 
0. Edit notify.js, modify first three parameters to contain name of your device from step 3, your pushbullet access token from step 1, and base32 key from step 2.
0. run 'node nofiy.js'. It will start the listner. 
0. now on your phone start google authenticator and long press your OTP entry and copy to clipboard. It will trigger the plugin to get the content of clipboard (your OTP code) and send it via push notification. Your desktop will instantly receive it, generate it's local OTP, compare both codes and print it on console !
